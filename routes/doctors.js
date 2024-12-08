/* 
    Route: api/doctors
*/

const { Router } = require("express");
const { check } = require("express-validator");

const {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctors");
const { validateFields } = require("../middlewares/fields-validator");
const { verifyToken } = require("../middlewares/verify-token");

const router = Router();

router.get("/", verifyToken, getDoctors);

router.post(
  "/",
  [
    verifyToken,
    check("name", "The name is mandatory!").not().isEmpty(),
    check("hospital_id", "The hospital ID is invalid!").isMongoId(),
    validateFields
  ],
  createDoctor
);

router.put("/:id", updateDoctor);

router.delete("/:id", deleteDoctor);

module.exports = router;
