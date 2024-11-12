const jwt = require("jsonwebtoken");

const verifyToken = (req, res = response, next) => {
  const token = req.header("x-token");

  console.log("#### TOKEN:", token);

  if (!token) {
    res.status(401).json({
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

module.exports = {
  verifyToken,
};
