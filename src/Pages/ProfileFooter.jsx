import React from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";

const ProfileFooter = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="profile-footer">
      <div className="profile-actions">
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
        <div className="footer-divider"></div>
      </div>
      
      <div className="legal-links">
        <a href="/privacy" className="legal-link">Privacy Policy</a>
        <a href="/terms" className="legal-link">Terms & Conditions</a>
      </div>
      
      <div className="copyright">
        © {new Date().getFullYear()} AidBud. All rights reserved.
      </div>
    </div>
  );
};

export default ProfileFooter;