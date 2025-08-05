import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Tablesteps.css";

const ChallengePlans = () => {
  const [activeStep, setActiveStep] = useState("step1");
  const [activeMainTab, setActiveMainTab] = useState("SkyFunded Challenge");
  const navigate = useNavigate();

  const mainTabs = ["TreasureFunded Challenge", "TreasureFunded Lite Challenge", "Evaluation", "Express"];

  const step1Data = [
    ["Account Size", "$6,000", "$15,000", "$25,000", "$50,000", "$100,000", "$200,000"],
    ["Get Plan", "Fee: $59", "Fee: $119", "Fee: $199", "Fee: $299", "Fee: $549", "Fee: $999"],
    ["Profit Target", "$144", "$360", "$600", "$1,200", "$2,400", "$4,800"],
    ["Max Daily Loss", "$300", "$750", "$1,250", "$2,500", "$5,000", "$10,000"],
    ["Max Overall Loss", "$600", "$1,500", "$2,500", "$5,000", "$10,000", "$20,000"],
    ["Profit Split", "95%", "95%", "95%", "95%", "95%", "95%"],
    ["Minimum Days", "2 Days", "2 Days", "2 Days", "2 Days", "2 Days", "2 Days"],
    ["First Reward", "5 Days", "5 Days", "5 Days", "5 Days", "5 Days", "5 Days"],
  ];

  const step2Data = [
    ["Account Size", "$6,000", "$15,000", "$25,000", "$50,000", "$100,000", "$200,000"],
    ["Get Plan", "Fee: $39", "Fee: $99", "Fee: $169", "Fee: $259", "Fee: $499", "Fee: $899"],
    ["Profit Target", "$120", "$300", "$500", "$1,000", "$2,000", "$4,000"],
    ["Max Daily Loss", "$250", "$600", "$1,000", "$2,000", "$4,000", "$8,000"],
    ["Max Overall Loss", "$500", "$1,200", "$2,000", "$4,000", "$8,000", "$16,000"],
    ["Profit Split", "90%", "90%", "90%", "90%", "90%", "90%"],
    ["Minimum Days", "2 Days", "2 Days", "2 Days", "2 Days", "2 Days", "2 Days"],
    ["First Reward", "5 Days", "5 Days", "5 Days", "5 Days", "5 Days", "5 Days"],
  ];

  const liteChallengeData = [
    ["Account Size", "$5,000", "$10,000", "$20,000"],
    ["Fee", "$49", "$89", "$169"],
    ["Profit Target", "$250", "$500", "$1,000"],
    ["Max Drawdown", "$150", "$300", "$600"],
    ["Profit Split", "85%", "85%", "85%"],
  ];

  const evaluationData = [
    ["Account Size", "$25,000", "$50,000"],
    ["Fee", "$129", "$249"],
    ["Profit Target", "$1,500", "$3,000"],
    ["Max Loss", "$1,000", "$2,000"],
    ["Profit Split", "88%", "88%"],
  ];

  const expressData = [
    ["Account Size", "$10,000", "$30,000"],
    ["Fee", "$99", "$249"],
    ["Profit Target", "$700", "$2,100"],
    ["Max Drawdown", "$500", "$1,500"],
    ["Profit Split", "92%", "92%"],
  ];

  const renderTable = (data) => (
    <div className="table-grid times-new-roman">
      {data.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isFee = row[0].toLowerCase().includes("fee") || cell.toString().toLowerCase().includes("fee");
          const isProfitSplit = row[0].toLowerCase().includes("profit split");
          const isAmount = /\$\d/.test(cell);

          let classNames = `cell ${rowIndex === 0 ? "header" : ""} ${colIndex === 0 ? "feature-name" : ""}`;
          if (isFee || isProfitSplit) classNames += " underline-important";
          if (isAmount && colIndex !== 0 && rowIndex !== 0) classNames += " highlight-amount";

          return (
            <div key={`${rowIndex}-${colIndex}`} className={classNames}>
              {rowIndex === 1 && colIndex !== 0 ? (
                <button className="plan-btn">{cell}</button>
              ) : (
                cell
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeMainTab) {
      case "SkyFunded Challenge":
        return (
          <>
            <div className="tabs">
              <button onClick={() => setActiveStep("step1")} className={activeStep === "step1" ? "active" : ""}>
                Step 1
              </button>
              <button onClick={() => setActiveStep("step2")} className={activeStep === "step2" ? "active" : ""}>
                Step 2
              </button>
            </div>
            {activeStep === "step1" ? renderTable(step1Data) : renderTable(step2Data)}
          </>
        );
      case "SkyFunded Lite Challenge":
        return renderTable(liteChallengeData);
      case "Evaluation":
        return renderTable(evaluationData);
      case "Express":
        return renderTable(expressData);
      default:
        return null;
    }
  };

  return (
    <div className="challenge-wrapper">
      {/* Header Tabs */}
      <div className="main-tab-header">
        {mainTabs.map((tab, index) => (
          <button
            key={index}
            className={`main-tab ${activeMainTab === tab ? "active-main-tab" : ""}`}
            onClick={() => setActiveMainTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Content */}
      {renderContent()}

      {/* Footer Info */}
      <div className="footer-info">
        <span>• Lifetime Payout 95%</span>
        <span>• 150% Reward</span>
        <span>• Double Up</span>
        <span>• No Minimum Trading Days</span>
      </div>

      {/* Buy Plan Button */}
      <div className="buy-plan-container">
        <div className="buy-plan-btn" onClick={() => navigate("/login")}>
          Buy a Plan
        </div>
      </div>
    </div>
  );
};

export default ChallengePlans;
