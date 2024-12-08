const Doctor = require("../models/doctors");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");
const hospital = require("../models/hospital");

const getDoctors = async (req, res) => {
  const doctors = await Doctor.find()
    .populate("user", "id name")
    .populate("hospital", "id name");

  res.status(200).json({
    ok: true,
    doctors,
  });
};

const createDoctor = async (req, res = response) => {
  try {
    const { name, hospital_id } = req.body;
    const uid = req.uid;

    // Verificar exitencia del hostpital
    const hospitalDB = await Doctor.findById(hospital_id);

    if (!hospitalDB) {
      return res.status(400).json({
        ok: false,
        msg: "No se pudo encontrar un hospital con ese ID.",
      });
    }

    const doctor = new Doctor({
      name,
      hospital: hospital_id,
      user: uid,
    });

    // Guardar doctor en BD
    const doctorDB = await doctor.save();

    if (!doctorDB) {
      return res.status(400).json({
        ok: false,
        msg: "No se pudo crear el doctor.",
      });
    }

    // Doctor creado
    return res.status(200).json({
      ok: true,
      doctor: doctorDB,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado al intentar crear un doctor.",
    });
  }
};

const updateDoctor = async (req, res = response) => {
  res.status(200).json({
    ok: true,
    msg: "updateDoctor",
  });
};

const deleteDoctor = async (req, res = response) => {
  res.status(200).json({
    ok: true,
    msg: "deleteDoctor",
  });
};

module.exports = {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
