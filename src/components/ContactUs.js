import React, { useState } from "react";
import axios from "axios";
import "./ContactUs.css";
import { FaFacebook, FaInstagram, FaTwitter, FaTelegram } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import imagep1 from "../Assets/call.jpg";
import imagep2 from "../Assets/msg.jpg";
import imagep3 from "../Assets/location.jpg";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const trimmedData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        message: formData.message.trim(),
      };

      const response = await axios.post("/api/contact", trimmedData);

      setStatus({ type: "success", msg: response.data.msg });
      setFormData({ firstName: "", lastName: "", email: "", mobile: "", message: "" });
    } catch (err) {
      if (err.response && err.response.data) {
        const backendErrors = err.response.data.errors;
        if (backendErrors && backendErrors.length > 0) {
          setStatus({ type: "error", msg: backendErrors.join(" ") });
        } else if (err.response.data.msg) {
          setStatus({ type: "error", msg: err.response.data.msg });
        } else {
          setStatus({ type: "error", msg: "Something went wrong. Please try again." });
        }
      } else {
        setStatus({ type: "error", msg: "Network error. Please check your connection." });
      }
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-main">
        <h1 className="contact1div">Contact us</h1>
        <h2 className="container2div">
          "Contact Us for Expert Treasure Funded Guidance & Support"
        </h2>
        <p className="container-contact-para">
          "Need assistance with Treasure Funded? Our team is ready to help! <br />
          Get expert guidance and support tailored to your needs. Expect responsive <br />
          service and seamless communication every step of the way." <br />
          Does that fit what you're looking for?
        </p>
        <div className="contact-us">Contact Us</div>
      </div>

      <div className="side-bar-div">
        <div className="contact-map">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=...your-location..."
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="contact-info">
          <h2 className="contact-heading-">Contact Information</h2>
          <div className="info-div">
            <div className="info-box">
              <img src={imagep1} alt="Phone" className="img--1" />
              <p>+44-123456789</p>
            </div>
            <div className="info-box">
              <img src={imagep2} alt="Email" className="img--1" />
              <p>info@skyfunded.com</p>
            </div>
            <div className="info-box">
              <img src={imagep3} alt="Location" className="img--1" />
              <p>351 Oxford St, London, UK</p>
            </div>
          </div>
        </div>

        <div className="social-links">
          <p>Our Social Media Platforms</p>
          <div className="icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="social-icon" />
            </a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
              <FaTelegram className="social-icon" />
            </a>
            <a href="https://threads.org" target="_blank" rel="noopener noreferrer">
              <FaThreads className="social-icon" />
            </a>
          </div>
        </div>
      </div>

      <div className="form-main">
        <div className="contact-form-section">
          <div className="contact-form-content">
            <h2 className="sub-head-div">Contact Us</h2>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="input-box">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              </div>

              <div className="input-box">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="input-box">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                required
              />
            </div>

            <div className="input-box">
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                required
              />
            </div>

            <div className="input-box">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Leave Us Message..."
                required
              />
            </div>

            <div className="privacy-policy">
              <input type="checkbox" className="privacy" required />
              <label htmlFor="privacy">
                You agree to our friendly{" "}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div type="submit" className="submit-btn">
              Submit
            </div>
          </form>

          {status && (
            <div className={`status-message ${status.type}`}>
              {status.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
