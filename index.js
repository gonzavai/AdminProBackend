require("dotenv").config();

const express = require("express");
const { dbConnection } = require("./database/db-config");
const cors = require("cors");
const path = require("path");

// Server creation
const app = express();

// Carpeta publica
app.use(express.static("public"));

// Setup CORS
app.use(cors());

// Read and parse body
app.use(express.json());

//MongoDB config
//user: mean_user
//password: QuyMi3Feb7KVIZop
dbConnection();

// Routes
app.use("/api/login", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/hospitals", require("./routes/hospitals"));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/search", require("./routes/searches"));
app.use("/api/upload", require("./routes/uploads"));

// Other
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

// Listen on Port
app.listen(process.env.PORT, () => {
  console.log("# Express server running on port:", process.env.PORT);
});
