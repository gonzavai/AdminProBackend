const Hospital = require("../models/hospital");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const getHospitals = async (req, res) => {
  res.status(200).json({
    ok: true,
    msg: "getHospitals",
  });
};

const createHospital = async (req, res = response) => {
  try {
    const { name } = req.body;
    const uid = req.uid;

    // Obtener uid del usuario logueado
    const hospital = new Hospital({
      name,
      user: uid,
    });

    // Guardar hospital en BD
    const hospitalDB = await hospital.save();

    if (!hospitalDB) {
      return res.status(400).json({
        ok: false,
        msg: "No se pudo crear el hospital",
      });
    }

    // Hospital creado
    return res.status(200).json({
      ok: true,
      hospital: hospitalDB,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado al crear el hospital.",
    });
  }
};

const updateHospital = async (req, res = response) => {
  res.status(200).json({
    ok: true,
    msg: "updateHospital",
  });
};

const deleteHospital = async (req, res = response) => {
  res.status(200).json({
    ok: true,
    msg: "deleteHospital",
  });
};

module.exports = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
};
