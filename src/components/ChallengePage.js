import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChallengePage.css";

// Import Images
import cimg1 from "../Assets/challenge_img.jpg";
import cimg2 from "../Assets/sky-fund-c2.jpg";
import cimg3 from "../Assets/challenge_3.jpg";

const ChallengePage = () => {
  const navigate = useNavigate();

  return (
    <div className="challenge-container">
      <h1 className="title">
        Start a <span className="highlight">Challenge</span>
      </h1>
      <p className="subtitle">
        Choose your account and funds to begin your trading journey with Bullion funded.
      </p>
      <div className="challenge-grid">
        {/* Challenge 1 - Popular Plan */}
        <div className="challenge-card">
          <div className="popular-tag">Popular Plan</div>
          <div className="card-content">
            <img src={cimg1} alt="Billionaire Challenge" className="challenge-image" />
            <h3 className="card-title">Sky Funded Challenge</h3>
            <p className="card-description">The most popular package amongst BullionFunded traders</p>
            <ul className="feature-list">
              <li className="feature">Upto 95% Profit Split</li>
              <li className="feature">20% Profit Share in Challenge Phase</li>
              <li className="feature">Up to 150% Reward</li>
              <li className="feature">No Time Limit</li>
              <li className="feature">News Trading Allowed</li>
            </ul>
            <button className="start-btn" onClick={() => navigate("/login")}>
              Start Challenge
            </button>
          </div>
        </div>

        {/* Challenge 2 */}
        <div className="challenge-card">
          <div className="card-content">
            <img src={cimg2} alt="Billionaire Lite Challenge" className="challenge-image" />
            <h3 className="card-title">Sky Funded Lite Challenge</h3>
            <p className="card-description">The most affordable package for new and upcoming traders</p>
            <ul className="feature-list">
              <li className="feature">Upto 95% Profit Split</li>
              <li className="feature">Most Affordable</li>
              <li className="feature">Up to 10% Maximum Loss Limit</li>
              <li className="feature">Lowest Profit Target</li>
              <li className="feature">News Trading Allowed</li>
            </ul>
            <button className="start-btn" onClick={() => navigate("/login")}>
              Start Challenge
            </button>
          </div>
        </div>

        {/* Challenge 3 */}
        <div className="challenge-card">
          <div className="card-content">
            <img src={cimg3} alt="Evaluation" className="challenge-image" />
            <h3 className="card-title">Evaluation</h3>
            <p className="card-description">The only package that offers free retakes</p>
            <ul className="feature-list">
              <li className="feature">Upto 95% Profit Split</li>
              <li className="feature">20% Profit Share in Challenge Phase</li>
              <li className="feature">Up to 10% Maximum Loss Limit</li>
              <li className="feature">Up to 150% Reward</li>
              <li className="feature">News Trading Allowed</li>
            </ul>
            <button className="start-btn" onClick={() => navigate("/login")}>
              Start Challenge
            </button>
          </div>
        </div>

        {/* Challenge 4 */}
        <div className="challenge-card">
          <div className="card-content">
            <img src={cimg2} alt="Express" className="challenge-image" />
            <h3 className="card-title">Express</h3>
            <p className="card-description">The package offers profit shares without needing 5% growth</p>
            <ul className="feature-list">
              <li className="feature">Upto 95% Profit Split</li>
              <li className="feature">20% Profit Share in Challenge Phase</li>
              <li className="feature">Up to 10% Maximum Loss Limit</li>
              <li className="feature">Up to 150% Reward</li>
              <li className="feature">News Trading Not Allowed</li>
            </ul>
            <button className="start-btn" onClick={() => navigate("/login")}>
              Start Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
