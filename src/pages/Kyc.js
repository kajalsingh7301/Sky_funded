import React, { useState } from "react";
import "./Kyc.css";

const Kyc = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    documentType: "",
  });

  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files?.length) {
      if (name === "idFront") setIdFront(files[0]);
      if (name === "idBack") setIdBack(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, dob, documentType } = formData;
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not logged in. Please login first.");
      return;
    }

    if (!fullName || !dob || !documentType || !idFront) {
      alert("All required fields must be filled.");
      return;
    }

    const data = new FormData();
    data.append("fullName", fullName);
    data.append("dob", dob);
    data.append("documentType", documentType);
    data.append("idFront", idFront);
    if (idBack) data.append("idBack", idBack);

    try {
      const response = await fetch("http://localhost:5000/api/kyc", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("✅ KYC submitted successfully!");
        setFormData({ fullName: "", dob: "", documentType: "" });
        setIdFront(null);
        setIdBack(null);
        document.getElementById("kyc-form").reset();
      } else {
        alert(result.msg || "Submission failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Network or server error.");
    }
  };

  return (
    <div className="kyc-container">
      <h2>KYC Verification</h2>
      <p>Please fill out the form and upload your ID.</p>

      {successMessage && <div className="success-msg">{successMessage}</div>}

      <form className="kyc-form" id="kyc-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Birth *</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Document Type *</label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            required
          >
            <option value="">--Select--</option>
            <option value="Aadhar">Aadhar</option>
            <option value="PAN">PAN</option>
            <option value="Passport">Passport</option>
            <option value="Driving License">Driving License</option>
          </select>
        </div>

        <div className="form-group">
          <label>Upload ID Front Image *</label>
          <input
            type="file"
            name="idFront"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload ID Back Image (Optional)</label>
          <input
            type="file"
            name="idBack"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit for Verification
        </button>
      </form>
    </div>
  );
};

export default Kyc;
