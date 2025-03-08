import React from "react";
import "../css/TermsAndConditions.css";

const TermsAndConditions = () => {
  return (
    <div className="container">
      <div className="content-box">
        <h1>Terms and Conditions</h1>
        <p>
          Welcome to AidBud (the "Service"), a peer support platform for mental health. By accessing or using our platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the Service.
        </p>
        
        <h2>Eligibility</h2>
        <p>To use AidBud, you must be at least 16 years old. If under 18, parental consent is required.</p>
        
        <h2>User Accounts</h2>
        <p>Ensure your account information is accurate. You are responsible for safeguarding your password.</p>
        
        <h2>User Content</h2>
        <p>Users retain ownership of their content but grant AidBud a license to use it within the platform.</p>
        
        <h2>Prohibited Uses</h2>
        <ul>
          <li>No self-harm, suicide, or illegal activity promotion</li>
          <li>No harassment, bullying, or impersonation</li>
          <li>No sharing personal data of others without consent</li>
          <li>No malware distribution</li>
        </ul>
        
        <h2>Mental Health Support Limitations</h2>
        <p>AidBud does not provide professional therapy or medical advice. In emergencies, contact crisis services.</p>
        
        <h2>Intellectual Property</h2>
        <p>All platform content and branding are the property of AidBud.</p>
        
        <h2>Termination</h2>
        <p>Accounts may be terminated for violations. Users can request account deletion.</p>
        
        <h2>Privacy</h2>
        <p>Refer to our Privacy Policy for details on data collection and usage.</p>
        
        <h2>Changes to Terms</h2>
        <p>We may update these Terms, with notice provided for significant changes.</p>
        
        <h2>Limitation of Liability</h2>
        <p>AidBud is not responsible for indirect or consequential damages arising from service use.</p>
        
        <h2>Governing Law</h2>
        <p>These Terms are governed by the laws of [Your Country/State].</p>
        
        <h2>Contact Us</h2>
        <p>For inquiries, contact us at [contact email address].</p>
        
        <p className="last-updated">Last updated: 2025</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;