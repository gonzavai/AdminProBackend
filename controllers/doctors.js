const Doctor = require("../models/doctors");
const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const getDoctors = async (req, res) => {
  res.status(200).json({
    ok: true,
    msg: "getDoctors",
  });
};

const createDoctor = async (req, res = response) => {
  res.status(200).json({
    ok: true,
    msg: "createDoctor",
  });
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
