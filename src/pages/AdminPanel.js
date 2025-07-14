import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaChartLine,
  FaTicketAlt,
  FaMoneyBill,
  FaBell,
  FaTimes,
  FaUsers,
  FaSmile,
  FaDollarSign,
} from "react-icons/fa";
import "./AdminPanel.css";

const StatCard = ({ title, icon, value, isCurrency = false }) => (
  <div className="stat-card" role="region" aria-label={title}>
    <div className="stat-card-icon">{icon}</div>
    <div>
      <h3>{title}</h3>
      <p>
        {value !== null && value !== undefined
          ? isCurrency
            ? `$${value.toLocaleString()}`
            : value.toLocaleString()
          : 0}
      </p>
    </div>
  </div>
);

// Generic animated count-up component
const AnimatedCountUp = ({ end, isCurrency = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const max = end || 0;
    const increment = Math.ceil(max / 100);
    const interval = setInterval(() => {
      current += increment;
      if (current >= max) {
        current = max;
        clearInterval(interval);
      }
      setCount(current);
    }, 30);
    return () => clearInterval(interval);
  }, [end]);

  return (
    <p>{isCurrency ? `$${count.toLocaleString()}` : count.toLocaleString()}</p>
  );
};

const HappyCustomersCountUp = ({ startCount }) => (
  <p>
    <AnimatedCountUp end={startCount || 100} /> happy customers and counting...
  </p>
);

const ActivitiesModal = ({ userName, activities, onClose }) => (
  <div
    className="modal-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modalTitle"
  >
    <div className="modal-content">
      <button
        className="modal-close-btn"
        onClick={onClose}
        aria-label="Close activities modal"
      >
        <FaTimes size={20} />
      </button>
      <h2 id="modalTitle">{userName} Recent Activities</h2>
      {activities.length === 0 ? (
        <p>
          You can start your journey by taking any challenge or exploring the
          platform.
        </p>
      ) : (
        <ul className="modal-activities-list">
          {activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      )}
      <hr />
      <div className="modal-directions">
        <h3>How to make the most of Sky Funded:</h3>
        <ul>
          <li>Participate in daily challenges to improve your skills.</li>
          <li>Track your performance in the dashboard regularly.</li>
          <li>Explore learning resources and tips in the help section.</li>
          <li>Reach out to support if you face any issues or have questions.</li>
        </ul>
      </div>
    </div>
  </div>
);

const AdminPanel = () => {
  const [active, setActive] = useState("Dashboard");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const username = localStorage.getItem("username");
  const extraNotification = "🎉 Your account was upgraded to Pro!";

  // Simple new notification and recent activity
  const simpleNotification = "Your profile was viewed 3 times today.";
  const simpleRecentActivity = "Monthly team meeting held on 21st May.";

  useEffect(() => {
    if (!username) {
      setError("User not logged in");
      return;
    }

    axios
      .get(`http://localhost:5000/api/user/${username}`)
      .then((response) => {
        setUserData(response.data);
      })
      .catch((err) => {
        setError("Failed to load user data");
        console.error(err);
      });
  }, [username]);

  if (error) {
    return (
      <div className="loading error-message">
        <p>{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="loading">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div
      className="user-wrapper"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div
        className="main-panel"
        style={{ flex: 1, padding: "20px", maxWidth: 1200, margin: "auto" }}
      >
        <div className="topbar" style={{ marginBottom: "30px" }}>
          <h1>{active}</h1>
          <div className="user-welcome" style={{ marginTop: "8px" }}>
            <h2 className="username">{userData.name || username}</h2>
            <p>Welcome back to your dashboard!</p>
          </div>
        </div>

        <div
          className="stats-container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          <StatCard
            title="Total Profit"
            value={userData.totalProfit || 0}
            icon={<FaChartLine />}
            isCurrency
          />
          <StatCard
            title="Active Challenges"
            value={userData.activeChallenges || 0}
            icon={<FaTicketAlt />}
          />
          <StatCard
            title="Total Balance"
            value={userData.totalBalance || 0}
            icon={<FaMoneyBill />}
            isCurrency
          />

          <div className="stat-card" role="region" aria-label="Active Users">
            <div className="stat-card-icon">
              <FaUsers />
            </div>
            <div>
              <h3>Active Users</h3>
              <AnimatedCountUp end={10000} />
            </div>
          </div>

          <div
            className="stat-card"
            role="region"
            aria-label="Monthly Revenue"
          >
            <div className="stat-card-icon">
              <FaDollarSign />
            </div>
            <div>
              <h3>Monthly Revenue</h3>
              <AnimatedCountUp
                end={userData.monthlyRevenue || 120000}
                isCurrency
              />
            </div>
          </div>

          <div
            className="stat-card"
            role="region"
            aria-label="Happy Customers"
          >
            <div className="stat-card-icon">
              <FaSmile />
            </div>
            <div>
              <h3>Happy Customers</h3>
              <HappyCustomersCountUp
                startCount={userData.happyCustomersCount || 1000}
              />
            </div>
          </div>
        </div>

        <div
          className="bottom-dashboard"
          style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}
        >
          <section
            className="recent-activities"
            style={{ flex: 1, minWidth: 280 }}
          >
            <h3>Recent Activities</h3>
            <ul>
              {(userData.recentActivities?.length > 0
                ? [...userData.recentActivities, simpleRecentActivity]
                : [simpleRecentActivity]
              )
                .slice(0, 5)
                .map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
            </ul>
            <button
              className="view-btn"
              onClick={() => setShowModal(true)}
              aria-label="View all recent activities"
            >
              View All
            </button>
          </section>

          <section className="notifications" style={{ flex: 1, minWidth: 280 }}>
            <h3>
              <FaBell aria-hidden="true" /> Notifications
            </h3>
            <ul>
              {(userData.notifications?.length > 0
                ? [...userData.notifications, extraNotification, simpleNotification]
                : [extraNotification, simpleNotification]
              ).map((notification, index) => (
                <li key={index}>{notification}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {showModal && (
        <ActivitiesModal
          userName={userData.name || username}
          activities={userData.recentActivities || []}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
