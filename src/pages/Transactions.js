import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Transactions.css";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [newTransaction, setNewTransaction] = useState({
    transactionId: "",
    amount: "",
    status: "pending",
    date: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("No token found. Please login.");
      return;
    }
    fetchTransactions();
  }, [token]);

  const fetchTransactions = async () => {
    if (!token) return; // extra safety check
    setLoading(true);
    try {
      const res = await axios.get("/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data) => {
    const err = {};
    if (!data.transactionId?.trim()) err.transactionId = "Transaction ID is required.";
    if (!data.amount || isNaN(data.amount) || Number(data.amount) <= 0) err.amount = "Valid amount required.";
    if (!data.date) err.date = "Date is required.";
    return err;
  };

  const handleEdit = (tx) => {
    setEditingId(tx._id);
    setEditedData({ ...tx });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedData({});
    setErrors({});
  };

  const handleSaveEdit = async () => {
    const validationErrors = validateForm(editedData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    try {
      await axios.put(`/api/transactions/${editingId}`, editedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchTransactions();
      handleCancelEdit();
    } catch (err) {
      console.error("Error updating transaction:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    try {
      await axios.delete(`/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchTransactions();
    } catch (err) {
      console.error("Error deleting transaction:", err.response?.data || err.message);
    }
  };

  const handleAddTransaction = async () => {
    const validationErrors = validateForm(newTransaction);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    if (!token) {
      console.error("No token found. Please login.");
      return;
    }

    try {
      await axios.post("/api/transactions", newTransaction, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchTransactions();
      setNewTransaction({ transactionId: "", amount: "", status: "pending", date: "" });
      setShowAddModal(false);
      setErrors({});
    } catch (err) {
      console.error("Error adding transaction:", err.response?.data || err.message);
    }
  };

  const filteredTransactions = transactions.filter((t) =>
    t.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="transactions-container">
      <h2>Transactions</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by Transaction ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
        <button onClick={() => setShowAddModal(true)} disabled={editingId !== null || loading}>
          + Add Transaction
        </button>
      </div>

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <div className="transaction-list">
          {filteredTransactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            filteredTransactions.map((tx) => (
              <div key={tx._id} className="transaction-card">
                {editingId === tx._id ? (
                  <>
                    <input
                      type="text"
                      value={editedData.transactionId}
                      onChange={(e) =>
                        setEditedData({ ...editedData, transactionId: e.target.value })
                      }
                    />
                    {errors.transactionId && <small className="error">{errors.transactionId}</small>}

                    <input
                      type="number"
                      value={editedData.amount}
                      onChange={(e) =>
                        setEditedData({ ...editedData, amount: e.target.value })
                      }
                    />
                    {errors.amount && <small className="error">{errors.amount}</small>}

                    <select
                      value={editedData.status}
                      onChange={(e) =>
                        setEditedData({ ...editedData, status: e.target.value })
                      }
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>

                    <input
                      type="date"
                      value={editedData.date?.split("T")[0]}
                      onChange={(e) =>
                        setEditedData({ ...editedData, date: e.target.value })
                      }
                    />
                    {errors.date && <small className="error">{errors.date}</small>}

                    <div className="actions">
                      <button onClick={handleSaveEdit}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>ID:</strong> {tx.transactionId}</p>
                    <p><strong>Amount:</strong> ${tx.amount}</p>
                    <p><strong>Status:</strong> {tx.status}</p>
                    <p><strong>Date:</strong> {new Date(tx.date).toLocaleDateString()}</p>
                    <div className="actions">
                      <button onClick={() => handleEdit(tx)}>Edit</button>
                      <button onClick={() => handleDelete(tx._id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Transaction</h3>
            <input
              placeholder="Transaction ID"
              value={newTransaction.transactionId}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, transactionId: e.target.value })
              }
            />
            {errors.transactionId && <small className="error">{errors.transactionId}</small>}

            <input
              type="number"
              placeholder="Amount"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, amount: e.target.value })
              }
            />
            {errors.amount && <small className="error">{errors.amount}</small>}

            <select
              value={newTransaction.status}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, status: e.target.value })
              }
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="failed">Failed</option>
            </select>

            <input
              type="date"
              value={newTransaction.date}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, date: e.target.value })
              }
            />
            {errors.date && <small className="error">{errors.date}</small>}

            <div className="actions">
              <button onClick={handleAddTransaction}>Add</button>
              <button onClick={() => {
                setShowAddModal(false);
                setErrors({});
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
