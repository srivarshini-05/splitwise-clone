import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./recent.css";

function RecentActivity() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [income,setIncome] = useState("");
  const [incomeSource,setIncomeSource] = useState("");
  const [incomeDate,setIncomeDate] = useState("");

  const [expense,setExpense] = useState("");
  const [expenseTitle,setExpenseTitle] = useState("");
  const [expenseCategory,setExpenseCategory] = useState("");
  const [expenseDate,setExpenseDate] = useState("");

  const [transactions,setTransactions] = useState([]);

  useEffect(() => {

  const loadTransactions = async () => {

    try{
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/overview/transactions/${user.id}`
      );

      setTransactions(res.data);

    }catch(err){
      console.error(err);
    }

  };

  if(!user){
    navigate("/");
    return;
  }

  loadTransactions();

}, [navigate, user]);


  const fetchTransactions = async ()=>{
    try{
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/overview/transactions/${user.id}`
      );

      setTransactions(res.data);
    }
    catch(err){
      console.error(err);
    }
  };


  const handleAddIncome = async ()=>{

    if(!income) return;

    try{

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/overview/income`,
        {
          user_id:user.id,
          amount:income,
          source:incomeSource,
          date:incomeDate
        }
      );

      setIncome("");
      setIncomeSource("");
      setIncomeDate("");

      fetchTransactions();

    }
    catch(err){
      console.error(err);
    }
  };


  const handleAddExpense = async ()=>{

    if(!expense) return;

    try{

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/overview/personal-expense`,
        {
          user_id:user.id,
          amount:expense,
          title:expenseTitle,
          category:expenseCategory,
          date:expenseDate
        }
      );

      setExpense("");
      setExpenseTitle("");
      setExpenseCategory("");
      setExpenseDate("");

      fetchTransactions();

    }
    catch(err){
      console.error(err);
    }
  };


  return (

    <div className="recent-page">

      <div className="back-btn" onClick={()=>navigate("/dashboard")}>
        ← Back to Dashboard
      </div>


      <div className="page-header">
        <div className="header-icon">📈</div>
        <h1>Recent Activity</h1>
      </div>


      {/* INCOME CARD */}

      <div className="activity-card">

        <h3 className="income-title">
          + Add Income
        </h3>

        <div className="form-row">

          <input
            type="text"
            placeholder="Title"
            value={incomeSource}
            onChange={(e)=>setIncomeSource(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={income}
            onChange={(e)=>setIncome(e.target.value)}
          />

          <input
            type="date"
            value={incomeDate}
            onChange={(e)=>setIncomeDate(e.target.value)}
          />

        </div>

        <button
          className="income-btn"
          onClick={handleAddIncome}
        >
          Add Income
        </button>

      </div>



      {/* EXPENSE CARD */}

      <div className="activity-card">

        <h3 className="expense-title">
          + Add Personal Expense
        </h3>


        <div className="form-row">

          <input
            type="text"
            placeholder="Title"
            value={expenseTitle}
            onChange={(e)=>setExpenseTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Amount"
            value={expense}
            onChange={(e)=>setExpense(e.target.value)}
          />

        </div>


        <div className="form-row">

          <select
            value={expenseCategory}
            onChange={(e)=>setExpenseCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Shopping">Shopping</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>


          <input
            type="date"
            value={expenseDate}
            onChange={(e)=>setExpenseDate(e.target.value)}
          />

        </div>


        <button
          className="expense-btn"
          onClick={handleAddExpense}
        >
          Add Expense
        </button>

      </div>



      {/* TRANSACTION HISTORY */}

      <div className="activity-card">

        <h3>Transaction History</h3>


        {transactions.length === 0 ? (

          <p>No transactions yet</p>

        ) : (

          transactions.map((txn)=>{

            const isIncome = txn.type === "income";

            return(

              <div
                key={txn.id + txn.type}
                className="transaction-item"
              >

                <div className="txn-left">

                  <div className={`txn-icon ${isIncome ? "green" : "red"}`}>
                    {isIncome ? "↗" : "↘"}
                  </div>

                  <div>

                    <div className="txn-title">
                      {txn.title}
                    </div>

                    <div className="txn-date">
                      {new Date(txn.date).toLocaleDateString()}
                    </div>

                  </div>

                </div>


                <div
                  className={`txn-amount ${
                    isIncome ? "income" : "expense"
                  }`}
                >
                  {isIncome ? "+" : "-"}₹
                  {parseFloat(txn.amount).toLocaleString()}
                </div>

              </div>

            );

          })

        )}

      </div>


    </div>

  );

}

export default RecentActivity;