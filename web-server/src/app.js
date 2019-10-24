const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const app = require('./appSetup');
const {generateMessage} = require('../src/utils/message');
const {addUser, removeUser, getUser, getUsers} = require('../src/utils/users')
const port = process.env.PORT || '3002';

const server = http.createServer(app);

const io = socketio(server);

const filter = new Filter();

io.on('connection', (socket) => {
  console.log('new connection is establised');

  socket.on('join', ({name, room}, cb) => {
    const {err, user} = addUser(socket.id, name, room);

    if (err) {
      socket.emit('message', generateMessage('Admin', `cannot join because of ${err}`, 'text'))
      return cb(err);
    }
    socket.join(user.room);

    //socket.emit io.emit socket.broadcast.emit
    //io.to(x).emit, socket.broadcast.to(x).emit

    socket.emit('message', generateMessage('Admin', `Welcome ${user.name} to ${user.room}!`, 'text'));
    socket.broadcast.to(room).emit('message', generateMessage(user.name, `${user.name } has joined ${user.room}`,'text'));
    io.emit('roomUpdate', getUsers());
    cb();
  })
  
  socket.on('sendMessage', (msg, cb) => {
    const user = getUser(socket.id);
    if (!user) {
      return cb('cannot send because no such user');
    }
    if (filter.isProfane(msg)) {
      io.to(user.room).emit('message', generateMessage(user.name, 'x'.repeat(msg.length)+'(profane message)', 'text'));
      cb('bad words');
    } else {
      io.to(user.room).emit('message', generateMessage(user.name, msg, 'text'));
      cb();
    }
  });
  socket.on('requestData', (msg, cb) => {
    if (msg == 'getUsers') {
      socket.emit('roomUpdate', getUsers());
      return cb();
    }
    return cb('unknown request command');
  })
  socket.on('sendLocation', (msg, cb) => {
    const user = getUser(socket.id);
    if (!user) {
      return cb('cannot send because no such user');
    }
    io.to(user.room).emit('message', generateMessage(user.name, `https://google.com/maps?q=${msg.lat},${msg.long}`,'loc'));
    cb();
  })
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', generateMessage(user.name, `${user.name} has left ${user.room}!`,'text'));
      io.emit('roomUpdate', getUsers());
    }
  })
});
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
