/* 
    Route: api/upload
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { verifyToken } = require("../middlewares/verify-token");
const expressFileUpload = require("express-fileupload");
const { uploadImage, getImage } = require("../controllers/uploads");
const { validateFields } = require("../middlewares/fields-validator");

const router = Router();

router.use(expressFileUpload());

router.put(
  "/",
  [
    verifyToken,
    check("id", "The id is mandatory!").not().isEmpty(),
    check("collection", "The collection is mandatory!").not().isEmpty(),
    validateFields,
  ],
  uploadImage
);

router.get(
  "/",
  [
    check("image", "The image is mandatory!").not().isEmpty(),
    check("collection", "The collection is mandatory!").not().isEmpty(),
    validateFields,
  ],
  getImage
);

module.exports = router;
