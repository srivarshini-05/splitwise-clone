import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./sharedExpenses.css";

function SharedExpenses() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/groups/user/${user.id}`
      );
      setGroups(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="shared-page">

      {/* Back */}
      <div className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </div>

      {/* Header */}
      <div className="shared-header">

        <div className="shared-title">
          <div className="shared-icon">👥</div>
          <h1>Expense Groups</h1>
        </div>

        <button
          className="create-group-btn"
          onClick={() => navigate("/shared/create")}
        >
          + Create Group
        </button>

      </div>

      {/* Groups List */}
      <div className="groups-container">

        {groups.length === 0 ? (
          <p className="empty-text">No groups created yet</p>
        ) : (
          groups.map((group) => (
            <div
              key={group.id}
              className="group-card"
              onClick={() => navigate(`/group/${group.id}`)}
            >

              <div className="group-icon">👥</div>

              <div className="group-info">
                <h3>{group.name}</h3>
                <p>{group.description}</p>

                <span className="member-badge">
                  {group.total_members} Members
                </span>
              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default SharedExpenses;