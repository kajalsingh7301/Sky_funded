// Same imports
import React, { useEffect, useState } from "react";
import "./AdminDepositPage.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api.treassurefunded.com";

const AdminDepositsPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isAdminView, setIsAdminView] = useState(false);
  const [statuses, setStatuses] = useState({}); // NEW STATE
  const limit = 1000;

  const getSafe = (value, fallback = "N/A") => value || fallback;

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`${BASE_URL}/api/deposit?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          setError("Unauthorized access. Please login again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const msg = errorData?.msg || "Failed to fetch deposits";
          throw new Error(msg);
        }
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.deposits)) {
          const sorted = data.deposits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setDeposits(sorted);
          setTotal(data.total || 0);
          setError(null);

          if (sorted.length > 0 && sorted[0].userId) {
            setIsAdminView(true);
          } else {
            setIsAdminView(false);
          }
        } else {
          setDeposits([]);
          setError("Unexpected data format from server");
        }
      })
      .catch((err) => {
        setError(err.message || "Error fetching deposits");
        setDeposits([]);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const handleStatus = (id, type) => {
    setStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => (prev < totalPages ? prev + 1 : prev));

  return (
    <div className="admin-deposits-page">
      <h2>{isAdminView ? "All Deposits (Admin)" : "My Deposit History"}</h2>

      {loading ? (
        <div className="loading">Loading deposits...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <div className="deposits-table">
            <table>
              <thead>
                <tr>
                  {isAdminView && <th>User</th>}
                  {isAdminView && <th>Email</th>}
                  <th>Payment Method</th>
                  <th>Amount</th>
                  <th>Screenshot</th>
                  <th>Date</th>
                  {isAdminView && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {deposits.length === 0 ? (
                  <tr>
                    <td colSpan={isAdminView ? 7 : 5} style={{ textAlign: "center" }}>
                      No deposits found.
                    </td>
                  </tr>
                ) : (
                  deposits.map((dep) => {
                    const status = statuses[dep._id];

                    return (
                      <tr key={dep._id}>
                        {isAdminView && <td>{getSafe(dep.userId?.username)}</td>}
                        {isAdminView && <td>{getSafe(dep.userId?.email)}</td>}
                        <td>{getSafe(dep.paymentMethod)}</td>
                        <td>${parseFloat(dep.amount).toFixed(2)}</td>
                        <td>
                          {dep.screenshotUrl ? (
                            <a href={`${BASE_URL}${dep.screenshotUrl}`} target="_blank" rel="noreferrer">
                              <img
                                src={`${BASE_URL}${dep.screenshotUrl}`}
                                alt="screenshot"
                                className="screenshot-thumb"
                              />
                            </a>
                          ) : (
                            "No Screenshot"
                          )}
                        </td>
                        <td>{dep.createdAt ? new Date(dep.createdAt).toLocaleString() : "N/A"}</td>
                        {isAdminView && (
                          <td>
                            <div className="action-buttons">
                              <button
                                className={`approve-btn ${status === "approved" ? "active" : ""}`}
                                onClick={() => handleStatus(dep._id, "approved")}
                              >
                                Approve
                              </button>
                              <button
                                className={`decline-btn ${status === "declined" ? "active" : ""}`}
                                onClick={() => handleStatus(dep._id, "declined")}
                              >
                                Decline
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination-controls">
            <button onClick={handlePrev} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button onClick={handleNext} disabled={page >= totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDepositsPage;
