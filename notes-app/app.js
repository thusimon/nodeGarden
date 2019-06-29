const fs = require('fs');
const validator = require('validator');
const os = require('os');
const yargs = require('yargs');

// console.log(require.main);
// console.log(module);
// console.log(require.main == module);

// fs.writeFileSync('note.txt', 'My name is lu.');
// fs.appendFileSync('note.txt', 'Hello!\r\n');
// let startTime = Date.now();

// let content = '';
// for(let i=0; i<10; i++) {
//     content += i+'\r\n';
// }
// fs.appendFileSync('note.txt', content);

// let endTime = Date.now();
// let elapseTime = endTime-startTime;
// console.log(`It took ${elapseTime} ms`);

const {add, curryAdd, curry2} = require('./util');
var sum1 = add(1,2);
var sum2 = curryAdd(1)(2);
var sum3 = curry2((a, b)=>a+b, 1)(2);

// let email = 'thusimon@g.com';
// console.log(`${email} is email? ${validator.isEmail(email)}`);
// let url = 'localhost:3004/test';
// console.log(`${url} is url? ${validator.isEmail(url)}`);

const chalk = require('chalk');
const log = console.log;
 
// Combine styled and normal strings
log(chalk.blue('Welcome to ') + chalk.red.bold('Note-App') + chalk.blue('!'));
 
// Compose multiple styles using the chainable API
//log(chalk.blue.bgRed.bold('Hello world!'));
 
// Pass in multiple arguments
//log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));
 
// Nest styles
//log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));
 
// Nest styles of the same type even (color, underline, background)
// log(chalk.green(
//     'I am a green line ' +
//     chalk.blue.underline.bold('with a blue substring') +
//     ' that becomes green again!'
// ));
 
// ES2015 template literal
const memUsage = function () {
  return (os.freemem() / os.totalmem() *100).toFixed(2) + '%';
}
const cpuUsage = function cpuAverage() {
  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus(); 
  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) {
    //Select CPU core
    var cpu = cpus[i];
    //Total up the time in the cores tick
    for(type in cpu.times) {
      totalTick += cpu.times[type];
    }     
    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }
  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

const curCPUUsage = cpuUsage();
log(`
CPU: ${chalk.red((100-curCPUUsage.idle/curCPUUsage.total*100).toFixed(2)+'%')}
RAM: ${chalk.green(memUsage())}
DISK: ${chalk.yellow('70%')}
`);
 
// ES2015 tagged template literal
// log(chalk`
// CPU: {red ${cpu.totalPercent}%}
// RAM: {green ${ram.used / ram.total * 100}%}
// DISK: {rgb(255,131,0) ${disk.used / disk.total * 100}%}
// `);
 
// Use RGB colors in terminal emulators that support it.
// log(chalk.keyword('orange')('Yay for orange colored text!'));
// log(chalk.rgb(123, 45, 67).underline('Underlined reddish color'));
// log(chalk.hex('#DEADED').bold('Bold gray!'));

function highlight(strings, ...values) {
  let str = '';
  strings.forEach((string, i) => {
    str += `${string} <span class='hl'>${values[i] || ''}</span>`;
  });
  return str;
}

const name = 'Snickers';
const age = '100';
const sentence = highlight`My dog's name is ${name} and he is ${age} years old`;
//console.log(sentence);

const note = require('./note');
if (!fs.existsSync('notes.json')){
    fs.openSync('notes.json', 'w');
}
yargs.version('1.1.0');
const yargsConfig = {
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note content',
            type: 'string'
        }
    }
};

// add remove read list
// create add command
const yargsAdd = Object.assign(yargsConfig, 
    {
        command: 'add',
        describe: 'Add a new note',
        handler(argv) {
            return note.addNote(argv.title, argv.body);
        }
    });
yargs.command(yargsAdd);
// create remove command
const yargsRemove = Object.assign(yargsConfig, 
    {
        command: 'remove',
        describe: 'Remove a note',
        handler(argv) {
            return note.removeNote(argv.title);
        }
    });
yargs.command(yargsRemove);
// create list command
const yargsList = Object.assign(yargsConfig, 
    {
        command: 'list',
        describe: 'List all the notes',
        handler() {
            return note.listNotes();
        },
        builder: {}
    });
yargs.command(yargsList);
// create read command
const yargsRead = Object.assign(yargsConfig, 
    {
        command: 'read',
        describe: 'Read a note',
        handler(argv) {
            return note.readNote(argv.title);
        }
    });
yargs.command(yargsRead);

yargs.parse();
