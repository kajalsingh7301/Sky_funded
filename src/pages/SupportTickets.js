import React, { useState } from "react";
import "./SupportTickets.css";

const SupportTickets = () => {
  // Sample empty ticket list
  const [tickets] = useState([]); // Replace with real data as needed

  return (
    <div className="ticket-container">
      <div className="ticket-header">
        <h2>🎫 Tickets</h2>
      </div>
      <div className="ticket-table">
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Created Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  <div className="no-icon">📥</div>
                  <p>No data</p>
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.date}</td>
                  <td>{ticket.status}</td>
                  <td>
                    <button className="view-btn">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button>{"<"}</button>
        <span className="active-page">1</span>
        <button>{">"}</button>
      </div>
    </div>
  );
};

export default SupportTickets;
