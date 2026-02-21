# FleetFlow - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone & Install

```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates:
- 3 users (admin, manager, dispatcher)
- 6 vehicles
- 5 drivers
- Sample trips, maintenance logs, and expenses

**Login Credentials:**
- Admin: `admin@fleetflow.io` / `fleet2024`
- Manager: `manager@fleetflow.io` / `fleet2024`
- Dispatcher: `dispatcher@fleetflow.io` / `fleet2024`

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## 📁 Project Structure

```
fleet-management/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── vehicleController.js  # Vehicle CRUD
│   │   ├── driverController.js   # Driver management
│   │   ├── tripController.js     # Trip dispatch logic
│   │   ├── maintenanceController.js
│   │   ├── expenseController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   └── auth.js               # JWT & RBAC middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   ├── Driver.js
│   │   ├── Trip.js
│   │   ├── Maintenance.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── maintenanceRoutes.js
│   │   ├── expenseRoutes.js
│   │   └── analyticsRoutes.js
│   ├── .env
│   ├── server.js
│   ├── seed.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Layout.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── TopBar.jsx
    │   │   ├── ui/
    │   │   │   ├── Modal.jsx
    │   │   │   ├── StatCard.jsx
    │   │   │   ├── StatusBadge.jsx
    │   │   │   └── DataTable.jsx
    │   │   └── charts/
    │   │       └── MiniChart.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── VehicleRegistry.jsx
    │   │   ├── DriverProfiles.jsx
    │   │   ├── TripDispatcher.jsx
    │   │   ├── Maintenance.jsx
    │   │   ├── ExpenseFuel.jsx
    │   │   └── Analytics.jsx
    │   ├── data/
    │   │   └── mockData.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/available` - Get available vehicles
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/available` - Get available drivers
- `GET /api/drivers/license-alerts` - Get license expiry alerts
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/:id` - Update driver
- `PUT /api/drivers/:id/status` - Update driver status
- `DELETE /api/drivers/:id` - Delete driver

### Trips
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create & dispatch trip
- `PUT /api/trips/:id/status` - Update trip status
- `DELETE /api/trips/:id` - Delete trip

### Maintenance
- `GET /api/maintenance` - Get all maintenance logs
- `GET /api/maintenance/summary` - Get summary
- `POST /api/maintenance` - Create maintenance log
- `PUT /api/maintenance/:id/complete` - Mark complete
- `DELETE /api/maintenance/:id` - Delete log

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/summary` - Get summary
- `GET /api/expenses/by-vehicle` - Group by vehicle
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Analytics
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/analytics` - Analytics data
- `GET /api/analytics/vehicle-roi` - Vehicle ROI

---

## 🔐 Authentication & Authorization

### Roles:
- `admin` - Full system access
- `fleet_manager` - Manage vehicles, drivers, maintenance
- `dispatcher` - Create trips, manage operations
- `safety_officer` - View driver compliance
- `financial_analyst` - View expenses and analytics

### Protected Routes:
Add `protect` middleware to routes:
```javascript
import { protect, authorize } from '../middleware/auth.js';

router.get('/admin-only', protect, authorize('admin'), controller);
```

### Frontend Auth:
Store JWT token in localStorage:
```javascript
localStorage.setItem('token', response.token);

// Add to API requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 🎯 Business Logic

### Trip Creation Workflow:
1. Select available vehicle
2. Select available driver (license valid)
3. Enter cargo weight (must be ≤ vehicle capacity)
4. Enter origin & destination
5. On dispatch:
   - Vehicle status → "On Trip"
   - Driver status → "On Duty"
   - Driver trips count +1

### Trip Completion:
1. Mark trip as "Completed"
2. Auto-updates:
   - Vehicle status → "Available"
   - Driver status → "Off Duty"
   - Driver completed count +1

### Maintenance Workflow:
1. Create maintenance log
2. Auto-updates:
   - Vehicle status → "In Shop"
   - Vehicle removed from dispatcher pool
3. On completion:
   - Vehicle status → "Available"
   - Vehicle returns to pool

---

## 🧪 Testing

### Test User Accounts:
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

### Test Scenarios:

**1. Create a Trip:**
- Login as dispatcher
- Go to Trip Dispatcher
- Click "New Trip"
- Select vehicle & driver
- Enter cargo (test validation: try exceeding capacity)
- Dispatch

**2. Maintenance Flow:**
- Go to Maintenance page
- Click "Log Service"
- Select vehicle
- Enter details
- Verify vehicle status changes to "In Shop"
- Mark complete
- Verify vehicle returns to "Available"

**3. Driver License Alert:**
- Go to Driver Profiles
- Check drivers with expiring licenses (within 30 days)
- Try assigning expired license driver to trip (should fail)

---

## 🐛 Troubleshooting

### Backend won't start:
```bash
# Check MongoDB connection
# Verify .env file exists
# Check port 5000 is not in use
```

### Frontend can't connect to backend:
```bash
# Verify backend is running on port 5000
# Check CORS settings in server.js
# Update API base URL in frontend if needed
```

### Database connection error:
```bash
# Verify MongoDB URI in .env
# Check network access in MongoDB Atlas
# Whitelist your IP address
```

---

## 📦 Deployment

### Backend (Heroku/Railway):
1. Set environment variables
2. Deploy from Git
3. Run seed script once

### Frontend (Vercel/Netlify):
1. Build: `npm run build`
2. Deploy `dist` folder
3. Update API base URL to production backend

---

## 🔄 Next Steps

### Connect Frontend to Backend:
1. Create API service file
2. Replace mockData with API calls
3. Add authentication flow
4. Handle loading & error states
5. Add token refresh logic

### Example API Service:
```javascript
// src/services/api.js
const API_BASE = 'http://localhost:5000/api';

export const api = {
  async getVehicles() {
    const res = await fetch(`${API_BASE}/vehicles`);
    return res.json();
  },
  
  async createTrip(data) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE}/trips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
```

---

## 📚 Additional Resources

- [API Documentation](./backend/API_DOCUMENTATION.md)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 💡 Tips

1. Use Postman/Thunder Client to test API endpoints
2. Check browser console for frontend errors
3. Monitor backend console for API logs
4. Use MongoDB Compass to view database
5. Keep both servers running during development

---

## 🤝 Support

For issues or questions:
1. Check API_DOCUMENTATION.md
2. Review console logs
3. Verify environment variables
4. Test with seed data first
