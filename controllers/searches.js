const { response } = require("express");

const User = require("../models/user");
const Hospital = require("../models/hospital");
const Doctor = require("../models/doctors");

const getGlobalSearch = async (req, res) => {
  const searchTerm = req.params.searchTerm;

  try {
    const regex = new RegExp(searchTerm, "i");

    const [users, hospitals, doctors] = await Promise.all([
      User.find({ name: regex }),
      Hospital.find({ name: regex }),
      Doctor.find({ name: regex }),
    ]);

    // Busqueda finalizada con exito
    res.status(200).json({
      ok: true,
      users,
      hospitals,
      doctors,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado al realizar una busqueda global.",
    });
  }
};

const getSearchOnCollection = async (req, res) => {
  const collectionName = req.params.collection;
  const searchTerm = req.params.searchTerm;

  try {
    const regex = new RegExp(searchTerm, "i");
    let results = [];

    switch (collectionName) {
      case "users":
        results = await User.find({ name: regex });
        break;
      case "hospitals":
        results = await Hospital.find({ name: regex }).populate(
          "user",
          "name email -_id"
        );
        break;
      case "doctors":
        results = await Doctor.find({ name: regex })
          .populate("user", "name email -_id")
          .populate("hospital", "name");
        break;

      default:
        return res.status(400).json({
          ok: false,
          msg: `No se encontro la coleccion con nombre ${collectionName}`,
        });
    }

    // Busqueda finalizada con exito
    res.status(200).json({
      ok: true,
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado al realizar una busqueda en la coleccion.",
    });
  }
};

module.exports = { getGlobalSearch, getSearchOnCollection };
