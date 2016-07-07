'use strict';

require('dotenv').load();
const PORT        = process.env.PORT || 3001
const mongoose    = require('mongoose');
const moment      = require('moment');
const JWT         = require('jsonwebtoken');
const Request     = require('request');
const QS          = require('querystring');
const BCRYPT      = require('bcryptjs');
const JWT_SECRET  = process.env.JWT_SECRET;
const ObjectId    = mongoose.Schema.Types.ObjectId;
const Mail        = require('./mail');


let commentLikeSchema = new mongoose.Schema({
  likeDate    :   {
    type      :   Date,
    default   :   Date.now
  }
});
let replyLikeSchema = new mongoose.Schema({
  likeDate    :   {
    type      :   Date,
    default   :   Date.now
  }
});
let replySchema = new mongoose.Schema({
  Body        :   {
    type      :   String
  },
  ReplyDate   :   {
    type      :   Date
  },
  Likes       :   [replyLikeSchema] // reply likes
});
let commentSchema = new mongoose.Schema({
  UserId    :   {
    type    :   ObjectId,
    ref     :   'User'
  },
  CommentDate :   {
    type      :     Date
  },
  Body        :   {
    type      :    String
  },
  Likes       :   [commentLikeSchema],
  Replies     :   [replySchema]
})
let messageSchema = new mongoose.Schema({
  UserId :  {
    type    :     ObjectId,
    ref     :     'User'
  },
  MessageDate : {
    type    :   Date,
    default :   Date.now
  },
  Body      :   {
    type: String
  },
  Replies   : [replySchema]
});
let userSchema = new mongoose.Schema({
  Admin    :   {
    type        :   Boolean,
    default     :   false
  },
  Username  :   {
    type        :   String
  },
  _Password :   {
    type        :   String
  },
  Firstname :   {
    type        :   String
  },
  Lastname  :   {
    type        :   String
  },
  Email     :   {
    type        :     'String',
    unique      :     true
  },
  Verified  :   {
    type        :     Boolean,
    default     :     false
  },
  Bio       :   {
    type        :     String
  },
  Avatar    :   {
    type        :     String
  },
  CoverPhoto:   {
    type        :     String
  },
  Social    :   {   // OAuth user ID's
  facebookId    :   {
    type          :     String
  },
  facebookLink  :   {
    type          :     String
  },
  twitterId     :   {
    type          :     String
  },
  instagramId   :   {
    type          :     String
  }
},
  LastLogin :   {
    type        :     Date
  },
  wComments  :  [commentSchema],
  wMessages  :  [messageSchema],
  rComments  :  [{
    type      :   ObjectId,
    ref       :   'User'
  }],
  rMessages  :  [{
    type      :   ObjectId,
    ref       :   'User'
  }]
});

// Basic CRUD
userSchema.statics.getUser = (userId, cb) => {
  if(!userId) return cb({ERROR : `Did Not Provide ID; ${userId}`});
  User.findById(userId, (err, dbUser) => {
    err ? cb(err) : cb(null, dbUser);
  });
};

userSchema.statics.updateUser = (userObj, cb) => {
  if(!userObj.id) return cb({ERROR : `User ID ${userObj.id} not Found. Verify ID.`});
  User.findByIdAndUpdate(userObj.id, {$set : userObj.body }, (err, outdatedDbUser) => {
    err ? cb(err) : User.findById(outdatedDbUser._id, (err, updatedDbUser) => {
      err ? cb(err) : cb(null, updatedDbUser);
    });
  });
};

userSchema.statics.removeUser = (userId, cb) => {
  if(!userId) return cb({ERROR : `Cannot Remove:  ${userObj.id} not Found. Verify ID`});
  User.findByIdAndRemove(userId, (err, oldDbUser)=>{
    err ? cb(err) : cb(null, {SUCCESS : `REMOVED - \n${oldDbUser}`});
  });
};

// Register User
userSchema.statics.register = function(newUserObj, cb){
  User.findOne({Email : newUserObj.Email}, (err, dbUser)=>{
    if(err || dbUser) return cb(err || {ERROR : `That Email has already been taken.`});
  });
  BCRYPT.hash(newUserObj._Password, 12, (err, hash)=> {
    if(err) cb(err);

    let user = new User({
      Access    :   newUserObj.Access,
      Username  :   newUserObj.Username,
      Firstname :   newUserObj.Firstname,
      Lastname  :   newUserObj.Lastname,
      Email     :   newUserObj.Email,
      _Password :   hash,
      Bio       :   newUserObj.Bio,
      Avatar    :   newUserObj.Avatar
    });
    user.save((err, savedUser)=> {
      if(err) return cb(err);

      Mail.verify(savedUser, response =>{

        if(response.statusCode !== 202) return cb(err);
        savedUser._Password = null;
        cb(err, savedUser);
      });
    });
  });
};

userSchema.methods.profileLink = function(){
  let exp = moment().add(1, 'w');
  let payload = {
    _id :   this._id,
    exp :   moment().add(1, 'w').unix()
  };

  let token = JWT.sign(payload, JWT_SECRET);
  return `http://localhost:${PORT}/api/users/verify/${token}`;
};

userSchema.statics.emailVerify = (token, cb) => {
  if(!token) return cb({ERROR : 'Token not recieved.'});

  JWT.verify(token, JWT_SECRET, (err, payload)=> {
    if(err) return res.status(400).send(err);
    // if(payload.exp < Date.now()) return cb({ERROR : `Verification link expired on ${Date(payload.exp)}`});

    User.findById(payload._id, (err, dbUser)=> {
      if(err || !dbUser) return cb(err || 'User not found');
      dbUser.Verified = true;
      dbUser.save(cb);
    });
  });
};

// Verify User Login MiddleWare
userSchema.statics.authenticate = (userObj, cb) => {
  User.findOne({Email : userObj.Email}, (err, dbUser) => {
    if(err || !dbUser) return cb(err || {ERROR : `Login Failed. Username or Password Inccorect. Try Again.`});
    BCRYPT.compare(userObj._Password, dbUser._Password, (err, result)=> {
      if(err || result !== true) return cb({ERROR : 'Login Failed. Username or Password Incorrect. Try Again.'});
    });
    let token = dbUser.createToken();
    dbUser.LastLogin = Date.now();
    dbUser.save((err, savedUser)=> {
      if(err) return cb(err);
      savedUser._Password = null;
      cb(null, {token, savedUser});
    });
  });
};

userSchema.statics.authorize = function(clearance = {Admin : false}){
  return function(req, res, next){
    let tokenHeader = req.headers.authorization;
    console.log('tokenHeader: ', tokenHeader);
    if(!tokenHeader) return res.status(400).send({ERROR : 'User not found.'});
    let token = tokenHeader.split(' ')[1];

    JWT.verify(token, JWT_SECRET, (err, payload) => {
      if(err) return res.status(401).send({ERROR : `HACKER! You are not Authorized!`});
      User.findById(payload._id)
      .select({_Password : false})
      .exec((err, dbUser)=> {
        if(err || !dbUser){
          return
          res.clearCookie('accessToken')
          .status(400)
          .send(err || {error : `User Not Found.`});
        }; // else
        req.user = dbUser;
        next();
      });
    });
  };
};

userSchema.methods.createToken = function(){
  let thisId = this._id;
  let token = JWT.sign({_id : this._id}, JWT_SECRET, {expiresIn : '1 day'});
  return token;
};

// Social Methods
userSchema.statics.addComment = (reqBody ,cb) => {
  console.log("reqbody: ", reqBody);
  if(!reqBody.user) return err({ERROR : 'No comment found in res. object.'});
  User.findById(reqBody.user, (err1, dbUser)=> {
    User.findById(reqBody.person, (err2, dbPerson)=>{
      if(err1 || err2) return cb(err1 || err2);

      let wComment = {
        UserId      : dbPerson._id,
        CommentDate : Date.now(),
        Body        : reqBody.comment
      };
      dbPerson.wComments.push(wComment);
      dbPerson.save((err, savedPerson)=> {
        if(err) return cb(err);
        let newComment =  savedPerson.wComments.pop();
        dbUser.rComments.push(newComment._id);
        dbUser.save((err2, savedUser)=> {
          err2 ? cb(err2) : cb(null, {savedPerson, savedPerson});
        });
      });
    });
  });
};


let User = mongoose.model('User', userSchema);
module.exports = User;
