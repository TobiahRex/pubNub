'use strict';

require('dotenv').load();
const PORT          = process.env.PORT || 3001;
const MONGO_URL     = process.env.MONGODB_URI || "mongodb://localhost/codeTalkApp";

const express       = require('express');
const router        = express.Router();
const app           = express();
const server        = require('http').Server(app);
const io            = require('socket.io')(server);
const morgan        = require('morgan');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const Socket        = require('./server/socket');
const path          = require('path');
const mongoose      = require('mongoose');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));
app.use((req, res, next) => {
  res.handle = (err, dbData) => res.status(err ? 400 : 200).send(err || dbData);
  next();
});

app.use('/api', require('./server/routes/api'));
app.use('/',    require('./server/routes/index'));

io.on('connection', (socket) => {
  console.log('Client Connected @', socket.handshake.address);
  Socket.init(io, socket);
});

server.listen(PORT, err => console.log(err || `Server @ PORT ${PORT}`));
mongoose.connect(MONGO_URL, err => console.log(err || `MONGOdb @ ${MONGO_URL}`));
module.exports = app;
