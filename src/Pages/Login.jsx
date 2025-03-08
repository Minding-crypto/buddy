import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  EyeOff, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import '../css/Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth(app);

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

      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      navigate('/SwipePage');
    } catch (err) {
      let errorMessage = "Login failed. Please check your credentials";
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email format";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many attempts. Account temporarily locked";
          break;
        default:
          // No change to errorMessage in default case
          break;
      }
      
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div 
      className="auth-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="auth-form"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
      >
        <div className="logo-containerS">
          <h1 className="lte">AidBud</h1>
          <p style={{paddingTop: '5px', paddingBottom: '5px'}}>Your Mental Wellness Companion</p>
        </div>

        <h2 className="ltr">Welcome Back</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <Mail className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="form-input"
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="input-wrapper">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              required
              className="form-input"
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={16} /> {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="submit-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Logging In...' : 'Sign In'}
          </motion.button>
<div className="ort">or</div>
          <div className="auth-links">
            <Link to="/signup">Create Account</Link>
          </div>
        </form>

       

        <p className="privacy-text">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;