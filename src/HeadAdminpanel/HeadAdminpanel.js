import React, { useState } from "react";
import "./HeadAdminpanel.css";
import UsersPage from "./UsersPage";
import AdminDepositPage from "./AdminDepositPage";
import AdminTransactionsPage from "./AdminTransactionsPage";
import SupportPage from "./SupportPage";

import {
  FaEnvelope,
  FaBell,
  FaUserPlus,
} from "react-icons/fa";

const AdminPanel = () => {
  const [active, setActive] = useState("Dashboard");

  const handleClick = (e, page) => {
    e.preventDefault();
    setActive(page);
  };

  const handleSendMail = () => {
    window.location.href = "mailto:support@skyfunded.com";
  };

  return (
    <div className="admin-wrapper">
      <nav
        className="sidebar"
        role="navigation"
        aria-label="Admin Panel Navigation"
      >
        <h2>SkyFunded</h2>
        {["Dashboard", "Users", "Deposit", "Transaction", "Support"].map((page) => (
          <a
            href={`#${page.toLowerCase()}`}
            key={page}
            role="button"
            tabIndex={0}
            className={active === page ? "active" : ""}
            onClick={(e) => handleClick(e, page)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleClick(e, page);
            }}
          >
            {page}
          </a>
        ))}
      </nav>

      <main className="main-panel">
        <div className="topbar">
          <h1>{active}</h1>
          <p>Admin Panel</p>
        </div>

        {active === "Dashboard" && (
          <>
            <section className="dashboard" aria-live="polite" aria-atomic="true">
              <p>Welcome to the Admin Dashboard.</p>
              {/* You can add any other content you want here */}
            </section>

            <section className="dashboard-bottom">
              <aside className="right-panel">
                <div className="notifications glass" aria-label="Notifications">
                  <h3>
                    <FaBell /> Notifications
                  </h3>
                  <ul>
                    <li>🚀 New user signed up</li>
                    <li>💬 Ticket received</li>
                    <li>⚙️ Server check complete</li>
                  </ul>
                </div>

                <div className="actions glass">
                  <button aria-label="Create Account">
                    <FaUserPlus /> Create Account
                  </button>
                  <button
                    className="secondary"
                    onClick={handleSendMail}
                    aria-label="Send Mail"
                  >
                    <FaEnvelope /> Send Mail
                  </button>
                </div>
              </aside>
            </section>
          </>
        )}

        {active === "Users" && <UsersPage />}
        {active === "Deposit" && <AdminDepositPage />}
        {active === "Transaction" && <AdminTransactionsPage />}
        {active === "Support" && <SupportPage />}
      </main>
    </div>
  );
};

export default AdminPanel;
