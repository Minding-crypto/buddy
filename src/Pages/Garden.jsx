import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../css/Garden.css';
import flowering from '../Images/Flower 7 - PINK.png';
import soil from '../Images/soil.png';
import grass from '../Images/grass.png';
import grown from '../Images/grown-flower.png';
import pot from '../Images/potter.png';
import give_advice from '../Images/give_advice.png';
import submit from '../Images/submit.png';
import close from '../Images/close.png';
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

const DuckAnimation = () => {
  return (
    <div className="duck-container">
      <div className="duck"></div>
    </div>
  );
};

const Garden = () => {
  const navigate = useNavigate();
  const { gardenId } = useParams();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [errorMessage, setErrorMessage] = useState("");
  const [flowers, setFlowers] = useState([]);
  const [problemStatement, setProblemStatement] = useState("");
  const [emotion, setemotion] = useState("");
  const [severity, setseverity] = useState("");
  const [typesupport, settypesupport] = useState("");
  const [haveyou, sethaveyou] = useState("");
  const [howlong, sethowlong] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedFlowerIndex, setSelectedFlowerIndex] = useState(null);
  const [showStatement, setShowStatement] = useState(false);
  const gardenContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  // State to track mobile screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 868);
  useEffect(() => {
    const auth = getAuth(app);
    
    // Add auth state listener
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          
          
          setAuthChecked(true);
        } catch (err) {
          setError("Failed to load user data");
          console.error(err);
          setLoading(false);
        }
      } else {
        // No user signed in
        navigate('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [screenDimensions, setScreenDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });


  
  // Helper function to get dimensions based on waterCount and screen size
  const getDimensions = (waterCount) => {
    if (isMobile) {
      return {
        width: waterCount >= 50 ? '50px' :
               waterCount >= 30 ? '40px' :
               waterCount >= 10 ? '30px' : '38px',
        height: waterCount >= 50 ? '70px' :
                waterCount >= 30 ? '50px' :
                waterCount >= 10 ? '48px' : '17px'
      };
    } else {
      return {
        width: waterCount >= 50 ? '80px' :
               waterCount >= 30 ? '50px' :
               waterCount >= 10 ? '30px' : '59px',
        height: waterCount >= 50 ? '110px' :
                waterCount >= 30 ? '60px' :
                waterCount >= 10 ? '50px' : '20px'
      };
    }
  };

  useEffect(() => {
    const fetchGarden = async () => {
      try {
        const gardenDoc = await getDoc(doc(db, "gardens", gardenId));
        if (gardenDoc.exists()) {
          const data = gardenDoc.data();
        
          setProblemStatement(data.problem || "");
          setemotion(data.emotions || "");
          settypesupport(data.lookingFor || "");
          sethaveyou(data.pastExperience || "");
          setseverity(data.severity || "");
          sethowlong(data.duration || "");
          setFlowers(data.flowers || []);
        } else {
          setError("Garden not found");
        }
      } catch (err) {
        setError("Failed to load garden");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGarden();
  }, [gardenId, db]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOnFlower = event.target.closest('.flower');
      const clickedOnBubble = event.target.closest('.realadvice');
      
      if (!clickedOnFlower && !clickedOnBubble) {
        setSelectedFlowerIndex(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [auth, db]);

  const canPlantFlower = (x, y) => {
    if (!gardenContainerRef.current) return false;
  
    // Define minimum distance based on mobile or desktop
    const minDistance = isMobile ? 20 : 13; // Percentage of container width
    
    return flowers.every((flower) => {
      const dx = x - flower.x;
      const dy = y - flower.y;
      
      // Calculate distance as a percentage
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Ensure minimum spacing
      return distance >= minDistance;
    });
  };
  
  const addFlowerFunction = async () => {
    if (!inputValue.trim()) {
      setErrorMessage("Advice cannot be empty!");
      return;
    }
  
    setShowInput(false);
    setErrorMessage(""); // Clear error if valid
  
    if (!gardenContainerRef.current) return;
  
    const padding = 15; // Percentage padding
    const bottomPadding = 20; // Percentage padding
    const maxAttempts = 50; // Limit attempts to prevent infinite loop
  
    let valid = false;
    let newFlower = null;
    let attempts = 0;
  
    while (!valid && attempts < maxAttempts) {
      const x = Math.random() * (100 - padding * 2) + padding;
      const y = Math.random() * (100 - padding - bottomPadding) + padding;
  
      if (canPlantFlower(x, y)) {
        valid = true;
        newFlower = {
          x,
          y,
          advice: inputValue,
          waterCount: 0,
          author: userData?.username || "Anonymous",
          createdAt: new Date(),
          // Add an array to track users who interacted with this flower
          interactedUsers: []
        };
      }
      attempts++;
    }
  
    if (!newFlower) {
      alert("The garden is full. No more space to plant flowers!");
      setIsButtonDisabled(true);
      return;
    }
  
    try {
      await updateDoc(doc(db, 'gardens', gardenId), {
        flowers: [...flowers, newFlower]
      });
      setFlowers(prev => [...prev, newFlower]);
      setInputValue('');
    } catch (error) {
      console.error("Error adding flower:", error);
    }
  };

  const updateFlower = async (index, action) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setErrorMessage("You must be logged in to water or dry flowers.");
      return;
    }
    
    const userId = currentUser.uid;
    const updatedFlowers = [...flowers];
    const flower = updatedFlowers[index];
    
    if (!flower) return;

    // Check if user has already interacted with this flower
    if (!flower.interactedUsers) {
      flower.interactedUsers = []; // Initialize if it doesn't exist
    }
    
    const userInteraction = flower.interactedUsers.find(interaction => interaction.userId === userId);
    
    if (userInteraction) {
      setErrorMessage("You have already interacted with this flower.");
      return;
    }
    
    // Record the user's interaction
    flower.interactedUsers.push({
      userId,
      action, // 'water' or 'dry'
      timestamp: new Date()
    });
    
    // Update the water count
    const delta = action === 'water' ? 1 : -1;
    flower.waterCount += delta;
    
    // Remove flowers with too little water
    if (flower.waterCount <= -10) {
      updatedFlowers.splice(index, 1);
    }

    try {
      await updateDoc(doc(db, 'gardens', gardenId), {
        flowers: updatedFlowers
      });
      setFlowers(updatedFlowers);
      setErrorMessage(""); // Clear any previous error
    } catch (error) {
      console.error("Error updating flower:", error);
      setErrorMessage("Failed to update flower. Please try again.");
    }
  };

  const toggleAdvice = (index) => {
    setSelectedFlowerIndex(selectedFlowerIndex === index ? null : index);
    setErrorMessage(""); // Clear any error message when toggling advice
  };
  
  if (!authChecked || loading) {
    return (
      <div className="loading-container">
        <div className="loading-sprite"></div>
      </div>
    );
  }
  
  if (error) return <div>{error}</div>;

  // Check if current user has already interacted with the selected flower
  const hasInteractedWithSelectedFlower = () => {
    if (selectedFlowerIndex === null || !auth.currentUser) return false;
    
    const flower = flowers[selectedFlowerIndex];
    if (!flower || !flower.interactedUsers) return false;
    
    return flower.interactedUsers.some(interaction => 
      interaction.userId === auth.currentUser.uid
    );
  };
  
  // Get the type of interaction the user has had with the selected flower
  const getUserInteractionType = () => {
    if (selectedFlowerIndex === null || !auth.currentUser) return null;
    
    const flower = flowers[selectedFlowerIndex];
    if (!flower || !flower.interactedUsers) return null;
    
    const interaction = flower.interactedUsers.find(i => i.userId === auth.currentUser.uid);
    return interaction ? interaction.action : null;
  };

  const userInteraction = hasInteractedWithSelectedFlower();
  const interactionType = getUserInteractionType();

  return (
    <div className="main-garden">
      <div className="div1-garden" ref={gardenContainerRef}>
        <img src={grass} alt="Grass Patch" className="div1-image" />
        {flowers.map((flower, index) => {
          const dims = getDimensions(flower.waterCount);
          return (
            <img
              key={index}
              src={
                flower.waterCount >= 50 ? pot : 
                flower.waterCount >= 30 ? grown : 
                flower.waterCount >= 10 ? flowering : soil
              }
              alt="flower"
              className="flower"
              onClick={() => toggleAdvice(index)}
              style={{
                left: `${flower.x}%`,
                top: `${flower.y}%`,
                width: dims.width,
                height: dims.height,
                filter: flower.waterCount >= 10 ? 
                  'drop-shadow(-10px 42px 15px rgba(0, 0, 0, 0.29))' : 
                  'drop-shadow(-5px 15px 8px rgba(0, 0, 0, 0.37))'
              }}
            />
          );
        })}
      </div>

      {selectedFlowerIndex !== null && (
        <>
          <div className="advice-overlay" onClick={() => setSelectedFlowerIndex(null)} />
          <div className="realadvice">
            <div className="top-part">
              <div className="author">Written by: {flowers[selectedFlowerIndex]?.author}</div>
              <div className="water-count">💧 {flowers[selectedFlowerIndex]?.waterCount}</div>
            </div>
            <div className="advice-content">
              {flowers[selectedFlowerIndex]?.advice}
            </div>
            <div className="bottom-advice">
              {userInteraction ? (
                <div className="interaction-status">
                  You have already {interactionType === 'water' ? 'watered' : 'dried'} this plant.
                </div>
              ) : (
                <>
                  <button className="waterbutton" onClick={() => updateFlower(selectedFlowerIndex, 'water')}>
                    💧 Water (+1)
                  </button>
                  <button className="waterbutton" onClick={() => updateFlower(selectedFlowerIndex, 'dry')}>
                    ☀️ Dry (-1)
                  </button>
                </>
              )}
              <button className="close-button" onClick={() => setSelectedFlowerIndex(null)}>
                ✕ Close
              </button>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>
        </>
      )}

      <div className="divforduck">
        <div className="duck-container" onClick={() => setShowStatement(true)} >
          <DuckAnimation />
          <div className="speech-bubble">Quak Quak! Click me to view problem</div>
        </div>
      </div>

      {showStatement && (
        <div className="overlay" onClick={() => setShowStatement(false)}>
          <div className="problem_statement_main">
            <div className="problem_statement">
              <div className="main-div-p">
                <div className="main-div-g">
                  <div className="ptitle">😊 Emotions User is feeling:</div>
                  <div className="ptext">{emotion}</div>
                </div>
                <div className="main-div-g">
                  <div className="ptitle">⚠️ Severity of problem:</div>
                  <div className="ptext">{severity}/10</div>
                </div>
                <div className="main-div-g">
                  <div className="ptitle">🤝 Type of support user is looking for:</div>
                  <div className="ptext">{typesupport}</div>
                </div>
                <div className="main-div-g">
                  <div className="ptitle">🔄 Has the user felt this way before?</div>
                  <div className="ptext">{haveyou}</div>
                </div>
                <div className="main-div-g">
                  <div className="ptitle">⏳ How long has the user felt this way?</div>
                  <div className="ptext">{howlong}</div>
                </div>
                <div className="main-div-g">
                  <div className="ptitle">❓ What is the problem the user is facing?</div>
                  <div className="ptext">{problemStatement}</div>
                </div>
              </div>
            </div>
            <button className="problem_statement_close" onClick={() => setShowStatement(false)}>
              <img src={close} alt="close" className="close-img" />
            </button>
          </div>
        </div>
      )}

      {showInput && (
        <div className="overlay" onClick={() => setShowInput(false)}>
          <div className="input-container" onClick={(e) => e.stopPropagation()}>
            <textarea
              className="input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your advice..."
            />
            <div className="advicebuttons">
              <button className="submit" onClick={addFlowerFunction} disabled={isButtonDisabled}>
                <img src={submit} alt="submit" className="submit-img" />
              </button>
              <button className="close" onClick={() => {setInputValue(''); setShowInput(false); setErrorMessage('')}}>
                <img src={close} alt="close" className="close-img" />
              </button>

              {errorMessage && <div className="error-message">{errorMessage}</div>}

            </div>
          </div>
        </div>
      )}

      <button
        className={`plantaseed-button ${(showInput || showStatement) ? "hidden" : ""}`}
        onClick={() => setShowInput(true)}
        disabled={isButtonDisabled}
      >
        <img src={give_advice} alt="Plant a seed" className="plantaseed-img" />
      </button>
    </div>
  );
};

export default Garden;