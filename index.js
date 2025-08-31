const express = require("express");
const app = express();
const db = require("./config/db_connection");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookRoutes = require("./routes/bookingRoutes");
const aggregationRoutes = require("./routes/aggregationRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRoutes);
app.use("/", eventRoutes);
app.use("/", bookRoutes);
app.use("/", aggregationRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
