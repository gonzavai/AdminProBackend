/* 
    Route: api/login
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/fields-validator");
const { login, googleSignIn } = require("../controllers/auth");

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

router.post(
  "/google",
  [
    check("token", "The google token is mandatory!").not().isEmpty(),
    validateFields,
  ],
  googleSignIn
);

module.exports = router;
