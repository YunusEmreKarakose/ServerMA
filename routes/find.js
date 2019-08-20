const mysql=require('../helper/sqldb');
var express = require('express');
var router = express.Router();

/* GET*/
router.get('/', function(req, res, next) {
  let sqlstr='SELECT * FROM gwb827ebfffe81c028rx WHERE isMapped=?';
});

module.exports = router;