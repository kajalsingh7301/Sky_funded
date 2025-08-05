import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UsersPage.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Please login as admin first.');

      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to load users');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApproval = async (userId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Please login as admin first.');

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/approve-user/${userId}`,
        {}, // No body required for status
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, approvalStatus: status } : user
        )
      );
    } catch (err) {
      console.error('Approval error:', err);
      alert('Failed to update approval status');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="users-container">
      <h2>All Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Country</th>
            <th>Role</th>
            <th>Approval</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.country}</td>
                <td>{user.role}</td>
                <td>
                  <div
                    className={`approve-btn ${user.approvalStatus === 'approved' ? 'active-approve' : ''}`}
                    onClick={() => handleApproval(user._id, 'approved')}
                  >
                    {user.approvalStatus === 'approved' ? 'Approved' : 'Approve'}
                  </div>
                  <div
                    className={`decline-btn ${user.approvalStatus === 'declined' ? 'active-decline' : ''}`}
                    onClick={() => handleApproval(user._id, 'declined')}
                  >
                    {user.approvalStatus === 'declined' ? 'Declined' : 'Decline'}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
