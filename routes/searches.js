/* 
    Route: api/search:term
*/

const { Router } = require("express");
const { check } = require("express-validator");

const { validateFields } = require("../middlewares/fields-validator");
const { verifyToken } = require("../middlewares/verify-token");
const {
  getGlobalSearch,
  getSearchOnCollection,
} = require("../controllers/searches");

const router = Router();

router.get("/:searchTerm", verifyToken, getGlobalSearch);

router.get("/:collection/:searchTerm", verifyToken, getSearchOnCollection);

module.exports = router;
