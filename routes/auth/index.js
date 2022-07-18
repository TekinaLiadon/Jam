let express = require('express');
const createError = require("http-errors");
let router = express.Router();

router.get('/', function(req, res, next) {
  next(createError(401))
});

module.exports = router;
