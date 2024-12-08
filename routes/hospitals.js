/* 
    Route: api/hospitals
*/

const { Router } = require("express");
const { check } = require("express-validator");

const {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitals");
const { validateFields } = require("../middlewares/fields-validator");
const { verifyToken } = require("../middlewares/verify-token");

const router = Router();

router.get("/", verifyToken, getHospitals);

router.post(
  "/",
  [
    verifyToken,
    check("name", "The name is mandatory!").not().isEmpty(),
    validateFields,
  ],
  createHospital
);

router.put("/:id", updateHospital);

router.delete("/:id", deleteHospital);

module.exports = router;
