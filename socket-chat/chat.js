const server = require('net').createServer();
let counter = 0;
let sockets = {};

const extractLine = function(socket){
  const bufLen = socket.sbuf.length;
  if(socket.sbuf[bufLen-1] == '\n'){
    const res = socket.sbuf;
    socket.sbuf = '';
    return res;
  } else {
    return null;
  }
}

server.on('connection', socket => {
  socket.id = counter++;
  sockets[socket.id] = socket;
  socket.setEncoding('utf8');
  console.log('client connected');
  socket.write('Please enter your name: \r\n');
  socket.sbuf = '';
  socket.on('data', data => {
    socket.sbuf += data;
    let inputLine = extractLine(socket);
    if (!socket.name && inputLine){
      // there is no name and user enters name
      socket.name = inputLine.trim();
      console.log(`Welcome ${socket.name}`);
      socket.write(`Welcome ${socket.name}\r\n`);
    } else if (socket.name && inputLine){
      Object.entries(sockets).forEach(([key, cs])=>{
        if(socket.id != key){
          cs.write(`[${socket.name}]: ${inputLine}`);
        }
      })
    }
  });

  socket.on('end', ()=>{
    delete sockets[socket.id];
    console.log(`client ${socket.id} is disconnected`);
  });
});

server.listen(3008, ()=>{
  console.log('server bound!');
})