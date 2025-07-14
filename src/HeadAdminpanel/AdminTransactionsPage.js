import React, { useEffect, useState } from "react";
import "./AdminTransactionsPage.css";

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const message = errorData?.message || `Error: ${res.status} ${res.statusText}`;
          throw new Error(message);
        }
        return res.json();
      })
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : data.transactions || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading transactions...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-transactions-page">
      <h2>Transaction History</h2>
      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No transactions found.</td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id}>
                  <td>{tx.transactionId || "N/A"}</td>
                  <td>
                    {tx.userId?.fullName
                      ? `${tx.userId.fullName} (${tx.userId.username})`
                      : "N/A"}
                  </td>
                  <td>${typeof tx.amount === "number" ? tx.amount.toFixed(2) : "0.00"}</td>
                  <td>{tx.status || "Pending"}</td>
                  <td>{tx.date ? new Date(tx.date).toLocaleDateString() : "N/A"}</td>
                  <td>{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
