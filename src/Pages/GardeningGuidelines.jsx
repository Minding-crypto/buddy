import React from "react";
import "../css/GardeningGuidelines.css";

const GardeningGuidelines = () => {
  return (
    <div className="container">
      <div className="header">
        <div className="logo">
          {/* Logo can be placed here */}
        </div>
        <h1 className="gardening-h1">Community Garden AidBud</h1>
        <p className="tagline">Growing knowledge, harvesting wisdom, together.</p>
      </div>
      
      <div className="content-box">
        <div className="welcome-section">
          <h2 className="gardening-h2">Welcome to AidBud</h2>
          <p className="gardening-p">
            Our community garden thrives when we all contribute positively. These guidelines 
            ensure our garden remains a nurturing space where advice can bloom and 
            everyone feels supported on their gardening journey.
          </p>
        </div>
        
        <div className="section principles">
          <h2 className="gardening-h2">Core Principles</h2>
          <div className="principle-cards">
            <div className="card">
              <div className="icon">🌱</div>
              <h3 className="gardening-h3">Nurture with Care</h3>
              <p className="gardening-p">
                Be supportive and constructive in your advice. Remember that everyone's 
                gardening journey is unique.
              </p>
            </div>
            <div className="card">
              <div className="icon">🌿</div>
              <h3 className="gardening-h3">Plant Responsibly</h3>
              <p className="gardening-p">
                Share genuine, specific, and non-commanding advice based on knowledge 
                and experience.
              </p>
            </div>
            <div className="card">
              <div className="icon">🛡️</div>
              <h3 className="gardening-h3">Cultivate Safety</h3>
              <p className="gardening-p">
                Avoid diagnosing plant diseases without expertise, respect privacy, 
                and report concerning content.
              </p>
            </div>
          </div>
        </div>
        
        <div className="section advice">
          <h2 className="gardening-h2">Seeds of Advice: Do's and Don'ts</h2>
          <div className="do-dont-container">
            <div className="do-box">
              <h3 className="gardening-h3">Do:</h3>
              <ul>
                <li>Share relevant personal experiences with specific plants or techniques</li>
                <li>Offer constructive perspectives backed by gardening knowledge</li>
                <li>Suggest professional help for complex plant health issues</li>
                <li>Provide links to reputable gardening resources</li>
                <li>Be patient with novice gardeners learning the basics</li>
                <li>Acknowledge regional differences in growing conditions</li>
              </ul>
            </div>
            <div className="dont-box">
              <h3 className="gardening-h3">Don't:</h3>
              <ul>
                <li>Give definitive diagnoses of plant diseases without expertise</li>
                <li>Minimize others' gardening challenges or failures</li>
                <li>Make unrealistic promises about growth or harvest outcomes</li>
                <li>Promote unsafe or environmentally harmful gardening practices</li>
                <li>Use commanding or dismissive language</li>
                <li>Recommend products without disclosing any affiliations</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="section mechanics">
          <h2 className="gardening-h2">Garden Growth Mechanics</h2>
          <div className="mechanics-grid">
            <div className="mechanics-item">
              <div className="icon">🌻</div>
              <h3 className="gardening-h3">Planting</h3>
              <p className="gardening-p">
                Provide thoughtful advice based on understanding the specific context, 
                climate, and needs of the gardener.
              </p>
            </div>
            <div className="mechanics-item">
              <div className="icon">💧</div>
              <h3 className="gardening-h3">Watering</h3>
              <p className="gardening-p">
                Support helpful advice by upvoting to increase visibility of quality 
                content that helps our community grow.
              </p>
            </div>
            <div className="mechanics-item">
              <div className="icon">🍂</div>
              <h3 className="gardening-h3">Drying</h3>
              <p className="gardening-p">
                Discourage harmful advice through downvoting, but respect simple 
                differences in gardening approaches.
              </p>
            </div>
          </div>
        </div>
        
        <div className="section privacy">
          <h2 className="gardening-h2">Privacy and Community Recognition</h2>
          <p className="gardening-p">
            Respect the privacy and anonymity of community members. Do not share personal 
            information without consent. Helpful users earn recognition in the community 
            through our "Master Gardener" badges and special flair.
          </p>
          <div className="badges">
            <div className="badge">
              <div className="badge-icon">🌼</div>
              <p className="gardening-p">Helpful Contributor</p>
            </div>
            <div className="badge">
              <div className="badge-icon">🌲</div>
              <p className="gardening-p">Sustainable Gardener</p>
            </div>
            <div className="badge">
              <div className="badge-icon">🏆</div>
              <p className="gardening-p">Master Gardener</p>
            </div>
          </div>
        </div>
        
        <div className="last-updated">
          <p className="gardening-p">Last updated: March 7, 2025</p>
        </div>
      </div>
      
      <div className="footer">
        <p className="gardening-p">© AidBud. All rights reserved.</p>
      </div>
    </div>
  );
};

export default GardeningGuidelines;
