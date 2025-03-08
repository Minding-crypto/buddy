import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import '../css/SwipePage.css';
import nin from '../Images/nen.png';
import profile from '../Images/image-removebg-preview (10).png';
import plus_btn from '../Images/plus_btn.png';
import cross_btn from '../Images/cross_btn.png';

const SwipePage = () => {
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('');
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLeftAnimating, setIsLeftAnimating] = useState(false);
  const [isRightAnimating, setIsRightAnimating] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [swipedGardenIds, setSwipedGardenIds] = useState([]);
  
  const db = getFirestore(app);
  const auth = getAuth();

  useEffect(() => {
    const auth = getAuth(app);
    
    // Add auth state listener
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setAuthChecked(true); // Mark that we've checked auth status regardless of result
      
      if (user) {
        try {
          // User is signed in, proceed with data fetching
          const db = getFirestore(app);
          
          // Get user's swipe history - create user doc if it doesn't exist
          const userDocRef = doc(db, 'users', user.uid);
          const userSnapshot = await getDoc(userDocRef);
          
          let userData;
          let swipedIds = [];
          
          if (userSnapshot.exists()) {
            userData = userSnapshot.data();
            swipedIds = userData?.swipedGardenIds || [];
          } else {
            // Create user document if it doesn't exist
            userData = {
              email: user.email,
              swipedGardenIds: []
            };
            await setDoc(userDocRef, userData);
          }
          
          setSwipedGardenIds(swipedIds);

          // Get all gardens not in swiped list
          const gardensSnapshot = await getDocs(collection(db, 'gardens'));
          const gardensData = gardensSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(garden => !swipedIds.includes(garden.id));

          setDeck(gardensData);
          setError('');
          setLoading(false);
          
        } catch (err) {
          setError("Failed to load user data: " + err.message);
          console.error(err);
          setLoading(false);
        }
      } else {
        // No user signed in, only redirect after we've checked auth state
        navigate('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleSwipe = (direction) => {
    if (deck.length === 0 || currentCardIndex >= deck.length) return;
    
    const currentGarden = deck[currentCardIndex];
    
    // Start animation
    if (direction === 'left') {
      setIsLeftAnimating(true);
    } else {
      setIsRightAnimating(true);
    }
    
    setAnimationClass(direction === 'left' ? 'swipe-left-animation' : 'swipe-right-animation');
    
    // After a brief animation delay, show the next card
    setTimeout(() => {
      // Move to next card immediately for responsive UI
      setCurrentCardIndex(prev => prev + 1);
      setAnimationClass('');
      setIsLeftAnimating(false);
      setIsRightAnimating(false);
      
      // If swiped right, navigate after showing next card
      if (direction === 'right') {
        navigate(`/Garden/${currentGarden.id}`);
      }
      
      // Update Firestore in the background (don't wait for it)
      updateSwipeHistory(currentGarden.id);
    }, 300); // Short animation time for snappiness
  };
  
  // Separate function to update Firestore in the background
  const updateSwipeHistory = async (gardenId) => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      const userDoc = doc(db, 'users', user.uid);
      const newSwipedIds = [...swipedGardenIds, gardenId];
      
      // Update local state immediately
      setSwipedGardenIds(newSwipedIds);
      
      // Check if document exists before updating
      const docSnap = await getDoc(userDoc);
      
      if (docSnap.exists()) {
        // Update Firestore in background
        updateDoc(userDoc, {
          swipedGardenIds: newSwipedIds
        }).catch(err => {
          console.error('Error updating swipe history:', err);
        });
      } else {
        // Create the user document if it doesn't exist
        setDoc(userDoc, {
          email: user.email,
          swipedGardenIds: newSwipedIds
        }).catch(err => {
          console.error('Error creating user document:', err);
        });
      }
    } catch (err) {
      console.error('Error with swipe history:', err);
    }
  };

  const gotoprofilepage = () => {
    navigate('/profilepage');
  };

  if (!authChecked || loading) {
    return (
      <div className="loading-container">
        <div className="loading-sprite"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  
  const noMoreCards = deck.length === 0 || currentCardIndex >= deck.length;
  
  return (
    <div className="deck-container">
      <img 
        src={profile} 
        className="profile" 
        alt="profile" 
        onClick={gotoprofilepage}
      />
      
      <div className="nintendo-div">
        <img src={nin} alt="nintendo" className="nintendo-img"/>
        <div className="screen">
        {!noMoreCards ? (
            <div key={deck[currentCardIndex].id} className={`screen-content ${animationClass}`}>
              <h3>{deck[currentCardIndex].name}</h3>
              <p className="problem-ps"><strong>Emotions:</strong> {deck[currentCardIndex].emotions.join(', ')}</p>
            
              <p className="problem-ps"><strong>Problem:</strong> {deck[currentCardIndex].problem}</p>
              <p className="problem-ps"><strong>Severity:</strong> {deck[currentCardIndex].severity}/10</p>
              <p className="problem-ps"><strong>Looking for:</strong> {deck[currentCardIndex].lookingFor}</p>
              <p className="problem-ps"><strong>Happen Before?</strong> {deck[currentCardIndex].pastExperience}</p>
              <p className="problem-pss"><strong>How long have you felt this way?</strong> {deck[currentCardIndex].duration}</p>
            </div>
          ) : (
            <div className="screen-content no-gardens-text">
              <h3>No more gardens available</h3>
              <p>You've seen all available gardens.</p>
            </div>
          )}
        </div>
        <button 
          className={`swipe-left ${isLeftAnimating ? 'button-animating' : ''}`}
          onClick={() => handleSwipe('left')}
          disabled={isLeftAnimating || noMoreCards}
          style={{
            backgroundImage: `url(${cross_btn})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></button>
        <button 
          className={`swipe-right ${isRightAnimating ? 'button-animating' : ''}`}
          onClick={() => handleSwipe('right')}
          disabled={isRightAnimating || noMoreCards}
          style={{
            backgroundImage: `url(${plus_btn})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></button>
      </div>
    </div>
  );
};

export default SwipePage;