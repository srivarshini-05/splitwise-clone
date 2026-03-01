import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SharedExpenses from "./pages/SharedExpenses";
import GroupPage from "./pages/GroupPage";
import CreateGroup from "./pages/CreateGroup";
import AddExpense from "./pages/AddExpense";
import FinancialOverview from "./pages/FinancialOverview";
import RecentActivity from "./pages/RecentActivity";
import ExpenseAnalytics from "./pages/ExpenseAnalytics";
import BudgetTracker from "./pages/BudgetTracker";
import Intro from "./pages/SplashScreen";

function App() {

const [user, setUser] = useState(
JSON.parse(localStorage.getItem("user"))
);

return ( <BrowserRouter> <Routes>

```
    {/* Intro Page */}
    <Route path="/" element={<Intro />} />

    {/* Login */}
    <Route
      path="/login"
      element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />}
    />

    {/* Register */}
    <Route
      path="/register"
      element={user ? <Navigate to="/dashboard" /> : <Register />}
    />

    {/* Dashboard */}
    <Route
  path="/dashboard"
  element={user ? <Dashboard setUser={setUser} /> : <Navigate to="/login" />}
/>

    {/* Shared Expenses */}
    <Route
      path="/shared"
      element={user ? <SharedExpenses /> : <Navigate to="/login" />}
    />

    <Route
      path="/shared/create"
      element={user ? <CreateGroup /> : <Navigate to="/login" />}
    />

    <Route
      path="/group/:groupId"
      element={user ? <GroupPage /> : <Navigate to="/login" />}
    />

    <Route
      path="/group/:groupId/add-expense"
      element={user ? <AddExpense /> : <Navigate to="/login" />}
    />

    {/* Analytics */}
    <Route
      path="/analytics"
      element={user ? <ExpenseAnalytics /> : <Navigate to="/login" />}
    />

    {/* Budget */}
    <Route
      path="/budget"
      element={user ? <BudgetTracker /> : <Navigate to="/login" />}
    />

    {/* Transactions */}
    <Route
      path="/transactions"
      element={user ? <RecentActivity /> : <Navigate to="/login" />}
    />

    {/* Financial Overview */}
    <Route
      path="/overview"
      element={user ? <FinancialOverview /> : <Navigate to="/login" />}
    />

  </Routes>
</BrowserRouter>


);
}

export default App;
