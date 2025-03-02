// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// require('dotenv').config();

// // Routes
// const propertyRoutes = require("./routes/propertyRoutes");
// const renterRoutes = require("./routes/renterRoutes");
// const renterAllocationRoutes = require("./routes/renterAllocationRoutes");
// const app = express();
// const PORT = process.env.PORT || 3001;
// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // CORS setup
// app.use(
//   cors({
//     // Replace with your frontend URL/port
//     origin: process.env.FRONT_URL || "http://localhost:5174",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
// console.log('checkproxy',process.env.FRONT_URL)
// // Serve files from "uploads" (or "tmp/uploads" in serverless environments)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// // Test route
// app.get("/", (req, res) => {
//   res.send("API is running");
// });
// // Property routes
// app.use("/api/property", propertyRoutes);
// // Renter routes
// app.use("/api/renter", renterRoutes);
// // Allocation routes
// app.use("/api/allocations", renterAllocationRoutes );
// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
// module.exports = app;



// ----------------------------------------------------------------------------------------------------------------------------/


const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth.routes");
const propertyRoutes = require("./routes/propertyRoutes");
const renterRoutes = require("./routes/renterRoutes");
const renterAllocationRoutes = require("./routes/renterAllocationRoutes");


 
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(
  cors({
    // Replace with your frontend URL/port
    origin: process.env.FRONT_URL || "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// Serve files from "uploads" (or "tmp/uploads" in serverless environments)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);

// Property routes
app.use("/api/property", propertyRoutes);
// Renter routes
app.use("/api/renter", renterRoutes);
// Allocation routes
app.use("/api/allocations", renterAllocationRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
