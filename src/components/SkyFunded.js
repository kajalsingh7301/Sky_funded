import React from "react";
import "./SkyFunded.css";
import guarantee from "../Assets/guarantee.jpg";
import shakehand from "../Assets/shake_hand_img.jpg";
import mt_5_video from "../Assets/mt_5_video.mp4";
import people from "../Assets/people_img.jpg";
import time  from "../Assets/time_img.jpg";

const SkyFundedPage = () => {
  return (
    <div className="Skyfunded-parent-div">
      <div className="sky-funded-container">
        <div className="sky-fund-head-div">
          Why Sky Funded ?
          <div className="sky-fund-head-down-para1">
            Trade with the most trusted, reliable, and highest-paying prop firm
          </div>
          <div className="sky-fund-head-down-para2">
            Accurate | Quick | Consistent | Dependable
          </div>
        </div>
      </div>

      <div className="guaranteed-side-div">
        <div className="guaranteed-side-div1">
          <div className="guaranteed-side-div1-img">
            <img src={guarantee} alt="guarantee" className="guarantee-img" />
            <div className="guaranteed-para-div">
              <p className="guarantee-p1">Guaranteed Payouts</p>
              <p className="guarantee-p2">Get paid in 24 hours</p>
              <p className="guarantee-p3">
                Receive your payment within 24 hours otherwise we will pay extra $1000
              </p>
            </div>
          </div>
        </div>

        <div className="guaranteed-side-div2">
          <div className="guaranteed-side-div1-img">
            <img src={shakehand} alt="shake" className="shake-hand-img" />
            <div className="shake-para-div">
              <p className="shake-p1">Adaptable Trading Conditions</p>
              <div className="name-div">
                <p className="shake-p2">
                  Low spreads | Low Commission | Balanced Based Drawdown
                </p>
                <p className="shake-p3">
                  Reset and Top up | No Time limit | Allowed News Trading
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sky-fund-right-div">
          <div className="Skyfund-right-side-inside-div1">
            <p className="Trade-p">TRADE ON MT5</p>
            <p className="Trade-p1">Your Choice!</p>
            <p className="Trade-p2">Best Trading Platform</p>
            <a href="https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="link-download">
  <button className="download-button-div">Download MT5</button>
</a>
          </div>
          <div className="Skyfund-right-side-inside-div2">
            <video autoPlay loop muted className="mt_5_video">
              <source src={mt_5_video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="down-div">
          Trade with confidence on MetaTrader 5 – a platform designed to enhance your trading experience with advanced features, top-notch security, and unparalleled efficiency.
        </div>
      </div>
      
      <div className="down-full-div">
        <div className="down-full-side-div1">
          <p className="down-side-div-p1">Empowering Traders in 195+ Countries</p>
          <div className="sky-funded-stats">
            <div className="stat-item">
              <p className="stat-value">$100+</p>
              <p className="stat-label">Total Payouts</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <p className="stat-value">30K +</p>
              <p className="stat-label">Traders</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <p className="stat-value">5 hrs</p>
              <p className="stat-label">Avg. Reward Timing</p>
            </div>
          </div>
        </div>
        <div className="down-full-side-div2">
          <div className="bullion-funded-div">
          <img src={people} alt="people" className="sky-img"/>
          <p className="sky-funded-p1">Sky Funded Community and Support</p>
          <p className="sky-funded-p2">Empowering traders worldwide to conquer challenges and secure funding.</p>
          </div>
        </div>
        <div className="down-full-side-div3">
        <div className="24-7-support-div">
          <img src={time} alt="time" className="time-img"/>
          <p className="time-p1">24/7 Pro Support</p>
          <p className="time-p2">Our customer support team is available 24/7 to assist you, with an average response time of just 60 seconds.</p>

        </div>
        </div>
      </div>
    </div>
  );
};

export default SkyFundedPage;
