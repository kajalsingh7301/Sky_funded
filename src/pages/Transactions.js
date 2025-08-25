import React, { useEffect, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../Assets/tfl.png"; // Add your logo in Assets folder
import "./Transactions.css";

const Transactions = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem("username"); 
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    if (!username) return;
    fetchDeposits();
  }, [username]);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/deposits/user/${username}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setDeposits(res.data);
    } catch (err) {
      console.error("Error fetching deposits:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = (deposit) => {
    const element = document.createElement("div");
    element.className = "receipt-container";
    element.innerHTML = `
      <div class="receipt-header">
        <img src="${logo}" alt="Logo" style="width:150px; height:auto; margin-bottom:20px;" />
        <div>
          <h2>Deposit Receipt</h2>
          <p>Date: ${new Date(deposit.createdAt).toLocaleDateString()}</p>
          <p>Receipt #: ${deposit._id.slice(-6).toUpperCase()}</p>
        </div>
      </div>
      <table class="receipt-table">
        <tr>
          <th>Username</th>
          <td>${username}</td>
        </tr>
        <tr>
          <th>Amount</th>
          <td>$${deposit.amount}</td>
        </tr>
        <tr>
          <th>Payment Method</th>
          <td>${deposit.paymentMethod.toUpperCase()}</td>
        </tr>
        <tr>
          <th>Status</th>
          <td>${deposit.status}</td>
        </tr>
        ${deposit.screenshot ? `<tr><th>Proof</th><td><a href="${deposit.screenshot}" target="_blank">View</a></td></tr>` : ""}
      </table>
      <div class="receipt-footer">
        Thank you for your deposit!
      </div>
    `;

    document.body.appendChild(element);

    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // margin 10
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
      pdf.save(`deposit_${deposit._id}.pdf`);
      document.body.removeChild(element);
    });
  };

  return (
    <div className="transactions-container">
      <h2>Your Deposits</h2>

      {loading ? (
        <p>Loading deposits...</p>
      ) : deposits.length === 0 ? (
        <p>No deposits found.</p>
      ) : (
        <div className="deposit-list">
          {deposits.map((dep) => (
            <div key={dep._id} className="deposit-card">
              <p><strong>Amount:</strong> ${dep.amount}</p>
              <p><strong>Payment Method:</strong> {dep.paymentMethod.toUpperCase()}</p>
              <p><strong>Status:</strong> {dep.status}</p>
              <p><strong>Date:</strong> {new Date(dep.createdAt).toLocaleDateString()}</p>
              {dep.screenshot && (
                <p>
                  <strong>Proof:</strong>{" "}
                  <a href={dep.screenshot} target="_blank" rel="noopener noreferrer">View</a>
                </p>
              )}
              <button onClick={() => downloadReceipt(dep)} className="download-btn">
                Download Receipt
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transactions;
