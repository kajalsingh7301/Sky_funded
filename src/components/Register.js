import React, { useState } from 'react';
import './Register.css';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaGlobe } from 'react-icons/fa';
import register from "../Assets/Registerimg.jpg";

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia",
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
  "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
  "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros",
  "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
  "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
  "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia",
  "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan",
  "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
  "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal",
  "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru",
  "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
  "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain",
  "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen", "Zambia", "Zimbabwe"
];

const Registration = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    referralId: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration successful!");
      console.log(res.data);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert("Registration failed.");
    }
  };

  return (
    <div className="sky-funded-register-container">
      <div className="sky-funded-register-left">
        <h2>Let's get you set up</h2>
        <p>It should only take a couple of minutes to create your account.</p>
        <img src={register} alt="Registration Illustration" />
      </div>

      <div className="sky-funded-register-right">
        <h1 className="sky-funded-logo">SkyFunded</h1>
        <form className="sky-funded-register-form" onSubmit={handleSubmit}>
          <div className="sky-funded-form-row">
            <div className="sky-funded-input-group">
              <FaUser className="icon" />
              <input name="username" type="text" placeholder="Enter Unique Username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="sky-funded-input-group">
              <FaUser className="icon" />
              <input name="fullName" type="text" placeholder="Enter Full Name" value={formData.fullName} onChange={handleChange} required />
            </div>
          </div>

          <div className="sky-funded-form-row">
            <div className="sky-funded-input-group">
              <FaEnvelope className="icon" />
              <input name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="sky-funded-input-group">
              <FaPhone className="icon" />
              <input name="phone" type="tel" placeholder="Enter Phone Number" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="sky-funded-form-row">
            <div className="sky-funded-input-group">
              <FaLock className="icon" />
              <input name="password" type="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="sky-funded-input-group">
              <FaLock className="icon" />
              <input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <div className="sky-funded-form-row">
            <div className="sky-funded-input-group">
              <FaGlobe className="icon" />
              <select name="country" value={formData.country} onChange={handleChange} required>
                <option value="">Select Country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="sky-funded-input-group">
              <FaUser className="icon" />
              <input
                name="referralId"
                type="text"
                placeholder="Referral ID"
                value={formData.referralId}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="sky-funded-checkbox">
            <input type="checkbox" required />
            <label>I Accept the Terms and Privacy Policy</label>
          </div>

          <button type="submit" className="sky-funded-register-btn">Register</button>
          <p className="sky-funded-login-link">
            Already have an account? <span>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
