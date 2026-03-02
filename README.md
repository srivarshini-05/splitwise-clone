🚀 **Splitwise Clone – Full Stack Expense Management System**

A production-deployed full-stack expense management web application inspired by Splitwise.

Built with modern cloud infrastructure, relational database design, and real-world financial logic.

🔗 **Live Demo**
https://splitwise-clone-six.vercel.app

📌 **Overview**

This application allows users to:

Track income and personal expenses

Monitor net savings

Set and manage monthly budgets

Analyze spending patterns

Create shared expense groups

Split expenses equally among members

Optimize settlement transactions

Mark settlements as paid with real-time balance recalculation

The system simulates real-world fintech workflows with proper database normalization and cloud deployment architecture.

🏗 **Architecture**
User
 ↓
Frontend (React - Vercel)
 ↓
Backend API (Node/Express - Render)
 ↓
Cloud Database (Railway MySQL)

**Deployment Infrastructure**

Layer	Platform
Frontend	Vercel
Backend	Render
Database	Railway MySQL

🛠 **Tech Stack**
**Frontend**

React.js

React Router

Axios

Chart.js (Bar & Pie Charts)

Responsive UI Design

**Backend**

Node.js

Express.js

REST API Architecture

MySQL

Transaction-based queries

**Database**

Railway MySQL (Cloud Hosted)

Relational schema design

Foreign key constraints

Optimized balance queries

**Deployment**

Vercel (Frontend Hosting)

Render (Backend Hosting)

Railway (Cloud Database)

🔥 **Core Features**
1️⃣ Authentication

User Register & Login

LocalStorage session handling

Protected routes

2️⃣ Financial Overview

Dashboard shows:

Total Income

Total Expenses

Net Savings

Savings Rate

Visual financial analytics

3️⃣ Recent Activity

Users can:

Add Income

Add Personal Expenses

View Transaction History

Track categorized entries

4️⃣ Budget Tracker

Set monthly budgets

Track spending vs target

Visual progress indicators

5️⃣ Shared Expense Management

Users can:

Create groups

Add members using User ID

Add shared expenses

Automatically split expenses equally

View group transaction history

6️⃣ Optimized Settlement Logic

The system:

Calculates net balances per member

Minimizes number of transactions

Shows:

You owe
You are owed

Allows mark-as-paid settlements

Performs real-time balance recalculation

🧠 **Interesting Implementation Details**

Implemented a greedy settlement optimization algorithm to minimize transactions between group members.

Used LEFT JOIN aggregation queries to compute dynamic balances.

Migrated database from local MySQL → Railway Cloud MySQL.

Designed backend APIs to support scalable REST endpoints.

🗄 **Database Design**
Main Tables

users

incomes

personal_expenses

user_groups

group_members

expenses

expense_splits

settlements

All tables are normalized and linked with foreign key constraints.

📈 **Future Improvements**

JWT based authentication

Password hashing using bcrypt

Category-based analytics

Monthly expense filtering

Dark mode

Notifications for pending settlements

⭐ If you found this project helpful, consider starring the repository!
