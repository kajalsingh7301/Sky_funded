import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaChartLine,
  FaUser,
  FaTicketAlt,
  FaExchangeAlt,
  FaWallet,
  FaCog,
} from "react-icons/fa";
import "./Sidebar.css";


const Sidebar = () => {
  const location = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FaChartLine /> },
    { to: "/profile", label: "Profile", icon: <FaUser /> },
    { to: "/admin/challenge-page", label: "Challenges", icon: <FaTicketAlt /> },
    { to: "/transaction", label: "Transaction", icon: <FaExchangeAlt /> },
    { to: "/deposit", label: "Deposit", icon: <FaWallet /> },
    { to: "/settings", label: "Settings", icon: <FaCog /> },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">SkyFunded</h2>
      <nav className="sidebar-nav">
        {links.map(({ to, label, icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <span className="icon">{icon}</span>
              <span className="label">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
