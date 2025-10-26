# How to Add Recurring Expenses

## Quick Start

### Method 1: Using Command Palette (Fastest)
1. Press **Cmd/Ctrl+K** to open the Command Palette
2. Type "Add Transaction" or press **A**
3. Fill in the form (see below)
4. Click "Add Transaction"

### Method 2: Using Navigation
1. Click the **Transactions** menu item
2. Click the **Add Transaction** button
3. Fill in the form
4. Click "Add Transaction"

---

## Form Fields Explained

### 1. **Type** (Required)
- **Expense** - Money going out (rent, groceries, utilities)
- **Revenue** - Money coming in (salary, freelance income)

### 2. **Category** (Required)
Choose from:
- Housing (rent, mortgage, property tax)
- Food (groceries, dining out)
- Transport (gas, car payment, public transit)
- Entertainment (movies, games, hobbies)
- Utilities (electricity, water, internet)
- Healthcare (medical, prescriptions, insurance)
- Other (miscellaneous)

### 3. **Description** (Required)
What is this expense for?
- Examples: "Monthly rent", "Netflix subscription", "Gym membership"

### 4. **Amount** (Required)
How much does it cost?
- Enter the amount in dollars (e.g., 1500.00)
- Use decimal format (cents are optional)

### 5. **Frequency** (Required)
How often does this occur?
- **One-time** - Single transaction (not recurring)
- **Daily** - Every day
- **Weekly** - Every 7 days
- **Bi-weekly** - Every 14 days
- **Monthly** - Every month (most common)
- **Quarterly** - Every 3 months
- **Annual** - Every year

### 6. **Start Date** (Required)
When does this transaction start?
- Click the date field to pick a date
- Default is today's date
- For past expenses, select the original date

### 7. **End Date** (Optional)
When does this transaction stop?
- Leave blank if it's ongoing
- Set a date if the expense will end (e.g., loan payoff date)
- Example: Gym membership ending in 6 months

### 8. **Notes** (Optional)
Additional details:
- Account number
- Reference number
- Special instructions
- Any other relevant info

---

## Example: Adding Monthly Rent

| Field | Value |
|-------|-------|
| Type | Expense |
| Category | Housing |
| Description | Monthly rent |
| Amount | 1500.00 |
| Frequency | Monthly |
| Start Date | 2024-10-24 |
| End Date | (leave blank) |
| Notes | Apartment 5B, due on 1st |

---

## Example: Adding Weekly Groceries

| Field | Value |
|-------|-------|
| Type | Expense |
| Category | Food |
| Description | Weekly groceries |
| Amount | 150.00 |
| Frequency | Weekly |
| Start Date | 2024-10-24 |
| End Date | (leave blank) |
| Notes | Whole Foods |

---

## Example: Adding Annual Car Insurance

| Field | Value |
|-------|-------|
| Type | Expense |
| Category | Transport |
| Description | Car insurance premium |
| Amount | 1200.00 |
| Frequency | Annual |
| Start Date | 2024-10-24 |
| End Date | (leave blank) |
| Notes | Policy #ABC123 |

---

## Example: Adding Monthly Salary (Revenue)

| Field | Value |
|-------|-------|
| Type | Revenue |
| Category | Other |
| Description | Monthly salary |
| Amount | 5000.00 |
| Frequency | Monthly |
| Start Date | 2024-10-24 |
| End Date | (leave blank) |
| Notes | Direct deposit |

---

## Tips & Tricks

### For Recurring Expenses
1. **Set the correct frequency** - This determines how often it appears in forecasts
2. **Use accurate amounts** - The system calculates monthly projections based on frequency
3. **Set start date** - Use the date the expense actually starts
4. **Optional end date** - Only set if the expense will definitely end

### For One-Time Expenses
1. Select **"One-time"** as frequency
2. Set the date it occurred
3. Leave end date blank
4. These won't appear in future forecasts

### Viewing Your Transactions
1. Go to **Transactions** page (press **T**)
2. See all your transactions in a table
3. Filter by category or date
4. Edit or delete transactions

### Viewing Forecasts
1. Go to **Dashboard** (press **D**)
2. See 6-month historical + 12-month forecast
3. Charts show revenue, expenses, and net income
4. Hover over bars to see exact values

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Cmd/Ctrl+K** | Open Command Palette |
| **A** | Add Transaction |
| **D** | Go to Dashboard |
| **T** | Go to Transactions |
| **B** | Go to Budgets |
| **R** | Go to Reports |
| **S** | Go to Settings |
| **I** | Import CSV |
| **?** | Show Help |

---

## Bulk Import (CSV)

If you have many transactions, use CSV import:

1. Press **Cmd/Ctrl+K** and select "Import CSV"
2. Format: `type, category, vendor, amount, frequency, startDate, endDate, description`
3. Example:
   ```
   expense, Housing, Landlord, 1500, monthly, 2024-10-24, , Monthly rent
   expense, Food, Whole Foods, 150, weekly, 2024-10-24, , Weekly groceries
   revenue, Other, Employer, 5000, monthly, 2024-10-24, , Monthly salary
   ```

---

## Frequency Calculation

The system calculates how many times a transaction occurs per month:

| Frequency | Per Month | Example |
|-----------|-----------|---------|
| Daily | ~30 | $10/day = $300/month |
| Weekly | ~4.3 | $100/week = $430/month |
| Bi-weekly | ~2.15 | $200/bi-weekly = $430/month |
| Monthly | 1 | $500/month = $500/month |
| Quarterly | 0.33 | $1500/quarter = $500/month |
| Annual | 0.083 | $6000/year = $500/month |

---

## Need Help?

- **Dashboard** - See all your finances at a glance
- **Transactions** - View, edit, delete individual transactions
- **Budgets** - Set spending limits by category
- **Reports** - Detailed P&L, cash flow, and category analysis
- **Settings** - Customize currency, language, theme

---

**Status:** ✅ Ready to use
**Last Updated:** 2025-10-24

