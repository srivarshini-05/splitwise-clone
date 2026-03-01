import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./createGroup.css";

function CreateGroup() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);
  const [memberId, setMemberId] = useState("");

  const addMember = () => {
    if (memberId && !members.includes(memberId)) {
      setMembers([...members, memberId]);
      setMemberId("");
    }
  };

  const createGroup = async () => {
    try {
      await axios.post("splitwise-server-b4zr.onrender.com/api/groups/create", {
        name,
        description,
        created_by: user.id,
        members,
      });

      navigate("/shared");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="create-group-page">

      {/* Back Button */}
      <div className="back-btn" onClick={() => navigate("/shared")}>
        ← Back to Shared Expenses
      </div>

      {/* Title */}
      <div className="create-title">
        <div className="title-icon">👥</div>
        <h1>Create Expense Group</h1>
      </div>

      {/* Form Card */}
      <div className="create-card">

        {/* Group Name */}
        <label>Group Name</label>
        <input
          placeholder="e.g., Weekend Trip"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Description */}
        <label>Description</label>
        <textarea
          placeholder="What's this group for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Add Members */}
        <label>Add Members</label>

        <div className="member-input-row">
          <input
            placeholder="Enter User ID or Email"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />

          <button className="add-member-btn" onClick={addMember}>
            + Add
          </button>
        </div>

        {/* Member Chips */}
        <div className="member-chips">
          {members.map((id) => (
            <span key={id} className="member-chip">
              {id}
            </span>
          ))}
        </div>

        {/* Create Button */}
        <button className="create-group-btn" onClick={createGroup}>
          Create Group
        </button>

      </div>

    </div>
  );
}

export default CreateGroup;