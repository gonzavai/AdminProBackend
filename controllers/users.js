const User = require("../models/user");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const getUsers = async (req, res) => {
  const offset = req.query.offset || 0;
  const limit = req.query.limit || 5;

  const [users, total] = await Promise.all([
    User.find({}, "name email password role img google")
      .skip(offset)
      .limit(limit),

    User.countDocuments(),
  ]);

  console.log(users);

  res.status(200).json({
    ok: true,
    users,
    total,
  });
};

const createUser = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    // Verificar existencia previa del email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        ok: false,
        msg: "The email is already used!",
      });
    }
    const user = new User(req.body);
    console.log("#### REQ:", user);

    // Encriptar password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Guardar usuario eb BDD
    const userSaved = await user.save();
    if (userSaved) {
      const token = await generateJWT(userSaved.id);
      return res.status(200).json({
        ok: true,
        user,
        token,
      });
    } else {
      throw new Error("Error on save user process.");
    }
  } catch (error) {
    console.error("##### ERROR CAPTURADO EN CATCH:", error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado al guardar usuario, revise logs!",
    });
  }
};

const updateUser = async (req, res = response) => {
  const { id } = req.params;

  try {
    // Verificar existencia previa del usuario
    const userDB = await User.findById(id);
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese ID.",
      });
    }

    // Proceso de actualizacion de datos
    const { password, google, email, ...fields } = req.body;

    // Verificar que el email sea diferente
    if (userDB.email !== email) {
      // Verificar existencia del mail en otros usuarios
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          ok: false,
          msg: "The email is already used!",
        });
      }
    }

    if (!userDB.google) {
      fields.email = email;
    } else if (userDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "Google user can't change email.",
      });
    }

    // TODO: Validar token del usuario (para verificar que es el mismo)

    const updatedUser = await User.findByIdAndUpdate(id, fields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(400).json({
        ok: false,
        msg: "Error al intentar actualizar los datos del usuario.",
      });
    }

    // Usuario actualizado en BDD
    return res.status(200).json({
      ok: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado al actualizar usuario.",
    });
  }
};

const deleteUser = async (req, res = response) => {
  const { id } = req.params;

  try {
    // Verificar existencia previa del usuario
    const userDB = await User.findById(id);
    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese ID.",
      });
    }

    // Eliminar usuario
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      return res.status(200).json({
        ok: true,
        user: deletedUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado al intentar eliminar el usuario. Revisar formato del ID",
    });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
