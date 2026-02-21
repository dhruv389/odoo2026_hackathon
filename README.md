# MERN Stack Project

A full-stack application built with MongoDB, Express.js, React, and Node.js.

## Project Structure

```
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
└── backend/           # Node.js + Express backend
    ├── config/        # Database configuration
    ├── controllers/   # Route controllers
    ├── models/        # Database models
    ├── routes/        # API routes
    └── package.json
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <project-folder>
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Configure environment variables:

Create a `.env` file in the `backend` folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern_app
```

## Running the Application

1. Start MongoDB (if running locally):
```bash
mongod
```

2. Start the backend server:
```bash
cd backend
npm run dev
```

3. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Technologies Used

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv
