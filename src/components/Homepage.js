import React, { useEffect, useState } from 'react';
import './Homepage.css';
import img1 from '../Assets/image1.jpg';
import img2 from '../Assets/image2.jpg';
import img3 from '../Assets/image3.jpg';
import Firstnextpage from './Firstnextpage';
import ChallengePage from './ChallengePage';
import ProcessSteps from './ProcessSteps';
import SkyFunded from './SkyFunded';
import EarningsPage from './EarningsPage';
import FeedbackSlider from './FeedbackSlider';
import TradersFeedback from './TradersFeedback';
import Tablesteps from './Tablesteps';
import { Link } from "react-router-dom";
import coin from '../Assets/coin.gif';
import bg from '../Assets/bg.mp4';

const Homepage = () => {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {

    fetch('http://localhost:5000')
      .then((res) => res.text())
      .then((data) => setBackendMessage(data))
      .catch((err) => console.error('Error fetching backend:', err));
  }, []);

  return (
    <>
      <div className="sky-funded-hero">
        {/* Background Video */}
        <video autoPlay loop muted playsInline className="sky-funded-bg-video">
          <source src={bg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="sky-funded-left">
          <span className="sky-funded-badge">TREASURE FUNDED</span>
          <div className='where-trust-meet-trading'>
            Where Trust Meets Trading
          </div>
          <h1 className="sky-funded-title">
            <span>Treasure Funded:</span> Trusted Accounts, Highest Payouts, Get Certified
          </h1>
          <p className="sky-funded-desc">
            Know the highest possibilities of your trading. Trade with assurance when working with a financially secure trading prop firm like us.
          </p>

          <div className="sky-funded-features">
            <div className="sky-funded-feature">
              <img src={img1} alt="Instant Funding" />
              Instant Funding
            </div>
            <div className="sky-funded-feature">
              <img src={img2} alt="No Time Limit" />
              No Time Limit
            </div>
            <div className="sky-funded-feature">
              <img src={img3} alt="Low Drawdown" />
              Low Drawdown
            </div>
          </div>

          <div className="sky-funded-buttons">
            <Link to="/register">
              <div className="sky-funded-primary-btn1">Get Funded</div>
            </Link>
            <div className="sky-funded-secondary-btn1">Join Us</div>
          </div>
        </div>

        {/* <div className="sky-funded-right">
          <img src={coin} alt="Trading Animation" className="coin" />
        </div> */}
      </div>

      {/* Additional Components */}
      <Firstnextpage />
      <ChallengePage />
      <ProcessSteps />
      <SkyFunded />
      <EarningsPage />
      <FeedbackSlider />
      <TradersFeedback />
      <Tablesteps />
    </>
  );
};

export default Homepage;

