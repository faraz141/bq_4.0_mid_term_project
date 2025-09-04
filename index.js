// index.js
const express = require("express");
const app = express();
const db = require("./src/config/db_connection");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./src/routes/userRoute");
const eventRoutes = require("./src/routes/eventRoute");
const bookingRoutes = require("./src/routes/bookingRoute");
const aggregationRoutes = require("./src/routes/aggregationRoute");
const { startCronJob } = require("./src/utils/cronJobs");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(userRoutes);
app.use(eventRoutes);
app.use(bookingRoutes);
app.use(aggregationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

// Start cron job
startCronJob();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
