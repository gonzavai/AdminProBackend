const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "Token invalido!",
    });
  }

  try {
    // Verificar Token
    const { uid } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token invalido!",
    });
  }
};

const validateADMIN_ROLE = async (req, res, next) => {
  const uid = req.uid;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }

    if (userDB.role !== "ADMIN_ROLE") {
      return res.status(403).json({
        ok: false,
        msg: "No tiene privilegios para hacer esto",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
const validateADMIN_ROLEorSameUser = async (req, res, next) => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }

    if (userDB.role !== "ADMIN_ROLE" && uid !== id) {
      return res.status(403).json({
        ok: false,
        msg: "No tiene privilegios para hacer esto, y tampoco es el mismo usuario",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  verifyToken,
  validateADMIN_ROLE,
  validateADMIN_ROLEorSameUser,
};
