# Personal P&L Dashboard - Setup Guide

## Project Structure

```
financialmanager/
├── frontend/          # React + Vite + Material-UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      # Main dashboard with D3 chart
│   │   │   ├── TransactionForm.jsx # Form to add transactions
│   │   │   └── TransactionList.jsx # Table view of all transactions
│   │   └── App.jsx
│   └── package.json
├── backend/           # Node.js + Express
│   ├── src/
│   │   └── server.js  # Express API server
│   ├── schema.sql     # Database schema
│   ├── .env           # Environment variables
│   └── package.json
└── SETUP.md
```

## Prerequisites

- Node.js (v16+)
- PostgreSQL or Cloud SQL instance
- GCP account with Cloud SQL access

## Setup Instructions

### 1. Database Setup (Cloud SQL)

Create a Cloud SQL PostgreSQL instance and run the schema:

```bash
# Connect to your Cloud SQL instance
psql -h <CLOUD_SQL_IP> -U postgres -d financialmanager < backend/schema.sql
```

Or use the Cloud SQL console to run the SQL commands in `backend/schema.sql`.

### 2. Backend Setup

```bash
cd backend

# Update .env with your Cloud SQL credentials
# DB_HOST: Your Cloud SQL public IP or private IP
# DB_USER: postgres (or your user)
# DB_PASSWORD: Your password
# DB_NAME: financialmanager

# Install dependencies (already done)
npm install

# Start the backend server
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies (already done)
npm install

# Start the development server
npm run dev
# App runs on http://localhost:5173
```

## Features

### Dashboard Tab
- **Summary Cards**: Shows total revenue, expenses, net income, and transaction count
- **D3.js Chart**: Beautiful monthly timeline showing:
  - Green bars for revenue
  - Red bars for expenses
  - Blue line for net income
  - Interactive legend

### Add Transaction Tab
- Simple form to add recurring expenses or revenue
- Fields:
  - Type: Expense or Revenue
  - Category: Personal, Business, or Investment
  - Vendor/Source: Name of vendor or income source
  - Amount: Dollar amount
  - Frequency: Daily, Weekly, Bi-weekly, Monthly, Quarterly, Annual
  - Start Date: When the transaction starts
  - End Date: Optional end date
  - Description: Optional notes
  - Subcategory: Optional subcategory

### All Transactions Tab
- Table view of all transactions
- Color-coded by type and category
- Delete functionality
- Sortable columns

## API Endpoints

### GET /api/transactions
Get all transactions for a user
- Query: `userId` (required)

### POST /api/transactions
Create a new transaction
- Body: Transaction object

### PUT /api/transactions/:id
Update a transaction
- Params: `id` (transaction ID)
- Body: Updated transaction object

### DELETE /api/transactions/:id
Delete a transaction
- Params: `id` (transaction ID)

### GET /api/summary
Get summary data grouped by type and category
- Query: `userId` (required)

## Database Schema

```sql
transactions
├── id (UUID, Primary Key)
├── user_id (VARCHAR)
├── type (expense | revenue)
├── category (personal | business | investment)
├── subcategory (VARCHAR)
├── vendor (VARCHAR)
├── amount (DECIMAL)
├── frequency (daily | weekly | biweekly | monthly | quarterly | annual)
├── start_date (DATE)
├── end_date (DATE, nullable)
├── description (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Deployment to Google Cloud Run

### Backend Deployment

1. Create a Dockerfile in the backend directory
2. Build and push to Container Registry
3. Deploy to Cloud Run with Cloud SQL connection

### Frontend Deployment

1. Build the frontend: `npm run build`
2. Deploy to Cloud Storage + Cloud CDN or Cloud Run

## Notes

- Currently uses a hardcoded `userId: 'user-1'` for demo purposes
- In production, integrate with Firebase Auth or similar
- The D3 chart groups transactions by month
- All amounts are stored as DECIMAL(12, 2) for precision

