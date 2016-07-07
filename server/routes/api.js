'use strict';

var express = require('express');
var router = express.Router();

router.use('/oauth', require('./oauth'));
router.use('/users', require('./users'));
router.use('/crud', require('./cruds'));

module.exports = router;
