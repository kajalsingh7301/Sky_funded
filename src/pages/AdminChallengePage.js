import React, { useState, useEffect } from "react";
import {
  FaTicketAlt,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrashAlt,
  FaSearch,
} from "react-icons/fa";
import "./AdminChallengePage.css";

const ChallengeCard = ({ challenge, onEdit, onDelete, onViewDetails }) => (
  <div className="challenge-card">
    <div className="challenge-header">
      <h3>{challenge.name}</h3>
      <span
        className={`status ${
          challenge.status === "active" ? "active" : "inactive"
        }`}
      >
        {challenge.status}
      </span>
    </div>
    <p>{challenge.description}</p>
    <div className="challenge-footer">
      <p>Progress: {challenge.progress}%</p>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${challenge.progress}%` }}
        ></div>
      </div>
      <div className="challenge-actions">
        <div
          className="btn view-btn"
          onClick={() => onViewDetails(challenge.id)}
          aria-label={`View details of ${challenge.name}`}
        >
          View Details
        </div>
        <div
          className="btn edit-btn"
          onClick={() => onEdit(challenge.id)}
          aria-label={`Edit ${challenge.name}`}
        >
          <FaEdit /> Edit
        </div>
        <div
          className="btn delete-btn"
          onClick={() => onDelete(challenge.id)}
          aria-label={`Delete ${challenge.name}`}
        >
          <FaTrashAlt /> Delete
        </div>
      </div>
    </div>
  </div>
);

const AdminChallengePage = () => {
 const [challenges, setChallenges] = useState([
  {
    id: 1,
    name: "Challenge 1",
    description: "Complete 20 trading setups successfully.",
    progress: 20,
    status: "active",
  },
  {
    id: 2,
    name: "Challenge 2",
    description: "Achieve 60% accuracy in signal predictions.",
    progress: 60,
    status: "active",
  },
  {
    id: 3,
    name: "Challenge 3",
    description: "Reach 80% completion in risk management tasks.",
    progress: 80,
    status: "inactive",
  },
  {
    id: 4,
    name: "Challenge 4",
    description: "Maintain consistent daily profit streaks.",
    progress: 45,
    status: "inactive",
  },
  {
    id: 5,
    name: "Challenge 5",
    description: "Complete 70% of planned market analysis.",
    progress: 70,
    status: "active",
  },
  {
    id: 6,
    name: "Challenge 6",
    description: "Achieve 90% accuracy in trade execution.",
    progress: 90,
    status: "active",
  },
  {
    id: 7,
    name: "Challenge 7",
    description: "Complete initial 10 practice trades.",
    progress: 10,
    status: "inactive",
  },
]);
  const [filteredChallenges, setFilteredChallenges] = useState(challenges);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingChallengeId, setEditingChallengeId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: "",
    description: "",
    progress: 0,
    status: "active",
  });

  useEffect(() => {
    const filtered = challenges.filter((challenge) => {
      if (filter === "all") return true;
      return challenge.status === filter;
    });

    if (searchQuery) {
      setFilteredChallenges(
        filtered.filter((challenge) =>
          challenge.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredChallenges(filtered);
    }
  }, [filter, searchQuery, challenges]);

  const handleEdit = (id) => {
    const challengeToEdit = challenges.find((ch) => ch.id === id);
    setEditingChallengeId(id);
    setEditedData({ ...challengeToEdit });
  };

  const handleSaveEdit = (id) => {
    if (!editedData.name.trim()) {
      alert("Challenge name is required");
      return;
    }
    const progressClamped = Math.min(Math.max(editedData.progress, 0), 100);

    const updatedChallenges = challenges.map((ch) =>
      ch.id === id ? { ...ch, ...editedData, progress: progressClamped } : ch
    );
    setChallenges(updatedChallenges);
    setEditingChallengeId(null);
  };

  const handleDelete = (id) => {
    setChallengeToDelete(id);
    setConfirmationVisible(true);
  };

  const confirmDelete = () => {
    const updatedChallenges = challenges.filter(
      (ch) => ch.id !== challengeToDelete
    );
    setChallenges(updatedChallenges);
    setConfirmationVisible(false);
    setChallengeToDelete(null);
  };

  const cancelDelete = () => {
    setConfirmationVisible(false);
    setChallengeToDelete(null);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddChallenge = () => {
    setShowAddForm((prev) => !prev);
  };

  const handleSubmitNewChallenge = () => {
    if (!newChallenge.name.trim()) {
      alert("Challenge name is required");
      return;
    }
    const progressClamped = Math.min(Math.max(newChallenge.progress, 0), 100);

    const nextId =
      challenges.length > 0
        ? Math.max(...challenges.map((ch) => ch.id)) + 1
        : 1;
    const newEntry = { id: nextId, ...newChallenge, progress: progressClamped };
    setChallenges([...challenges, newEntry]);
    setShowAddForm(false);
    setNewChallenge({
      name: "",
      description: "",
      progress: 0,
      status: "active",
    });
  };

  return (
    <div className="admin-challenge-page">
      <h1>Challenges</h1>

      <button className="add-challenge-btn" onClick={handleAddChallenge}>
        {showAddForm ? "Cancel" : "+ Add New Challenge"}
      </button>

      <div className="filter-options">
        <select
          value={filter}
          onChange={handleFilterChange}
          aria-label="Filter challenges by status"
        >
          <option value="all">All Challenges</option>
          <option value="active">Active Challenges</option>
          <option value="inactive">Inactive Challenges</option>
        </select>

        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search Challenges"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search challenges by name"
          />
          <FaSearch className="search-icon" />
        </div>
      </div>

      <div className="challenge-list">
        {filteredChallenges.length === 0 ? (
          <p>No challenges available at the moment.</p>
        ) : (
          filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={(id) =>
                console.log(`View details for challenge ${id}`)
              }
            />
          ))
        )}
      </div>

      {/* Inline Edit */}
      {editingChallengeId && (
        <div className="edit-challenge-form">
          <h3>Edit Challenge</h3>
          <label>
            Name
            <input
              type="text"
              value={editedData.name}
              onChange={(e) =>
                setEditedData({ ...editedData, name: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit(editingChallengeId);
                if (e.key === "Escape") setEditingChallengeId(null);
              }}
              autoFocus
            />
          </label>

          <label>
            Description
            <textarea
              value={editedData.description}
              onChange={(e) =>
                setEditedData({ ...editedData, description: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit(editingChallengeId);
                if (e.key === "Escape") setEditingChallengeId(null);
              }}
            />
          </label>

          <label>
            Progress: {editedData.progress}%
            <input
              type="range"
              min="0"
              max="100"
              value={editedData.progress}
              onChange={(e) =>
                setEditedData({
                  ...editedData,
                  progress: Number(e.target.value),
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit(editingChallengeId);
                if (e.key === "Escape") setEditingChallengeId(null);
              }}
            />
          </label>

          <label>
            Status
            <select
              value={editedData.status}
              onChange={(e) =>
                setEditedData({ ...editedData, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <div className="edit-form-buttons">
            <button
              onClick={() => handleSaveEdit(editingChallengeId)}
              disabled={
                !editedData.name.trim() ||
                editedData.progress < 0 ||
                editedData.progress > 100
              }
            >
              Save
            </button>
            <button onClick={() => setEditingChallengeId(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Add Challenge Form */}
      {showAddForm && (
        <div className="add-challenge-form">
          <h3>Add New Challenge</h3>
          <label>
            Name
            <input
              type="text"
              placeholder="Challenge Name"
              value={newChallenge.name}
              onChange={(e) =>
                setNewChallenge({ ...newChallenge, name: e.target.value })
              }
              autoFocus
            />
          </label>

          <label>
            Description
            <textarea
              placeholder="Challenge Description"
              value={newChallenge.description}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  description: e.target.value,
                })
              }
            />
          </label>

          <label>
            Progress: {newChallenge.progress}%
            <input
              type="range"
              min="0"
              max="100"
              value={newChallenge.progress}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  progress: Number(e.target.value),
                })
              }
            />
          </label>

          <label>
            Status
            <select
              value={newChallenge.status}
              onChange={(e) =>
                setNewChallenge({ ...newChallenge, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <div className="add-form-buttons">
            <button
              onClick={handleSubmitNewChallenge}
              disabled={!newChallenge.name.trim()}
            >
              Add Challenge
            </button>
            <button onClick={handleAddChallenge}>Cancel</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmationVisible && (
        <div className="confirmation-modal">
          <div className="modal-content" role="dialog" aria-modal="true">
            <p>Are you sure you want to delete this challenge?</p>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="confirm-btn">
                <FaCheck /> Yes
              </button>
              <button onClick={cancelDelete} className="cancel-btn">
                <FaTimes /> No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChallengePage;
