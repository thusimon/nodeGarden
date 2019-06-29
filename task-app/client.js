const EventEmitter = require('events');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = new EventEmitter();
client.id = 'client';
const server = require('./server')(client);

server.on('response', (resp)=>{
  //console.log('server: ', resp);
  process.stdout.write(resp);
})

let command, cmdArg;
rl.on('line', (input)=> {
  [command, ...cmdArg] = input.split(' ');
  client.emit('command', command, cmdArg);
})

module.exports = client;
