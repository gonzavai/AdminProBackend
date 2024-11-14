require("dotenv").config();

const expres = require("express");
const { dbConnection } = require("./database/db-config");
const cors = require("cors");

// Server creation
const app = expres();

// Setup CORS
app.use(cors());

// Read and parse body
app.use(expres.json());

//MongoDB config
//user: mean_user
//password: QuyMi3Feb7KVIZop
dbConnection();

// Routes
app.use("/api/login", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/hospitals", require("./routes/hospitals"));
app.use("/api/doctors", require("./routes/doctors"));

// Listen on Port
app.listen(process.env.PORT, () => {
  console.log("# Express server running on port:", process.env.PORT);
});
