# FleetFlow: Modular Fleet & Logistics Management System

<div align="center">

**A comprehensive, rule-based digital hub for managing delivery fleets, monitoring driver safety, and tracking financial performance.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>
<img width="1600" height="857" alt="image" src="https://github.com/user-attachments/assets/7ecaa318-adff-4afc-a203-7c7039178a1e" />
<img width="1600" height="856" alt="image" src="https://github.com/user-attachments/assets/d9b9b4c9-6492-4ab6-af39-94926ced3915" />
<img width="1600" height="859" alt="image" src="https://github.com/user-attachments/assets/26ced0ed-2152-4e04-b065-74f29d51c10b" />
<img width="1600" height="862" alt="image" src="https://github.com/user-attachments/assets/122b5e80-fe7f-4baa-b78d-a77cbc382838" />
<img width="1600" height="860" alt="image" src="https://github.com/user-attachments/assets/04a2df26-83d3-448b-b169-3c77a29e5cbc" />

---

## 🎯 Overview

FleetFlow replaces inefficient manual logbooks with a centralized digital platform that optimizes the entire lifecycle of a delivery fleet. Built for the Odoo 2026 Hackathon, it provides real-time fleet oversight, automated status management, and data-driven decision making.

### Key Features

- **🚛 Vehicle Registry** - Complete asset lifecycle management with CRUD operations
- **👨‍✈️ Driver Profiles** - Compliance tracking, license expiry alerts, and safety scores
- **📦 Trip Dispatcher** - Smart assignment with cargo validation and real-time status updates
- **🔧 Maintenance Logs** - Preventative care tracking with automatic vehicle status management
- **💰 Expense Tracking** - Fuel logging, cost analysis, and ROI calculations
- **📊 Analytics Dashboard** - Real-time KPIs, utilization rates, and financial reports
- **🔐 Role-Based Access** - Secure authentication with granular permissions

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 + Vite
- React Router DOM v7
- Tailwind CSS
- Recharts (Analytics)
- Lucide Icons

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (Password hashing)

**Development:**
- Nodemon (Hot reload)
- CORS enabled
- RESTful API design

---

## 📁 Project Structure

```
fleet-management/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Authentication & user management
│   │   ├── vehicleController.js     # Vehicle CRUD + business logic
│   │   ├── driverController.js      # Driver management + compliance
│   │   ├── tripController.js        # Trip dispatch + validation
│   │   ├── maintenanceController.js # Service logs + auto-status
│   │   ├── expenseController.js     # Fuel tracking + analytics
│   │   └── analyticsController.js   # Dashboard stats + ROI
│   ├── middleware/
│   │   └── auth.js                  # JWT verification + RBAC
│   ├── models/
│   │   ├── User.js                  # User schema with roles
│   │   ├── Vehicle.js               # Vehicle schema
│   │   ├── Driver.js                # Driver schema with license validation
│   │   ├── Trip.js                  # Trip schema with references
│   │   ├── Maintenance.js           # Maintenance log schema
│   │   └── Expense.js               # Expense schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── maintenanceRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── analyticsRoutes.js
│   ├── .env                         # Environment variables
│   ├── server.js                    # Express app entry point
│   ├── seed.js                      # Database seeding script
│   ├── package.json
│   └── API_DOCUMENTATION.md         # Complete API reference
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx       # Main layout wrapper
│   │   │   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   │   │   └── TopBar.jsx       # Header with user info
│   │   │   ├── ui/
│   │   │   │   ├── Modal.jsx        # Reusable modal component
│   │   │   │   ├── StatCard.jsx     # Dashboard stat cards
│   │   │   │   ├── StatusBadge.jsx  # Status indicators
│   │   │   │   └── DataTable.jsx    # Data table component
│   │   │   └── charts/
│   │   │       └── MiniChart.jsx    # Chart components
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Authentication page
│   │   │   ├── Dashboard.jsx        # Command center
│   │   │   ├── VehicleRegistry.jsx  # Vehicle management
│   │   │   ├── DriverProfiles.jsx   # Driver management
│   │   │   ├── TripDispatcher.jsx   # Trip creation & dispatch
│   │   │   ├── Maintenance.jsx      # Service logs
│   │   │   ├── ExpenseFuel.jsx      # Expense tracking
│   │   │   └── Analytics.jsx        # Reports & analytics
│   │   ├── data/
│   │   │   └── mockData.js          # Sample data (to be replaced with API)
│   │   ├── App.jsx                  # Root component with routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles + Tailwind
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── SETUP_GUIDE.md                   # Detailed setup instructions
├── fleet.pdf                        # Problem statement
└── README.md                        # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd fleet-management
```

2. **Backend Setup:**
```bash
cd backend
npm install

# Create .env file
echo "PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
NODE_ENV=development" > .env
```

3. **Frontend Setup:**
```bash
cd ../frontend
npm install
```

4. **Seed Database:**
```bash
cd backend
npm run seed
```

This creates:
- 3 users (admin, manager, dispatcher)
- 6 vehicles (trucks, vans, bikes)
- 5 drivers with various statuses
- Sample trips, maintenance logs, and expenses

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Login Credentials

```
Admin:
  Email: admin@fleetflow.io
  Password: fleet2024

Manager:
  Email: manager@fleetflow.io
  Password: fleet2024

Dispatcher:
  Email: dispatcher@fleetflow.io
  Password: fleet2024
```

---

## 🎮 Core Features & Workflows

### 1. Vehicle Registry (Asset Management)
- **CRUD Operations:** Create, read, update, delete vehicles
- **Filtering:** By type (Truck/Van/Bike), status, search
- **Data Points:** Name, license plate, capacity, odometer, fuel type
- **Status Management:** Available, On Trip, In Shop, Retired

### 2. Driver Profiles (Compliance & Safety)
- **License Tracking:** Expiry dates with 30-day alerts
- **Safety Scores:** Performance metrics and trip completion rates
- **Status Management:** On Duty, Off Duty, Suspended
- **Compliance:** Automatic blocking of expired licenses

### 3. Trip Dispatcher (Smart Assignment)
- **Validation Rules:**
  - Vehicle must be "Available"
  - Driver must be "Off Duty" with valid license
  - Cargo weight ≤ Vehicle capacity
- **Auto-Updates:**
  - Vehicle → "On Trip"
  - Driver → "On Duty"
- **Lifecycle:** Draft → Dispatched → Completed → Cancelled

### 4. Maintenance & Service Logs
- **Preventative Tracking:** Schedule and log all maintenance
- **Auto-Status Management:**
  - Creating log → Vehicle to "In Shop"
  - Completing log → Vehicle to "Available"
- **Cost Tracking:** Total operational costs per vehicle

### 5. Expense & Fuel Logging
- **Per-Trip Tracking:** Distance, liters, cost
- **Calculations:** Fuel efficiency (km/L), cost per vehicle
- **Analytics:** Total operational costs, vehicle comparisons

### 6. Analytics & Reports
- **Dashboard KPIs:**
  - Active fleet count
  - Utilization rate
  - Maintenance alerts
  - Pending cargo
- **Financial Metrics:**
  - Revenue vs. operational costs
  - Vehicle ROI calculations
  - Fuel efficiency trends
- **Exports:** CSV/PDF reports (planned)

---

## 🔐 Authentication & Authorization

### User Roles

| Role | Permissions |
|------|------------|
| **Admin** | Full system access, user management |
| **Fleet Manager** | Vehicles, drivers, maintenance oversight |
| **Dispatcher** | Trip creation, cargo assignment |
| **Safety Officer** | Driver compliance, safety monitoring |
| **Financial Analyst** | Expenses, analytics, reports |

### Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Protected API routes
- Token expiration (7 days)

---

## 📊 Business Logic

### Trip Creation Workflow

```
1. User selects available vehicle
2. User selects available driver
3. System validates:
   ✓ Vehicle status = "Available"
   ✓ Driver status = "Off Duty"
   ✓ Driver license not expired
   ✓ Cargo weight ≤ Vehicle capacity
4. On success:
   → Create trip record
   → Vehicle status = "On Trip"
   → Driver status = "On Duty"
   → Driver trips count +1
```

### Maintenance Workflow

```
1. User creates maintenance log
2. System auto-updates:
   → Vehicle status = "In Shop"
   → Vehicle removed from dispatcher pool
3. On completion:
   → Vehicle status = "Available"
   → Vehicle returns to pool
```

### Driver License Validation

```
- Check expiry date on every trip assignment
- Block assignment if expired
- Show warning if expiring within 30 days
- Display alerts on Driver Profiles page
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup          Register new user
POST   /api/auth/login           Login user
GET    /api/auth/me              Get current user (protected)
```

### Vehicles
```
GET    /api/vehicles             Get all vehicles (with filters)
GET    /api/vehicles/available   Get available vehicles
GET    /api/vehicles/:id         Get single vehicle
POST   /api/vehicles             Create vehicle
PUT    /api/vehicles/:id         Update vehicle
DELETE /api/vehicles/:id         Delete vehicle
```

### Drivers
```
GET    /api/drivers              Get all drivers (with filters)
GET    /api/drivers/available    Get available drivers
GET    /api/drivers/license-alerts  Get license expiry alerts
GET    /api/drivers/:id          Get single driver
POST   /api/drivers              Create driver
PUT    /api/drivers/:id          Update driver
PUT    /api/drivers/:id/status   Update driver status
DELETE /api/drivers/:id          Delete driver
```

### Trips
```
GET    /api/trips                Get all trips (with filters)
GET    /api/trips/:id            Get single trip
POST   /api/trips                Create & dispatch trip
PUT    /api/trips/:id/status     Update trip status
DELETE /api/trips/:id            Delete trip
```

### Maintenance
```
GET    /api/maintenance          Get all logs
GET    /api/maintenance/summary  Get summary stats
POST   /api/maintenance          Create log
PUT    /api/maintenance/:id/complete  Mark complete
DELETE /api/maintenance/:id      Delete log
```

### Expenses
```
GET    /api/expenses             Get all expenses
GET    /api/expenses/summary     Get summary stats
GET    /api/expenses/by-vehicle  Group by vehicle
POST   /api/expenses             Create expense
PUT    /api/expenses/:id         Update expense
DELETE /api/expenses/:id         Delete expense
```

### Analytics
```
GET    /api/analytics/dashboard  Dashboard stats
GET    /api/analytics            Analytics data
GET    /api/analytics/vehicle-roi  Vehicle ROI
```

**📖 Full API Documentation:** [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

---

## 🧪 Testing

### Manual Testing Scenarios

1. **Trip Creation with Validation:**
   - Try assigning trip with cargo > vehicle capacity (should fail)
   - Try assigning driver with expired license (should fail)
   - Try assigning vehicle that's "In Shop" (should fail)
   - Valid trip creation (should succeed and update statuses)

2. **Maintenance Flow:**
   - Create maintenance log
   - Verify vehicle status changes to "In Shop"
   - Verify vehicle disappears from dispatcher pool
   - Mark maintenance complete
   - Verify vehicle returns to "Available"

3. **Driver License Alerts:**
   - Check drivers with licenses expiring within 30 days
   - Verify warning indicators
   - Try assigning expired license driver (should fail)

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup and deployment guide
- **[API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)** - Complete API reference
- **[fleet.pdf](./fleet.pdf)** - Original problem statement

---

## 🛠️ Development

### Available Scripts

**Backend:**
```bash
npm run dev      # Start with nodemon (hot reload)
npm start        # Start production server
npm run seed     # Seed database with sample data
```

**Frontend:**
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Environment Variables

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fleetflow
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

---

## 🚧 Roadmap

### Phase 1: Core Features ✅
- [x] Complete backend API
- [x] All models with business logic
- [x] Authentication & authorization
- [x] Database seeding
- [x] Frontend UI (mock data)

### Phase 2: Integration (Next Steps)
- [ ] Connect frontend to backend API
- [ ] Replace mock data with real API calls
- [ ] Add loading states and error handling
- [ ] Implement token refresh
- [ ] Add form validation

### Phase 3: Advanced Features
- [ ] Real-time updates (WebSockets)
- [ ] File uploads (vehicle documents)
- [ ] Email notifications (license expiry)
- [ ] Advanced analytics (predictive maintenance)
- [ ] Mobile responsive optimization
- [ ] PDF/CSV export functionality

### Phase 4: Production
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Deployment (Heroku/Vercel)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built for the **Odoo 2026 Hackathon**

---

## 🙏 Acknowledgments

- Problem statement provided by Odoo Hackathon 2026
- UI inspiration from modern fleet management systems
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

---

## 📞 Support

For issues, questions, or suggestions:

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Review [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)
3. Open an issue on GitHub
4. Contact the development team

---

<div align="center">

**Built with ❤️ for efficient fleet management**

[Documentation](./SETUP_GUIDE.md) • [API Reference](./backend/API_DOCUMENTATION.md) • [Report Bug](https://github.com/yourusername/fleetflow/issues)

</div>
