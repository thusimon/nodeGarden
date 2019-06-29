const fs = require('fs');
const chalk = require('chalk');

const loadNotes = () => {
  const notesData = fs.readFileSync('notes.json', 'utf8');
  try {
    return JSON.parse(notesData);
  } catch(e){
    return [];
  }
}

const saveNotes = (notesData) => {
  fs.writeFileSync('notes.json', JSON.stringify(notesData, null, 2));
}

const addNote = (title, body) =>{
  const curNotes = loadNotes();
  const duplicateNote = curNotes.find(note=>note.title===title);
  if(!duplicateNote){
    // no duplicate notes
    curNotes.push({
      title,
      body
    });
    saveNotes(curNotes);
    console.log(chalk.green(`Note "${title}" is added`));
  } else {
    console.log(chalk.red(`Note "${title}" is already taken!`));
  }
}

const removeNote = (title) => {
  const curNotes = loadNotes();
  const notesToKeep = curNotes.filter(note => note.title != title);
  if (curNotes.length > notesToKeep.length) {
    saveNotes(notesToKeep);
    console.log(chalk.green(`Note ${title} is removed!`));
  } else {
    console.log(chalk.red(`No note is removed.`));
  }
}

const listNotes = () => {
  const curNotes = loadNotes();
  console.log(chalk.green.inverse('Your Notes:'));
  curNotes.forEach(note => {
    console.log(chalk.red('Title: ') + `${note.title}`);
  });
}

const readNote = (title) => {
  const curNotes = loadNotes();
  console.log(chalk.green.inverse('Your Note:'));
  const note = curNotes.find(note => note.title === title);
  if (note){
    console.log(
      chalk.red('Title: ') +
      `${title}\t` +
      chalk.blue('Content: ') +
      `${note.body}`);
  } else {
    console.log(chalk.red(`No such note: ${title}`));
  }
}
module.exports = {
  addNote,
  removeNote,
  listNotes,
  readNote
};