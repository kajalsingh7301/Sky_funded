import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section with "Join our community" and Social Icons */}
      <div className="footer-top">
        <h3 className="footer-title">Join our community</h3>
        <div className="footer-social">
          <a href="#" className="social-icon"><i className="fab fa-telegram-plane"></i></a>
          <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
          <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
          <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
          <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
          <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
        </div>
      </div>

      {/* Footer Links */}
      <div className="footer-container">
        <div className="footer-section">
          <h3>Markets</h3>
          <ul>
            <li>Metals</li>
            <li>Stocks</li>
            <li>Currency Pairs (FX)</li>
            <li>Indices</li>
            <li>Commodities</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Knowledge Hub</h3>
          <ul>
            <li>Full Library</li>
            <li>Trading Videos</li>
            <li>Ebooks</li>
            <li>Trading Tools</li>
            <li>Pip Calculator</li>
            <li>Glossary</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Regulation & Licensing</h3>
          <ul>
            <li>Licensed Broker</li>
            <li>Privacy Statement</li>
            <li>Cookie Policy</li>
            <li>Risk Disclosure</li>
            <li>Terms and Conditions</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>About</h3>
          <ul>
          <li>📞 Contact Us: +44 20 3734 1025</li>
          <li>📍 Exinity Limited</li>
          <li>🗺️ 5th Floor, 355 NEX Tower</li>
          <li>📌 Rue du Savoir, Cybercity</li>
          <li>📌 351 Oxford St, London, U </li>

          </ul>
        </div>
       
      </div>
      <div className="footer-container">
        <div className="footer-section">
          <h3>Trading</h3>
          <ul>
            <li>Accounts Overview & Comparison</li>
            <li>Advantage Account</li>
            <li>Demo Trading</li>
            </ul>
        </div>

        <div className="footer-section">
          <h3>Platform</h3>
          <ul>
            
            <li>MT4</li>
            <li>MT5</li>
            <li> Mobile Trading</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Pricing</h3>
          <ul>
            <li>Performance Statistics</li>
            <li>Commissions and Fees</li>
            <li>Deposits and Withdrawals</li>
            
          </ul>
        </div>

        <div className="footer-section">
          <h3>Careers</h3>
          <ul>
          <li>“Join our innovative team and grow your career in prop trading.”</li>
         
          

          </ul>
        </div>
        <div className="footer-section">
          
        </div>
      </div>

      <div className="footer-note">© 2025 Your Company. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
