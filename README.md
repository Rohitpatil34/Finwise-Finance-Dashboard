# 💰 Finwise — Finance Dashboard

![React](https://img.shields.io/badge/React-18-blue)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38B2AC)
![Vite](https://img.shields.io/badge/Vite-fast-yellow)


A **modern, interactive finance dashboard** built using **React + Vite**, **Tailwind CSS**, and **Recharts** to help users track income, expenses, and financial insights visually.

---

## 🌐 Live Demo
👉 https://finwise-finance-dashboard-one.vercel.app

---

## 📸 Screenshots

Dashboard<img width="1912" height="906" alt="Screenshot 2026-04-03 154203" src="https://github.com/user-attachments/assets/76010969-3b0a-41db-a2c2-30581ce4034f" />

Transactions<img width="1911" height="908" alt="Screenshot 2026-04-03 154726" src="https://github.com/user-attachments/assets/34a42dd4-e1ef-429a-b4fb-5a7439388909" />

Insights<img width="1909" height="904" alt="image" src="https://github.com/user-attachments/assets/74461384-cbac-42a9-ab7d-6e3e6d380926" />


---

## ✨ Features

### 📊 Dashboard
- Summary cards (Balance, Income, Expenses) with animations  
- Balance trend visualization (Area Chart)  
- Monthly income vs expense comparison (Bar Chart)  
- Category-wise spending breakdown (Donut Chart)  

### 📁 Transactions
- Full transaction history  
- Search, filter (type, category, date range)  
- Sorting (date, amount, category)  

### 🔐 Role-Based Access
- **Admin** → Add, Edit, Delete transactions  
- **Viewer** → Read-only access  

### 📈 Insights
- Top spending category  
- Savings rate  
- Expense trends  
- Monthly comparison table  
- Category progress bars  

### ⚡ Enhancements
- 🌙 Dark Mode (persisted)  
- 💾 Local Storage support  
- 📤 Export as CSV / JSON  
- ✨ Smooth animations & transitions  
---

## 🧠 State Management

All application state lives in `AppContext` (React Context API):

| State | Description |
|---|---|
| `transactions` | Source of truth, persisted to localStorage |
| `filteredTransactions` | Derived: filtered + sorted view |
| `filters` | Search, type, category, date range |
| `sortConfig` | Active sort key + direction |
| `role` | `"admin"` or `"viewer"` |
| `darkMode` | Boolean, synced to `<html>` class |

---

## 🎭 Role-Based UI

| Feature | Viewer | Admin |
|---|---|---|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| View insights | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |

Switch roles using the dropdown at the bottom of the sidebar.

---

## 📊 Mock Data

58 pre-loaded transactions across Jan–Apr 2025 covering categories:
Food & Dining, Transport, Shopping, Entertainment, Utilities, Healthcare, Education, Travel, Investments, Salary, Freelance, Rent.

Use the **Reset to sample data** link in the sidebar to restore defaults at any time.

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| React 18 + Vite | Framework + bundler |
| Tailwind CSS v3 | Styling |
| Recharts | Charts (AreaChart, BarChart, PieChart) |
| Lucide React | Icons |
| React Context API | State management |
| localStorage | Persistence |
| DM Sans / DM Serif Display / DM Mono | Typography |

---

## 📝 Assumptions

- All amounts are in Indian Rupees (₹)
- No backend — all data is client-side with localStorage persistence
- Role switching is frontend-only for demonstration purposes
- Date range filter uses ISO date strings for reliable comparison
#
---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn

### Installation

```bash
git clone https://github.com/your-username/finwise-finance-dashboard.git
cd finwise-finance-dashboard
npm install
npm run dev
