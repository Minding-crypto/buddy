import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { app } from "../firebase"; // Adjust your Firebase config import
import '../css/SignUp.css';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  EyeOff, 
  Eye, 
  AlertCircle,
  User,
  Activity 
} from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    mentalHealthStatus: "",
    supportType: [],
    emergencyContact: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const checkUserExists = async (email) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!isValidEmail(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      const userExists = await checkUserExists(formData.email);
      if (userExists) {
        throw new Error("An account with this email already exists");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        username: formData.username,
        mentalHealthStatus: formData.mentalHealthStatus,
        supportType: formData.supportType,
        emergencyContact: formData.emergencyContact,
        createdAt: new Date()
      });
      
      console.log('Redirecting to SwipePage...');
      navigate('/SwipePage');
    } catch (err) {
      let errorMessage = err.message;
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters";
      }
      
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        supportType: checked 
          ? [...prev.supportType, value]
          : prev.supportType.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="signup-container">
      <div className="signup-image-container">
        <div className="signup-overlay">
          <h2 className="brand-tagline">Your Mental Wellness Companion</h2>
        </div>
      </div>
      
      <motion.div 
        className="signup-form-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="signup-header">
          <h1 className="brand-name">AidBud</h1>
          <h2 className="signup-title">Create Your Account</h2>
          <p className="signup-subtitle">Join our supportive community today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <motion.div 
            className="input-wrapper"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Mail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className="form-input"
              onChange={handleChange}
              autoComplete="email"
            />
          </motion.div>
          
          <motion.div 
            className="input-wrapper"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="form-input"
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </motion.div>
          
          <motion.div 
            className="input-wrapper"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <User className="input-icon" />
            <input
              type="text"
              name="username"
              required
              className="form-input"
              onChange={handleChange}
              placeholder="Username"
            />
          </motion.div>
          
          <motion.div 
            className="input-wrapper"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Activity className="input-icon" />
            <select
              name="mentalHealthStatus"
              className="form-input"
              onChange={handleChange}
              required
            >
              <option value="">Mental Health Status</option>
              <option value="Managing well">Managing well</option>
              <option value="Needing support">Needing support</option>
              <option value="In crisis">In crisis</option>
            </select>
          </motion.div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-message"
            >
              <AlertCircle className="error-icon" />
              <span>{error}</span>
            </motion.div>
          )}
          
          <motion.button
            className="submit-btn"
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0, 118, 255, 0.25)" }}
            whileTap={{ scale: 0.98 }}
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>
        
        <motion.div
          className="auth-footer"
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <p className="login-link">
            Already have an account? <Link to="/Login">Sign in</Link>
          </p>
          <p className="disclaimer-text">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="text-link">Terms</Link> and{" "}
            <Link to="/privacy" className="text-link">Privacy Policy</Link>.
            This is not a substitute for professional medical help.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;