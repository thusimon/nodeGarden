const fs = require('fs');

const book = {
  title: 'HAHA',
  author: 'Lu'
}

const bookJSON = JSON.stringify(book);

const data = fs.readFileSync('1.json','utf8');
console.log(data);