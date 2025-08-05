import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.isRead)
          .map(n => axios.patch(`http://localhost:5000/api/notifications/${n._id}/read`))
      );
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'user_signup': return '👤';
      case 'deposit_request': return '💰';
      case 'support_message': return '📩';
      case 'kyc_submitted': return '🆔';
      case 'alert': return '⚠️';
      default: return '🔔';
    }
  };

  const filtered = notifications.filter(n =>
    filter === 'all' ? true : filter === 'read' ? n.isRead : !n.isRead
  );

  return (
    <div className="notifications-container">
      <div className="header">
        <h2>🔔 Admin Notifications</h2>
        <button className="mark-all-btn" onClick={markAllAsRead}>Mark All as Read</button>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All</button>
        <button onClick={() => setFilter('unread')} className={filter === 'unread' ? 'active' : ''}>Unread</button>
        <button onClick={() => setFilter('read')} className={filter === 'read' ? 'active' : ''}>Read</button>
      </div>

      {filtered.length === 0 ? (
        <p className="no-notifications">No notifications to show.</p>
      ) : (
        <div className="notification-list">
          {filtered.map(n => (
            <div className={`notification-card ${!n.isRead ? 'unread' : ''}`} key={n._id}>
              <div className="notification-icon">{getIcon(n.type)}</div>
              <div className="notification-content">
                <h4>{n.title}</h4>
                <p>{n.message}</p>
                <small>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
              {!n.isRead && (
                <button className="mark-read" onClick={() => markAsRead(n._id)}>
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
