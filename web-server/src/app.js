const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const app = require('./appSetup');
const {generateMessage} = require('../src/utils/message');

const port = process.env.PORT;

const server = http.createServer(app);

const io = socketio(server);

const filter = new Filter();

io.on('connection', (socket) => {
  console.log('new connection is establised');

  socket.on('join', ({name, room}) => {
    socket.join(room);

    console.log('soket join', name, room);
    //socket.emit io.emit socket.broadcast.emit
    //io.to(x).emit, socket.broadcast.to(x).emit

    socket.emit('message', generateMessage(`Welcome ${name} to ${room}!`, 'text'));
    socket.broadcast.to(room).emit('message', generateMessage(`${name } has joined ${room}`,'text'));

  })
  //socket.emit('message', generateMessage('Welcome!', 'text'));
  //socket.broadcast.emit('message', generateMessage('A new user has joined','text'));
  socket.on('sendMessage', (msg, cb) => {
    console.log(`received message: ${msg}`);
    if (filter.isProfane(msg)) {
      console.log('profane words');
      io.emit('message', generateMessage('x'.repeat(msg.length)+'(profane message)', 'text'));
      cb('bad words');
    } else {
      io.emit('message', generateMessage(msg, 'text'));
      cb();
    }
  });
  socket.on('sendLocation', (msg, cb) => {
    console.log('receive send location message');
    io.emit('message', generateMessage(`https://google.com/maps?q=${msg.lat},${msg.long}`,'loc'));
    cb();
  })
  socket.on('disconnect', () => {
    io.emit('message', generateMessage('A user has left!','text'));
  })
});
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
