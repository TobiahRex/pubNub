'use strict';

var express = require('express');
var router = express.Router();
var Crud = require('../models/crud');


router.route('/')
.get((req, res)     => Crud.find({}, res.handle))
.post((req, res)    => Crud.create(req.body, res.handle));

router.route('/:id')
.get((req, res)     => Crud.findById(req.params.id, res.handle))
.delete((req, res)  => Crud.findByIdAndRemove(req.params.id, res.handle))
.put((req, res)     =>  Crud.findByIdAndUpdate(req.params.id, { $set: req.body }, {new: true}, res.hanlde));

module.exports = router;
