# FleetFlow - Quick Start Guide 🚀

## 🎉 Your Application is LIVE!

Both frontend and backend are running and connected to MongoDB with dummy data.

## 🌐 Access URLs

### Frontend Application
**URL:** http://localhost:5174

### Backend API
**URL:** http://localhost:5000

## 🔐 Login Credentials

Use any of these accounts to login:

```
👤 Admin Account
Email: admin@fleetflow.io
Password: fleet2024

👤 Fleet Manager
Email: manager@fleetflow.io
Password: fleet2024

👤 Dispatcher
Email: dispatcher@fleetflow.io
Password: fleet2024
```

## 📊 What's Available

### Dummy Data Loaded:
- ✅ 3 Users (different roles)
- ✅ 6 Vehicles (Trucks, Vans, Bikes)
- ✅ 5 Drivers (with licenses and safety scores)
- ✅ 2 Completed Trips
- ✅ 3 Maintenance Logs
- ✅ 2 Fuel Expenses

### All Pages Connected:
1. **Login** - Authentication with JWT
2. **Dashboard** - Real-time fleet overview
3. **Vehicle Registry** - Manage fleet assets
4. **Trip Dispatcher** - Create and manage trips
5. **Driver Profiles** - Driver management
6. **Maintenance** - Service tracking
7. **Expense & Fuel** - Financial tracking
8. **Analytics** - Reports and insights

## 🎯 Try These Features

### 1. Login
- Go to http://localhost:5174
- Use admin@fleetflow.io / fleet2024
- You'll be redirected to the dashboard

### 2. View Dashboard
- See active fleet count
- Check maintenance alerts
- View recent trips
- Monitor fleet activity

### 3. Add a New Vehicle
- Go to "Vehicle Registry"
- Click "Register Vehicle"
- Fill in details and save
- Vehicle appears in the list

### 4. Create a Trip
- Go to "Trip Dispatcher"
- Click "Create Trip"
- Select available vehicle and driver
- Enter cargo weight (validates against capacity!)
- Create and dispatch

### 5. View Analytics
- Go to "Analytics & Reports"
- See fleet utilization
- View cost breakdowns
- Check efficiency metrics

## 🔧 Servers Running

Both servers are running in the background:

```bash
Backend:  http://localhost:5000 (Node.js + Express + MongoDB)
Frontend: http://localhost:5174 (React + Vite)
```

## 🛑 Stop Servers

If you need to stop the servers, you can close the terminal windows or use Ctrl+C in each terminal.

## 🔄 Restart Servers

If servers stop, restart them:

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

## 📝 Key Features Working

✅ User authentication with JWT
✅ Real-time data from MongoDB
✅ CRUD operations on all entities
✅ Cargo weight validation
✅ Automatic status updates
✅ License expiry tracking
✅ Cost calculations
✅ Fuel efficiency metrics
✅ Analytics and reporting

## 🎨 UI Features

- Modern dark theme
- Responsive design
- Smooth animations
- Real-time updates
- Status badges
- Interactive charts
- Modal forms
- Data tables

## 🐛 Need Help?

If something isn't working:

1. Check both servers are running
2. Verify MongoDB connection in backend/.env
3. Check browser console for errors
4. Ensure you're using the correct login credentials

## 🎊 You're All Set!

Open http://localhost:5174 and start exploring FleetFlow!

The entire application is connected and working with real data from MongoDB.

Happy fleet managing! 🚛✨
