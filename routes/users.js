/* 
    Route: api/users
*/

const { Router } = require("express");
const { check } = require("express-validator");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const { validateFields } = require("../middlewares/fields-validator");
const {
  verifyToken,
  validateADMIN_ROLE,
  validateADMIN_ROLEorSameUser,
} = require("../middlewares/verify-token");

const router = Router();

router.get("/", verifyToken, getUsers);

router.post(
  "/",
  [
    verifyToken,
    validateADMIN_ROLE,
    check("name", "The name is mandatory!").not().isEmpty(),
    check("email", "The email is mandatory!").isEmail(),
    check("password", "The password is mandatory!").not().isEmpty(),
    validateFields,
  ],
  createUser
);

router.put(
  "/:id",
  [
    verifyToken,
    validateADMIN_ROLEorSameUser,
    check("name", "The name is mandatory!").not().isEmpty(),
    check("email", "The email is mandatory!").isEmail(),
    validateFields,
  ],
  updateUser
);

router.delete("/:id", verifyToken, validateADMIN_ROLE, deleteUser);

module.exports = router;
