const Doctor = require("../models/doctors");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");
const Hospital = require("../models/hospital");

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
    const hospitalDB = await Hospital.findById(hospital_id);
    
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
      msg: 'Doctor creado',
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
  const uid = req.uid;
  const { id } = req.params;

  try {
    // Verificar existencia en BDD
    const doctorDB = await Doctor.findById(id);
    if (!doctorDB) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un doctor con ese ID",
      });
    }

    //Verificar existencia del hospital
    const hospitalDB = await Hospital.findById(req.body.hospital_id);
    if (!hospitalDB) {
      res.status(400).json({
        ok: false,
        msg: "No existe un Hospital con el ID proporcionado",
      });
    }

    //Actualizar datos
    const doctorChanges = {
      ...req.body,
      user: uid,
    };
    const updatedDoctor = await Doctor.findByIdAndUpdate(id, doctorChanges, {
      new: true,
    });

    // Doctor actualizado
    return res.json({
      ok: true,
      msg: 'Doctor actualizado',
      doctor: updatedDoctor,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error inseperado al intentar actualizar un Doctor",
    });
  }
};

const deleteDoctor = async (req, res = response) => {
  const uid = req.uid;
  const { id } = req.params;

  try {
    // Verificar existencia en BDD
    const doctorDB = await Doctor.findById(id);
    if (!doctorDB) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un doctor con ese ID",
      });
    }

    //Borrar datos
    const deletedDoctor = await Doctor.findByIdAndDelete(id, {
      new: true,
    });

    // Doctor eliminado
    return res.json({
      ok: true,
      msg: 'Doctor eliminado',
      doctor: deletedDoctor,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error inseperado al intentar eliminar un Doctor",
    });
  }
};

module.exports = {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
