const EventEmitter = require('events');

class Server extends EventEmitter {
  constructor(client){
    super();
    this.id = 'server';
    this.tasks = {};
    client.on('command', this._commandHandler.bind(this));
    process.nextTick(()=>{
      this.emit('response', 'server started, please input...\r\n');
    })
  }
  _commandHandler(command, args){
    switch (command) {
      case 'add':
      case 'remove':
      case 'list':
      case 'update':
      case 'help':
      case 'exit':
        this[command](args);
        break;
      default:
        this.emit('response', 'Unknown command...\r\n');
    }
  }
  add(args){
    const content = args.join(' ');
    const taskLen = Object.keys(this.tasks).length;
    this.tasks[taskLen+1] = content;
    this.emit('response', `Task ${taskLen+1} added: ${content}\r\n`);
  }
  remove(args){
    const id = args[0];
    delete this.tasks[id];
    this.emit('response', `Task ${id} is deleted\r\n`);
  }
  list(args){
    const allTasks = Object.keys(this.tasks).reduce((acc, cur)=>{
      const curTask = this.tasks[cur];
      const curTaskStr = `${cur}: ${curTask}\r\n`;
      return acc+curTaskStr;
    }, '')
    this.emit('response', allTasks);
  }
  update(args){
    const id = args[0];
    const content = args.slice(1).join(' ');
    if (this.tasks[id]){
      this.tasks[id] = content;
      this.emit('response', `task ${id} is updated: ${content}\r\n`);
    } else {
      this.emit('response', `can not update task ${id}, use add\r\n`);
    }
  }
  help(args){
    this.emit('response', 
`
  add: add task;
  update: update task by id;
  list: list all tasks;
  remove: remove task by id;
  exit: quit;
`);
  }
  exit(args){
    this.emit('response', 'Thank you, bye\r\n');
    process.exit(0);
  }
}

module.exports = (client)=>new Server(client);
