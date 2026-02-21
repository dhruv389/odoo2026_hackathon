# FleetFlow API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "dispatcher"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@fleetflow.io",
  "password": "fleet2024"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Admin User",
    "email": "admin@fleetflow.io",
    "role": "admin"
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

---

## Vehicles

### Get All Vehicles
```http
GET /vehicles
Query Parameters:
  - type: Truck | Van | Bike | All
  - status: Available | On Trip | In Shop | All
  - search: string
```

### Get Single Vehicle
```http
GET /vehicles/:id
```

### Create Vehicle
```http
POST /vehicles
Content-Type: application/json

{
  "name": "Titan Hauler Pro",
  "plate": "MH-01-2024",
  "type": "Truck",
  "capacity": 8000,
  "odometer": 84320,
  "fuel": "Diesel",
  "acquisitionCost": 2500000
}
```

### Update Vehicle
```http
PUT /vehicles/:id
Content-Type: application/json

{
  "odometer": 85000,
  "status": "Available"
}
```

### Delete Vehicle
```http
DELETE /vehicles/:id
```

### Get Available Vehicles
```http
GET /vehicles/available
```

---

## Drivers

### Get All Drivers
```http
GET /drivers
Query Parameters:
  - status: On Duty | Off Duty | Suspended | All
  - search: string
```

### Get Single Driver
```http
GET /drivers/:id
```

### Create Driver
```http
POST /drivers
Content-Type: application/json

{
  "name": "John Mercer",
  "license": "MH20230045",
  "expiry": "2026-04-10",
  "category": "HMV",
  "status": "Off Duty"
}
```

### Update Driver
```http
PUT /drivers/:id
Content-Type: application/json

{
  "safety": 95,
  "status": "On Duty"
}
```

### Delete Driver
```http
DELETE /drivers/:id
```

### Get Available Drivers
```http
GET /drivers/available
```

### Get License Alerts
```http
GET /drivers/license-alerts
```

---

## Trips

### Get All Trips
```http
GET /trips
Query Parameters:
  - status: Draft | Dispatched | Completed | Cancelled | All
```

### Get Single Trip
```http
GET /trips/:id
```

### Create Trip (Dispatch)
```http
POST /trips
Content-Type: application/json

{
  "vehicle": "vehicle_id",
  "driver": "driver_id",
  "cargo": 7200,
  "origin": "Mumbai Warehouse",
  "destination": "Pune Hub",
  "fuel": "₹4,200"
}
```

**Business Rules:**
- Vehicle must be "Available"
- Driver must be "Off Duty" and license not expired
- Cargo weight must not exceed vehicle capacity
- Auto-updates: Vehicle → "On Trip", Driver → "On Duty"

### Update Trip Status
```http
PUT /trips/:id/status
Content-Type: application/json

{
  "status": "Completed",
  "distance": "148 km",
  "fuel": "₹4,200"
}
```

**Auto-updates on Completed/Cancelled:**
- Vehicle → "Available"
- Driver → "Off Duty"

### Delete Trip
```http
DELETE /trips/:id
```

---

## Maintenance

### Get All Maintenance Logs
```http
GET /maintenance
Query Parameters:
  - status: In Progress | Completed | All
  - vehicleId: vehicle_id
```

### Get Single Maintenance Log
```http
GET /maintenance/:id
```

### Create Maintenance Log
```http
POST /maintenance
Content-Type: application/json

{
  "vehicle": "vehicle_id",
  "type": "Oil Change",
  "date": "2024-02-21",
  "cost": 3500,
  "tech": "QuickFix Motors",
  "notes": "Regular service"
}
```

**Auto-updates:**
- Vehicle → "In Shop"

### Mark Maintenance Complete
```http
PUT /maintenance/:id/complete
```

**Auto-updates:**
- Vehicle → "Available"

### Update Maintenance
```http
PUT /maintenance/:id
Content-Type: application/json

{
  "cost": 4000,
  "notes": "Additional parts required"
}
```

### Delete Maintenance
```http
DELETE /maintenance/:id
```

### Get Maintenance Summary
```http
GET /maintenance/summary
```

---

## Expenses

### Get All Expenses
```http
GET /expenses
Query Parameters:
  - vehicle: string
  - driver: string
  - startDate: YYYY-MM-DD
  - endDate: YYYY-MM-DD
```

### Get Single Expense
```http
GET /expenses/:id
```

### Create Expense
```http
POST /expenses
Content-Type: application/json

{
  "tripId": "TR-2401",
  "driver": "John Mercer",
  "vehicle": "Titan Hauler Pro",
  "distance": 148,
  "liters": 32,
  "cost": 4200,
  "date": "2024-02-21"
}
```

### Update Expense
```http
PUT /expenses/:id
Content-Type: application/json

{
  "cost": 4500,
  "liters": 35
}
```

### Delete Expense
```http
DELETE /expenses/:id
```

### Get Expense Summary
```http
GET /expenses/summary
```

Response:
```json
{
  "success": true,
  "data": {
    "totalCost": 15000,
    "totalLiters": 120,
    "totalDistance": 600,
    "avgEfficiency": 5.0,
    "count": 10
  }
}
```

### Get Expenses By Vehicle
```http
GET /expenses/by-vehicle
```

---

## Analytics

### Get Dashboard Stats
```http
GET /analytics/dashboard
```

Response:
```json
{
  "success": true,
  "data": {
    "fleet": {
      "total": 6,
      "active": 2,
      "available": 3,
      "inShop": 1,
      "utilization": 33
    },
    "trips": {
      "pending": 0,
      "dispatched": 2,
      "completed": 10,
      "total": 12
    },
    "drivers": {
      "total": 5,
      "onDuty": 2,
      "suspended": 1
    }
  }
}
```

### Get Analytics Data
```http
GET /analytics
```

### Get Vehicle ROI
```http
GET /analytics/vehicle-roi
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Business Logic Summary

### Trip Creation Rules:
1. Vehicle must be "Available"
2. Driver must be "Off Duty" or "Available"
3. Driver license must not be expired
4. Cargo weight ≤ Vehicle capacity
5. Auto-updates: Vehicle → "On Trip", Driver → "On Duty"

### Trip Completion Rules:
1. Auto-updates: Vehicle → "Available", Driver → "Off Duty"
2. Driver completed count increments

### Maintenance Creation Rules:
1. Auto-updates: Vehicle → "In Shop"
2. Vehicle removed from dispatcher pool

### Maintenance Completion Rules:
1. Auto-updates: Vehicle → "Available"
2. Vehicle returns to dispatcher pool

### Driver Assignment Rules:
1. License must not be expired
2. Status must be "Off Duty" or "Available"
3. Cannot assign if "Suspended"
