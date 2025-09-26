const Hospital = require("../models/hospital");
const { response } = require("express");

const getHospitals = async (req, res) => {
  const offset = req.query.offset || 0;
  const limit = req.query.limit || 5;

  const [hospitals, total] = await Promise.all([
    Hospital.find().skip(offset).limit(limit).populate("user", "id name email"),
    Hospital.countDocuments(),
  ]);

  console.log(hospitals);

  res.status(200).json({
    ok: true,
    hospitals,
    total,
  });
};

const createHospital = async (req, res = response) => {
  try {
    const { name } = req.body;
    const uid = req.uid;

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
  const { id } = req.params;
  const uid = req.uid;

  console.log("#### REQ PARAMS ID:", id);

  try {
    // Verificar existencia del hospital
    const hospitalDB = await Hospital.findById(id);
    if (!hospitalDB) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un hospital con ese ID",
      });
    }

    const hospitalChanges = {
      ...req?.body,
      user: uid,
    };

    const updatedHospital = await Hospital.findByIdAndUpdate(
      id,
      hospitalChanges,
      { new: true } // para retornar el elemento actualizado
    );

    // Hospital actualizado
    return res.status(200).json({
      ok: true,
      hospital: updatedHospital,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperadao al intentar actualizar el hospital.",
    });
  }
};

const deleteHospital = async (req, res = response) => {
  const { id } = req.params;
  const uid = req.uid;

  try {
    // Verificar existencia del hospital
    const hospitalDB = await Hospital.findById(id);
    if (!hospitalDB) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un hospital con ese ID",
      });
    }

    const deletedHospital = await Hospital.findByIdAndDelete(
      id,
      { new: true } // para retornar el elemento eliminado
    );

    // Hospital eliminado
    return res.status(200).json({
      ok: true,
      hospital: deletedHospital,
      uid,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperadao al intentar eliminar el hospital.",
    });
  }
};

module.exports = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
};
