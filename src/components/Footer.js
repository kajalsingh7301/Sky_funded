import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section */}
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
            {/* <li>Metals</li> */}
            <li>Stocks</li>
            <li>Currency Pairs (FX)</li>
            <li>Indices</li>
            <li>Commodities</li>
            <li>Cryptocurrencies</li>
            {/* <li>ETFs</li> */}
          </ul>
        </div>

        <div className="footer-section">
          <h3>Knowledge Hub</h3>
          <ul>
            {/* <li>Full Library</li> */}
            <li>Trading Videos</li>
            <li>Ebooks</li>
            <li>Webinars</li>
            <li>Trading Tools</li>
            <li>Pip Calculator</li>
            {/* <li>Glossary</li> */}
            <li>Blog & Insights</li>
            <li>Market Analysis</li>
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
            <li>AML/KYC Policy</li>
            <li>Complaint Handling</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>About Us</h3>
          <ul>
            <li>📞 Contact Us: +44 20 3734 1025</li>
            <li>📧 Email: Support@treassurefunded.com</li>
            <li>📍 Exinity Limited</li>
            <li>🗺️ 5th Floor, 355 NEX Tower, London, UK</li>
          </ul>
        </div>

      </div>

      <div className="footer-container">

        <div className="footer-section">
          <h3>Trading</h3>
          <ul>
            <li>Accounts Overview & Comparison</li>
            {/* <li>Advantage Account</li> */}
            <li>Demo Trading</li>
            <li>Islamic Account</li>
            <li>Copy Trading</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Platform</h3>
          <ul>
            <li>MT4</li>
            <li>MT5</li>
            <li>Mobile Trading</li>
            <li>Web Trader</li>
            <li>API Trading</li>
          </ul>
        </div>

        {/* <div className="footer-section">
          <h3>Careers</h3>
          <ul>
            <li>Join our innovative team and grow your career in prop trading</li>
            <li>Open Positions</li>
            <li>Internship Programs</li>
            <li>Culture & Benefits</li>
            <li>Employee Testimonials</li>
          </ul>
        </div> */}

        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li>Help Center</li>
            <li>Live Chat</li>
            <li>FAQ</li>
            <li>Submit a Ticket</li>
            <li>Community Forum</li>
          </ul>
        </div>

      </div>

      <div className="footer-note">
        © 2025 Treasure Funded. All rights reserved. | Designed with ❤️ by Treasure Funded Team
      </div>
    </footer>
  );
};

export default Footer;
