import React from "react";
import "./Certificates.css";

const CertificatePrompt = () => {
  return (
    <div className="certificate-page">
      <div className="certificate-modal">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Certificate"
          className="certificate-image"
        />
        <h2 className="certificate-title">One Step Away from Your First Certificate</h2>
        <p className="certificate-desc">
          Buy a SkyFunded challenge account to begin your trading journey. Unlock achievements
          and receive certificates as you reach key trading milestones.
        </p>
        <button className="certificate-btn">Start the Challenge, Earn Certificates</button>
      </div>
    </div>
  );
};

export default CertificatePrompt;
