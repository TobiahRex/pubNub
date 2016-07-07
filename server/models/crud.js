'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

let crudSchema = new mongoose.Schema({
  name    :   {
    type    :     String
  },
  value   :   {
    type    :     Number
  }
});

crudSchema.statics.makeOne = (reqObj, cb) => {
  Crud.create(reqObj, (err, newCrud)=> {
    if(err) return cb(err);
    Crud.find(newCrud._id, (err, savedCrud)=> {
      err ? cb(err) : cb(null, savedCrud);
    });
  });
};

crudSchema.statics.getOne = (reqId, cb) => {
  Crud.findById(reqId, (err, dbCrud)=> {
    err ? cb(err) : cb(null, dbCrud);
  });
};

crudSchema.statics.removeOne = (reqId, cb) => {
  Crud.findByIdAndRemove(reqId, (err, oldCrud) => {
    err ? cb(err) : cb(null, {SUCCESS: `Crud: ${oldCrud} has been removed.`});
  });
};

crudSchema.statics.updateOne = (editObj, cb) => {
  Crud.findByIdAndUpdate(editObj.id, {$set : editObj.body}, (err, oldDbCrud)=> {
    if(err) return cb(err);
    Crud.findById(oldDbCrud._id, (err, savedCrud)=> {
      err ? cb(err) : cb(null, savedCrud);
    });
  });
};

let Crud = mongoose.model('Crud', crudSchema);
module.exports = Crud;
