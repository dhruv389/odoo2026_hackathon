import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/authRoutes.js';
import vehicleRoutes from "./routes/vehicleRoutes.js";
import maintenanceRoutes from "./routes/maintenanceRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use('/api/users', userRoutes);

app.use("/api/trips", tripRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
