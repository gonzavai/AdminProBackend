const User = require("../models/user");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");
const { verifyGoogleToken } = require("../helpers/verify-google-token");

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

const googleSignIn = async (req, res = response) => {
  try {
    const { token } = req.body;

    // Verificar Token con google
    const { email, picture, name } = await verifyGoogleToken(token);
    const userDB = await User.findOne({ email });
    let user;
    if (!userDB) {
      user = new User({
        name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      });
    } else {
      user = userDB;
      user.google = true;
    }

    await user.save();

    return res.json({
      ok: true,
      token,
      email,
      picture,
      name,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "No se pudo obtener la informmación del usuario. Revisar token",
    });
  }
};

const renewToken = async (req, res) => {
  const uid = req.uid;
  try {
    const token = await generateJWT(uid);
    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado al intentar renovar el Token!",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
