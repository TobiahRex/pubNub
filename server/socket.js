
'use strict';

var io = require('socket.io');

exports.init = (io, socket) => {
  socket.on('SOCKET_TEMPLATE', data => {
    console.log('FR: FrontEnd\n', data);
  });

  var testBackEnd = 'FrontEnd, BackEnd: TEST';
  socket.emit('homeCtrl', testBackEnd);
};
