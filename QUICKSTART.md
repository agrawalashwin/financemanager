# Quick Start Guide

## 1. Set Up Cloud SQL Database

```bash
# Create a Cloud SQL PostgreSQL instance in GCP
# Then connect and run:
psql -h <YOUR_CLOUD_SQL_IP> -U postgres -d financialmanager < backend/schema.sql
```

## 2. Configure Backend

```bash
cd backend

# Edit .env with your Cloud SQL credentials:
# PORT=5000
# DB_USER=postgres
# DB_PASSWORD=your_password
# DB_HOST=your_cloud_sql_ip
# DB_PORT=5432
# DB_NAME=financialmanager

# Start backend
npm start
```

Backend will be available at: `http://localhost:5000`

## 3. Start Frontend

```bash
cd frontend

# Start dev server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 4. Use the App

1. **Dashboard Tab**: View your financial overview with charts
2. **Add Transaction Tab**: Add recurring expenses or revenue
3. **All Transactions Tab**: View and manage all transactions

## Example Transactions to Add

### Personal Expenses
- Rent: $1,500/month
- Utilities: $150/month
- Groceries: $400/month

### Business Revenue
- Salary: $5,000/month
- Consulting: $2,000/month

### Investment
- Stock Dividends: $100/quarter
- Property Income: $800/month

## Troubleshooting

### Backend won't connect to database
- Check Cloud SQL IP address in .env
- Verify firewall rules allow your IP
- Ensure database `financialmanager` exists

### Frontend can't reach backend
- Ensure backend is running on port 5000
- Check CORS is enabled (it is by default)
- Verify API_URL in components matches backend URL

### No data showing in dashboard
- Add at least one transaction first
- Check browser console for errors
- Verify userId matches in requests

## Next Steps

- Add authentication (Firebase, Auth0, etc.)
- Deploy to Google Cloud Run
- Add more visualization options
- Implement budget tracking
- Add expense categories and tags

