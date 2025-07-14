import React, { useEffect, useRef } from "react";
import "./EarningsPage.css";
import globeImg from "../Assets/globe-image.jpg";

const earningsData = [
  { country: "United States", amount: "$98,335", flag: "🇺🇸", code: "us" },
  { country: "Netherlands", amount: "$41,678", flag: "🇳🇱", code: "nl" },
  { country: "Lithuania", amount: "$41,106", flag: "🇱🇹", code: "lt" },
  { country: "Germany", amount: "$140,354", flag: "🇩🇪", code: "de" },
  { country: "Thailand", amount: "$50,197", flag: "🇹🇭", code: "th" },
  { country: "Canada", amount: "$85,672", flag: "🇨🇦", code: "ca" },
  { country: "Australia", amount: "$73,420", flag: "🇦🇺", code: "au" },
  { country: "United Kingdom", amount: "$112,580", flag: "🇬🇧", code: "gb" },
  { country: "Japan", amount: "$67,891", flag: "🇯🇵", code: "jp" },
  { country: "Brazil", amount: "$55,432", flag: "🇧🇷", code: "br" },
  { country: "India", amount: "$48,765", flag: "🇮🇳", code: "in" },
  { country: "France", amount: "$102,348", flag: "🇫🇷", code: "fr" },
  { country: "South Korea", amount: "$89,214", flag: "🇰🇷", code: "kr" },
  { country: "Italy", amount: "$78,902", flag: "🇮🇹", code: "it" },
  { country: "Spain", amount: "$60,123", flag: "🇪🇸", code: "es" },
];

const EarningsPage = () => {
  const sliderRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const cardWidth = sliderRef.current.querySelector(".card-flag")?.offsetWidth || 220;
        sliderRef.current.scrollLeft += cardWidth;

        // Reset scroll when end is reached (smooth looping)
        if (
          sliderRef.current.scrollLeft + sliderRef.current.offsetWidth >=
          sliderRef.current.scrollWidth
        ) {
          sliderRef.current.scrollLeft = 0;
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="earnings-container">
      <div className="earnings-header">
        <div className="globe-container">
          <img src={globeImg} alt="globe" className="globe-img" />
          <div className="overlay-text">
            <h1>$100+ Million</h1>
            <p className="subtext">Earned by Traders Globally at FundingPips</p>
            <p className="description">Quick and reliable. Zero reward denials.</p>
          </div>
        </div>
      </div>

      <div className="earnings-slider" ref={sliderRef}>
        <div className="earnings-cards">
          {earningsData.map((item, index) => (
            <div key={`${item.code}-${index}`} className="card-flag">
              <div className="flag-container">
                <img
                  src={`https://flagcdn.com/w40/${item.code.toLowerCase()}.png`}
                  alt={item.country}
                  className="flag-img"
                />
                <p className="flag-text" aria-hidden="true">
                  {item.flag} {item.country}
                </p>
              </div>
              <h2>{item.amount}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
