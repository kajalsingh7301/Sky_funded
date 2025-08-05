import React from "react";
import { useNavigate } from "react-router-dom";
import "./Firstnextpage.css";
import e1 from "../Assets/e1.png";
import e3 from "../Assets/e3.png";
import e2 from "../Assets/e2.png";
// import e1 from "../Assets/e1.png";
import arrow from "../Assets/arrow.png";

const Firstnextpage = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  return (
    <div className="first-fullpage">
      <div className="coin-side-div">
        <img className="arrow" src={arrow} alt="arrow" />
      </div>
      <div className="box-side-div">
        <div className="Key-highlight">Key Highlights</div>
        <div className="gradient-text-div">
          Maximize Your Trading Success with Treasure Funded.
        </div>

        <div className="box-main-div1">
          <div className="under-box-main-div1">
            <img className="e1" src={e1} alt="e1" />
            <p className="head-p1">High Profit Splits</p>
            <p className="head-paragraph">
              At TreasureFunded, we believe in maximizing your earnings. Our
              profit-sharing model is designed to give you the highest returns
              in the industry.
            </p>
          </div>
          <div className="under-box-main-div2">
            <img className="e2" src={e2} alt="e2" />
            <p className="head-p1">News Trading</p>
            <p className="head-paragraph">
              Access real-time news updates, economic calendars, and expert
              analysis to make informed decisions.
            </p>
          </div>
        </div>

        <div className="box-main-div2">
          <div className="under-box-main-div1">
            <img className="e3" src={e3} alt="e3" />
            <p className="head-p1">24/7 Customer Support</p>
            <p className="head-paragraph">
              At TreasureFunded, trading never stops, and neither does our support!
              Our 24/7 expert team is always available to assist with questions,
              technical issues.
            </p>
          </div>
          <div className="under-box-main-div2">
            <img className="e1" src={e1} alt="e1" />
            <p className="head-p1">No Time Limit</p>
            <p className="head-paragraph">
              At TreasureFunded, we believe in flexibility and freedom for traders.
              Unlike other firms that rush you with deadlines, no time limits on
              reaching your profit targets.
            </p>
          </div>
        </div>
      </div>

      <div className="down-side-div">
        <div className="how-it-works">How It Works</div>
        <div className="how-it-works-text">
          You’re four steps away from harnessing your trading skills
        </div>
        <div
          className="start-a-challenge"
          onClick={() => navigate("/login")} // ✅ Click navigates to login
          style={{ cursor: "pointer" }} // 👈 Optional: visual cue
        >
          Start a Challenge
        </div>
      </div>
    </div>
  );
};

export default Firstnextpage;
