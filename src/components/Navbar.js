import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import tf1 from "../Assets/tf1.png"; 

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 50);
    setShowNavbar(currentScrollY < lastScrollY);
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`sky-funded-navbar ${isScrolled ? "scrolled" : ""} ${
        showNavbar ? "slide-down" : "slide-up"
      }`}
    >
      <div className="sky-funded-logop">
        <Link to="/">
          <img src={tf1} alt="SkyFunded Logo" className="sky-funded-logo-img" />
        </Link>
      </div>

      <div className="sky-funded-nav-links">
        <Link to="/">Home</Link>
        <Link to="/how-it-works">How It Works</Link>

        <div
          className="dropdown"
          onMouseEnter={() => setIsModelOpen(true)}
          onMouseLeave={() => setIsModelOpen(false)}
        >
          <span className="dropdown-title">Model</span>
          {isModelOpen && (
            <div className="dropdown-content">
              <Link to="/skyfunded-challenge">Funded</Link>
              <Link to="/express">Express</Link>
              <Link to="/evaluation">Evaluation</Link>
            </div>
          )}
        </div>

        <Link to="/faq">Faq</Link>
        <Link to="/contact">Contact Us</Link>
      </div>

      <div className="button-div">
        <div
          className="dropdown"
          onMouseEnter={() => setIsPlatformOpen(true)}
          onMouseLeave={() => setIsPlatformOpen(false)}
        >
          <div className="platform-buttonn">Platform</div>
          {isPlatformOpen && (
            <div className="dropdown-content">
              <Link to="/login">Login</Link>
            </div>
          )}
        </div>

        <Link to="/login">
          <div className="login-buttons">Login</div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
