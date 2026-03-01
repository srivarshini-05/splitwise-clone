import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./GroupPage.css";

function GroupPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [balances, setBalances] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [paidSettlements, setPaidSettlements] = useState([]);
  const [totalGroupExpense, setTotalGroupExpense] = useState(0);

  
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    loadData();
  }, [groupId]);

  const loadData = async () => {
    await Promise.all([
      fetchGroupDetails(),
      fetchBalances(),
      fetchTransactions(),
      fetchSettlements(),
      fetchPaidSettlements(),
    ]);
  };

  const fetchGroupDetails = async () => {
    const response = await axios.get(
      `http://splitwise-clone-production.up.railway.app/api/groups/${groupId}`
    );
    setGroup(response.data.group);
    setMembers(response.data.members);
  };

  const fetchBalances = async () => {
    const response = await axios.get(
      `http://splitwise-clone-production.up.railway.app/api/groups/${groupId}/balances/${user.id}`
    );
    setBalances(response.data);
  };

  const fetchTransactions = async () => {
    const response = await axios.get(
      `http://splitwise-clone-production.up.railway.app/api/groups/${groupId}/transactions`
    );

    setTransactions(response.data);

    const total = response.data.reduce(
      (sum, txn) => sum + parseFloat(txn.total_amount),
      0
    );

    setTotalGroupExpense(total);
  };

  const fetchSettlements = async () => {
    const response = await axios.get(
      `http://splitwise-clone-production.up.railway.app/api/groups/${groupId}/settlements`
    );

    setSettlements(response.data);
  };

  const fetchPaidSettlements = async () => {
    const response = await axios.get(
      `http://splitwise-clone-production.up.railway.app/api/groups/${groupId}/paid-settlements`
    );

    setPaidSettlements(response.data);
  };

  const handleMarkPaid = async (settlement) => {
    await axios.post(
      `http://splitwise-clone-production.up.railway.app/api/groups/${groupId}/settle`,
      {
        from_user: settlement.from_id,
        to_user: settlement.to_id,
        amount: settlement.amount,
      }
    );

    loadData();
  };

  if (!group) return <h3>Loading...</h3>;

  return (
    <div className="group-page">

      <div
        className="back-button"
        onClick={() => navigate("/shared")}
      >
        ← Back to Shared Expenses
      </div>

      <div className="group-header">

        <div>
          <h1 className="group-title">{group.name}</h1>
          <p className="group-desc">{group.description}</p>
        </div>

        <button
          className="add-expense-btn"
          onClick={() => navigate(`/group/${groupId}/add-expense`)}
        >
          + Add Expense
        </button>

      </div>

      {/* MEMBERS */}

      <div className="card">

        <h3>Members:</h3>

        <div className="member-container">
          {members.map((m) => (
            <span key={m.id} className="member-pill">
              {m.name} {m.id === user.id && "(You)"}
            </span>
          ))}
        </div>

      </div>

      {/* SUMMARY */}

      {balances && (

        <div className="summary-grid">

          <div className="summary-card">
            <h4>Total Group Expenses</h4>
            <h2>₹{totalGroupExpense.toFixed(2)}</h2>
          </div>

          <div className="summary-card red">
            <h4>You Owe</h4>
            <h2>₹{balances.you_owe.toFixed(2)}</h2>
          </div>

          <div className="summary-card green">
            <h4>You Are Owed</h4>
            <h2>₹{balances.you_are_owed.toFixed(2)}</h2>
          </div>

        </div>
      )}

      {/* SETTLE UP */}

      <div className="card">

        <h3>Settle Up</h3>

        {settlements.length === 0 ? (
          <p>All settled!</p>
        ) : (
          settlements.map((s, index) => {

            const isCurrentUserDebtor = s.from_id === user.id;
            const isCurrentUserCreditor = s.to_id === user.id;

            const isPaid = paidSettlements.some(
              (p) =>
                p.from_user === s.from_id &&
                p.to_user === s.to_id &&
                parseFloat(p.amount) === parseFloat(s.amount)
            );

            return (
              <div
                key={index}
                className={`settle-item ${isPaid ? "paid" : ""}`}
              >

                <p
                  className={`settle-text ${
                    isCurrentUserDebtor ? "red-text" : "green-text"
                  }`}
                >

                  {isCurrentUserDebtor
                    ? `You should pay ${s.to} ₹${Number(
                        s.amount
                      ).toFixed(2)}`
                    : isCurrentUserCreditor
                    ? `${s.from} should pay you ₹${Number(
                        s.amount
                      ).toFixed(2)}`
                    : `${s.from} should pay ${s.to} ₹${Number(
                        s.amount
                      ).toFixed(2)}`}

                </p>

                {isCurrentUserDebtor && !isPaid && (
                  <button
                    className="pay-btn"
                    onClick={() => handleMarkPaid(s)}
                  >
                    Mark as Paid
                  </button>
                )}

                {isPaid && <span className="paid-badge">Paid</span>}

              </div>
            );
          })
        )}

      </div>

      {/* TRANSACTIONS */}

      <div className="card">

        <h3>Group Transactions</h3>

        {transactions.length === 0 ? (
          <p>No expenses yet</p>
        ) : (
          transactions.map((txn) => (
            <div key={txn.id} className="transaction-card">

              <div>
                <h4>{txn.title}</h4>
                <p>Total: ₹{parseFloat(txn.total_amount).toFixed(2)}</p>
                <p>Paid by: {txn.paid_by_name}</p>
              </div>

              <div className="per-person">
                <p>Per Person</p>
                <strong>
                  ₹{parseFloat(txn.per_person).toFixed(2)}
                </strong>
              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default GroupPage;