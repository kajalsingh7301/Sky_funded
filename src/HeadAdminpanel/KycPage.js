// AdminKycPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./KycPage.css";

const AdminKycPage = () => {
  const [kycList, setKycList] = useState([]);

  useEffect(() => {
    axios
      .get("/api/kyc")
      .then((res) => setKycList(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleApprove = async (id) => {
    await axios.put(`/api/kyc/${id}/approve`);
    refreshList();
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter reason for rejection:");
    if (reason) {
      await axios.put(`/api/kyc/${id}/reject`, { reason });
      refreshList();
    }
  };

  const refreshList = () => {
    axios.get("/api/kyc").then((res) => setKycList(res.data));
  };

  return (
    <div className="kyc-container">
      <h2 className="kyc-title">User KYC Submissions</h2>

      {kycList.length === 0 ? (
        <p className="kyc-message">No KYC submissions yet.</p>
      ) : (
        <div className="kyc-table-wrapper">
          <table className="kyc-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>DOB</th>
                <th>Document Type</th>
                <th>ID Front</th>
                <th>ID Back</th>
                <th>Submitted At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {kycList.map((kyc) => (
                <tr key={kyc._id}>
                  <td>{kyc.fullName}</td>
                  <td>{kyc.dob}</td>
                  <td>{kyc.documentType}</td>
                  <td>
                    <img
                      src={kyc.idFront}
                      alt="ID Front"
                      className="kyc-img-thumb"
                    />
                  </td>
                  <td>
                    {kyc.idBack ? (
                      <img
                        src={kyc.idBack}
                        alt="ID Back"
                        className="kyc-img-thumb"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{new Date(kyc.submittedAt).toLocaleString()}</td>
                  <td>
                    <span className={`status-${kyc.status}`}>
                      {kyc.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="approve-btn"
                      disabled={kyc.status !== "pending"}
                      onClick={() => handleApprove(kyc._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="decline-btn"
                      disabled={kyc.status !== "pending"}
                      onClick={() => handleReject(kyc._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminKycPage;
