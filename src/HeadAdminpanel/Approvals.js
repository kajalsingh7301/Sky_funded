import React, { useEffect, useState } from "react";
import "./Approvals.css";
import axios from "axios";

const ApprovalPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("adminToken"); // ✅ Use adminToken

  // 🔄 Fetch all users
  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/all-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ All users fetched:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // 🟢 Filter users by approval status
  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((user) => user.approvalStatus === filter);

  // ✅ Approve / Decline / Delete Handler
  const updateStatus = async (userId, approvalStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/update-user/${userId}`,
        { approvalStatus }, // ✅ backend expects approvalStatus
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAllUsers(); // Refresh list
    } catch (error) {
      console.error(`❌ Failed to ${approvalStatus} user:`, error);
      alert(`Failed to ${approvalStatus} user. Please try again.`);
    }
  };

  return (
    <div className="approval-container">
      <div className="approval-header">
        <h2>User Approvals</h2>
        <div className="approval-filters">
          {["all", "pending", "approved", "declined", "deleted"].map(
            (status) => (
              <button
                key={status}
                className={filter === status ? "active" : ""}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      <div className="approval-list">
        {filteredUsers.length === 0 ? (
          <p className="no-approvals">No users found in this category.</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className={`approval-card ${user.approvalStatus}`}
            >
              <div className="approval-info">
                <h4>{user.username}</h4>
                <p>Email: {user.email}</p>
                <p>Status: {user.approvalStatus}</p>
              </div>
              <div className="approval-actions">
                <button
                  className="btn-approve"
                  onClick={() => updateStatus(user._id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="btn-decline"
                  onClick={() => updateStatus(user._id, "declined")}
                >
                  Decline
                </button>
                <button
                  className="btn-delete"
                  onClick={() => updateStatus(user._id, "deleted")}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApprovalPage;
