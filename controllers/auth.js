const User = require("../models/user");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const login = async (req, res = response) => {
  const { password, email } = req.body;

  try {
    //verificar existencia del usuario por email
    const userDB = await User.findOne({ email });
    if (!userDB) {
      return res.status(400).json({
        ok: false,
        msg: "Combinación de Email y Password incorrecta o inexistente!",
      });
    }

    // Verificar password
    const isValidPassword = bcrypt.compareSync(password, userDB.password);
    if (!isValidPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Combinación de Email y Password incorrecta o inexistente!",
        password,
        isValidPassword,
      });
    }

    // Login exitoso
    // Generar el TOKEN JWT
    const token = await generateJWT(userDB.id);
    return res.status(200).json({
      ok: true,
      user: userDB,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado al realizar el login.",
    });
  }
};

module.exports = {
  login,
};
