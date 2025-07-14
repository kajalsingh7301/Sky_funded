import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UsersPage.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) throw new Error('Please login as admin first.');

        const res = await axios.get('/api/admin/all-users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
            <th>Active Challenges</th>
            <th>Total Profit</th>
            <th>Total Balance</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="9">No users found.</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.country}</td>
                <td>{user.role}</td>
                <td>{user.activeChallenges || 0}</td>
                <td>{user.totalProfit || 0}</td>
                <td>{user.totalBalance || 0}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
