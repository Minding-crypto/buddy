import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 
import { app } from "../firebase";
import "../css/CreateGarden.css"; 

const CreateGarden = () => {
  const navigate = useNavigate();
  const db = getFirestore(app);
  const auth = getAuth(app);
  
  const [formData, setFormData] = useState({
    emotions: [],
    problem: "",
    lookingFor: "",
    severity: 5,
    duration: "",
    pastExperience: "",
    anonymous: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emotionsList = [
    "Stressed", 
    "Anxious", 
    "Sad", 
    "Angry", 
    "Lonely", 
    "Overwhelmed", 
    "Frustrated",
    "Confused",
    "Tired",
    "Hopeful",
    "Others"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "emotions") {
      setFormData((prev) => ({
        ...prev,
        emotions: checked 
          ? [...prev.emotions, value] 
          : prev.emotions.filter((emotion) => emotion !== value),
      }));
    } else if (type === "checkbox" && name === "anonymous") {
      setFormData((prev) => ({ ...prev, anonymous: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    // Validation: Check if all required fields are filled
    if (
      formData.emotions.length === 0 ||
      !formData.problem.trim() ||
      !formData.lookingFor.trim() ||
      !formData.duration ||
      !formData.pastExperience
    ) {
      setError("Please fill in all required fields before submitting.");
      setLoading(false);
      return;
    }
  
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("You must be logged in to create a garden.");
      }
  
      const gardenData = {
        userId: user.uid,
        emotions: formData.emotions,
        problem: formData.problem,
        lookingFor: formData.lookingFor,
        severity: formData.severity,
        duration: formData.duration,
        pastExperience: formData.pastExperience,
        anonymous: formData.anonymous,
        createdAt: new Date(),
      };
  
      // Save globally in "gardens" collection
      const docRef = await addDoc(collection(db, "gardens"), gardenData);
  
      // Save under the user's document
      await addDoc(collection(db, `users/${user.uid}/gardens`), {
        ...gardenData,
        gardenId: docRef.id,
      });
  
      navigate("/ProfilePage");
    } catch (err) {
      setError(err.message || "An error occurred while submitting.");
      console.error(err);
    }
  
    setLoading(false);
  };
  
  const handleCancel = () => {
    navigate("/ProfilePage");
  };


  return (
    <div className="questionnaire-container">
      <div className="title-section">
        <h1 className="title">Create Garden</h1>
        <p className="subtitle">Share your experience and get support</p>
      </div>
      
      <form onSubmit={handleSubmit} className="questionnaire-form">
        <div className="question">
          <div className="question-title">
            <i className="emotion-icon">😊</i>How are you feeling?
          </div>
          <div className="emotions-container">
            {emotionsList.map((emotion) => (
              <React.Fragment key={emotion}>
                <input
                  type="checkbox"
                  id={`emotion-${emotion}`}
                  name="emotions"
                  value={emotion}
                  checked={formData.emotions.includes(emotion)}
                  onChange={handleChange}
                  className="emotion-checkbox"
                />
                <label htmlFor={`emotion-${emotion}`} className="emotion-label">
                  {emotion}
                </label>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="question">
          <div className="question-title">
            <i className="problem-icon">📝</i>What challenge are you facing?
          </div>
          <textarea
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            placeholder="Describe your situation in as much detail as you feel comfortable sharing..."
            className="input-textarea"
          />
        </div>

        <div className="question">
          <div className="question-title">
            <i className="support-icon">🤝</i>What kind of support would help you?
          </div>
          <input
            type="text"
            name="lookingFor"
            value={formData.lookingFor}
            onChange={handleChange}
            placeholder="Advice, perspectives, similar experiences, resources..."
            className="input-text"
          />
        </div>

        <div className="question">
          <div className="question-title">
            <i className="severity-icon">📊</i>How much is this affecting your daily life?
          </div>
          <div className="slider-container">
            <input
              type="range"
              name="severity"
              min="1"
              max="10"
              value={formData.severity}
              onChange={handleChange}
              className="slider"
            />
            <div className="severity-value">{formData.severity}/10</div>
            <div className="severity-labels">
              <span>Minimal impact</span>
              <span>Significant impact</span>
            </div>
          </div>
        </div>

        <div className="question">
          <div className="question-title">
            <i className="duration-icon">⏱️</i>How long have you been experiencing this?
          </div>
          <select 
            name="duration" 
            value={formData.duration} 
            onChange={handleChange} 
            className="dropdown"
          >
            <option value="">Select a timeframe</option>
            <option value="A few hours">A few hours</option>
            <option value="A few days">A few days</option>
            <option value="A few weeks">A few weeks</option>
            <option value="More than a month">More than a month</option>
            <option value="Several months">Several months</option>
            <option value="Over a year">Over a year</option>
          </select>
        </div>

        <div className="question">
          <div className="question-title">
            <i className="experience-icon">🔄</i>Have you faced this before?
          </div>
          <select 
            name="pastExperience" 
            value={formData.pastExperience} 
            onChange={handleChange} 
            className="dropdown"
          >
            <option value="">Select an answer</option>
            <option value="Yes, many times">Yes, many times</option>
            <option value="Yes, once or twice">Yes, once or twice</option>
            <option value="No, this is new">No, this is new</option>
            <option value="Not sure">Not sure</option>
          </select>

         
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating your garden..." : "Plant Your Garden"}
          </button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

};

export default CreateGarden;