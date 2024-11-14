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
  res.status(200).json({
    ok: true,
    msg: "createHospital",
  });
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
