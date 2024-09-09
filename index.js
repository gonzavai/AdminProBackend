require("dotenv").config();

const expres = require("express");
const { dbConnection } = require("./database/db-config");
const cors = require("cors");

// Server creation
const app = expres();

// Setup CORS
app.use(cors());

//MongoDB config
//user: mean_user
//password: QuyMi3Feb7KVIZop
dbConnection();

// Routes
app.use("/api/users", require("./routes/users"));

// Listen on Port
app.listen(process.env.PORT, () => {
  console.log("# Express server running on port:", process.env.PORT);
});
