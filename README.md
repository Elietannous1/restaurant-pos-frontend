# 🏪 Restaurant POS Dashboard & Management

A full-stack Restaurant Point-Of-Sale (POS) system with React frontend and Spring Boot backend.  
Manage categories, products, and orders, track sales with an interactive dashboard, and support account-recovery flows secured by JWT.

---

## 📑 Table of Contents

- [🚀 Features](#🚀-features)  
- [🛠️ Tech Stack](#🛠️-tech-stack)  
- [⚙️ Getting Started](#⚙️-getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Backend Setup](#backend-setup)  
  - [Frontend Setup](#frontend-setup)  
- [🔧 Configuration](#🔧-configuration)  
- [🗂️ Project Structure](#🗂️-project-structure)  
- [📋 API Endpoints](#📋-api-endpoints)  
- [🎨 Styling & Layout](#🎨-styling--layout)  
- [🔐 Authentication & Token Handling](#🔐-authentication--token-handling)  
- [🤝 Contributing](#🤝-contributing)  

---

## 🚀 Features

- **Category Management**  
  - View, create, delete categories  
- **Product Management**  
  - View, create, update, delete products  
  - Associate products with categories  
- **Order Management**  
  - Fetch and display all orders (pending/complete)  
  - Inspect line-items per order  
  - Update order status (PENDING → PREPARING → READY → COMPLETED → CANCELLED)  
- **Dashboard & Reports**  
  - Bar chart of top-selling items (daily/weekly/monthly/yearly)  
  - Line chart of total sales over time  
  - Sales metrics cards: today’s sales & last 30-day total  
- **Account Recovery**  
  - “Forgot Password” flow with three steps in one page:  
    1. Request recovery email  
    2. Verify 6-digit code  
    3. Reset password  
- **Responsive Sidebar**  
  - Collapse/expand with icons-only mode  
- **JWT-Secured API**  
  - Axios interceptor auto-attaches token  
  - On 401/403 clears token & redirects to login  

---

## 🛠️ Tech Stack

- **Frontend**: React, React Router, React-Bootstrap, Chart.js, react-icons  
- **State & Context**: React Hooks, Context API for sidebar  
- **HTTP**: Axios with request/response interceptors  
- **Backend**: Spring Boot (Java), Spring Security (JWT), Spring Data JPA  
- **Database**: MySQL 
- **Build / Tooling**: Maven, Vite / Create-React-App  

---

## ⚙️ Getting Started

### Prerequisites

- **Java 17+**  
- **Node.js ≥ 16** & **npm / yarn**  
- **Maven** (for backend)  

### Backend Setup

1. `cd backend/`  
2. Configure your datasource in `application.properties` (H2 is default).  
3. Generate JWT signing key & set in `application.properties`.  
4. Run:
   ```bash
   mvn clean spring-boot:run
API runs at http://localhost:8080.

Frontend Setup
cd frontend/

 .env.example → .env and set:


REACT_APP_API_BASE_URL=http://localhost:8080
Install & start:

npm install
npm start
Browse to http://localhost:3000.

🔧 Configuration

Variable	Description
API_BASE_URL (or REACT_APP_…)	Backend root URL
JWT_SECRET	Your JWT secret (backend)
spring.datasource.*	JDBC URL / credentials (backend)
🗂️ Project Structure
root
├─ backend/           # Spring Boot app
│  ├─ src/main/java/
│  │  ├─ controller/       # REST endpoints
│  │  ├─ service/          # Business logic
│  │  ├─ repository/       # JPA interfaces
│  │  └─ model/            # Entities & DTOs
│  └─ src/main/resources/
│     └─ application.properties
└─ frontend/          # React app
   ├─ src/
   │  ├─ components/
   │  │  ├─ Sidebar.jsx
   │  │  ├─ ChartComponents/
   │  │  └─ RecoveryComponents/
   │  ├─ context/           # SidebarContext
   │  ├─ pages/             # ViewOrders, ProductsManagement, CategoryManagement, Dashboard, AccountRecovery…
   │  ├─ services/          # *ApiRequest files wrapping Axios calls
   │  ├─ utils/             # storage.ts for token
   │  ├─ styles/
   │  └─ App.jsx / index.js
📋 API Endpoints

Method	Path	Description
POST	/login, /register	Auth
GET	/category	List categories
POST	/category/create, /category/delete	Create / delete category
GET	/product	List products
POST	/product/create, /product/update	Create / update product
POST	/product/remove	Delete product
GET	/order	List all orders
POST	/order/create	Create new order
PUT	/order/update/status	Change order status
GET	/sales/top-selling	Bar chart data
GET	/sales/over-time	Line chart data
GET	/order/income	Income metric (date + period)
POST	/account/recover, /account/verify	Recovery flow
POST	/account/reset	Reset password
🎨 Styling & Layout
Bootstrap 5 for grids, forms, and cards.

Custom CSS for sidebar collapse/expand, charts container, and Recovery “wizard.”

Chart.js (via react-chartjs-2) for bar & line charts.

🔐 Authentication & Token Handling
On login, JWT saved to localStorage.

Axios interceptor automatically:

Attaches Authorization: Bearer <token> to every request (except login/register).

On 401/403 response → clears token, redirects user to login.

🤝 Contributing
Fork & star this repo ⭐

Create a branch (git checkout -b feature/YourFeature)

Commit changes (git commit -m "feat: add awesome feature")

Push (git push origin feature/YourFeature)

Open a Pull Request
