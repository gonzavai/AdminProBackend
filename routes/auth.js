/* 
    Route: api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/fields-validator");
const { login } = require("../controllers/auth");

const router = Router();

router.post(
  "/",
  [
    check("email", "The email is mandatory!").isEmail(),
    check("password", "The password is mandatory!").not().isEmpty(),
    validateFields,
  ],
  login
);

module.exports = router;
