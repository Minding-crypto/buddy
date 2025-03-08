import React, { useEffect, useState } from "react";
import '../css/ProfilePage.css';
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs, deleteDoc,  } from "firebase/firestore";
import { app } from "../firebase";
import ProfileFooter from "./ProfileFooter"; // Import the new component

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false); 
  const [stats, setStats] = useState({
    totalGardens: 0,
    totalSeeds: 0,
    joined: null
  });

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const auth = getAuth(app);
    
    // Add auth state listener
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setAuthChecked(true); // Mark that we've checked auth status
      
      if (user) {
        try {
          // User is signed in, proceed with data fetching
          const db = getFirestore(app);
          
          // Fetch user data
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
            setStats(prev => ({
              ...prev,
              joined: userData.createdAt?.toDate().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })
            }));
          }

          // Fetch user's gardens
          const gardenCollectionRef = collection(db, `users/${user.uid}/gardens`);
          const gardenSnapshot = await getDocs(gardenCollectionRef);
          const userGardens = gardenSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Process gardens and seeds
          let totalSeeds = 0;
          const processedGardens = [];

          for (const garden of userGardens) {
            const gardenDoc = await getDoc(doc(db, "gardens", garden.gardenId));
            if (gardenDoc.exists()) {
              const gardenData = gardenDoc.data();
              const flowers = gardenData.flowers || [];
              const seedsCount = flowers.length;
              
              totalSeeds += seedsCount;
              
              processedGardens.push({
                ...garden,
                problem: gardenData.problem,
                seeds: seedsCount
              });
            }
          }

          setGardens(processedGardens);
          setStats(prev => ({
            ...prev,
            totalGardens: processedGardens.length,
            totalSeeds: totalSeeds
          }));

          setLoading(false);
        } catch (err) {
          setError("Failed to load user data");
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

  const createGardenPage = () => {
    navigate('/CreateGarden');
  };

  const handleDeleteGarden = async (subcollectionId, gardenId) => {
    if (!window.confirm("Are you sure you want to delete this garden?")) return;

    try {
      // Show temporary loading state
      setGardens(prev => 
        prev.map(garden => 
          garden.id === subcollectionId ? { ...garden, isDeleting: true } : garden
        )
      );
      
      // Delete from main gardens collection
      await deleteDoc(doc(db, "gardens", gardenId));
      // Delete from user's subcollection
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/gardens`, subcollectionId));
      
      // Update gardens state
      setGardens(prev => prev.filter(garden => garden.id !== subcollectionId));
      
      // Update stats
      setStats(prev => ({...prev, totalGardens: prev.totalGardens - 1}));
    } catch (err) {
      setError("Failed to delete garden");
      console.error(err);
      
      // Remove loading state if error
      setGardens(prev => 
        prev.map(garden => 
          garden.id === subcollectionId ? { ...garden, isDeleting: false } : garden
        )
      );
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="loading-container">
        <div className="loading-sprite"></div>
      </div>
    );
  }
  
  if (error) return <div className="pmain">{error}</div>;

  return (
    <div className="pmain">
      <div className="introduction">
        <div className="anotherintro">
          <div className="firstp">{userData?.username || "Username not available"}</div>
          
          <div className="user-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.totalGardens}</div>
              <div className="stat-label">Gardens</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value">{stats.totalSeeds}</div>
              <div className="stat-label">Total Seeds</div>
            </div>
            
            {stats.joined && (
              <div className="stat-card">
                <div className="stat-value">{stats.joined}</div>
                <div className="stat-label">Joined</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="reed">
        <div className="gardentitle">Your Gardens</div>
        <div className="problemset">
          {gardens.length > 0 ? (
            gardens.map(garden => (
              <div 
                className="problem" 
                key={garden.id}
                style={garden.isDeleting ? { opacity: 0.6 } : {}}
              >
                <div className="actualproblem">
                  <strong>Problem:</strong> {garden.problem}
                </div>
                <div className="bottom-prob">
                <div className="seeds-count">
                    <strong>Seeds:</strong> {garden.seeds}
                  </div>
                  <div className="btns-sep"> 
                  <button 
                    className="delete" 
                    onClick={() => handleDeleteGarden(garden.id, garden.gardenId)}
                    disabled={garden.isDeleting}
                  >
                    {garden.isDeleting ? "Deleting..." : "Delete"}
                  </button>
                  <button 
                    className="view-garden"
                    onClick={() => navigate(`/garden/${garden.gardenId}`)}
                    disabled={garden.isDeleting}
                  >
                    View Garden
                  </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>You haven't created any gardens yet.</p>
              <p>Click the + button to create your first garden!</p>
            </div>
          )}
        </div>
      </div>
<hr style={{ border: "1px solid #bea2f3ab", width: "90%", marginTop:'200px' }}/>
      {/* Add the new footer component */}
      <ProfileFooter />

      <button className="create_garden" onClick={createGardenPage} aria-label="Create new garden">
        +
      </button>
    </div>
  );
};

export default ProfilePage;