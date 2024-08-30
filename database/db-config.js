const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);
    console.log("# MongoDb is online!");
  } catch (error) {
    console.error(error);
    throw new Error("# => Error al iniciar la conexión a la base de datos!");
  }
};

module.exports = {
  dbConnection,
};
