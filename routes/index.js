let express = require('express');
const createError = require("http-errors");
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  next(createError(401))
});

module.exports = router;
