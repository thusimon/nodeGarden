const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const dbName = 'task-manager';
mongoose.connect('mongodb://127.0.0.1:27017/' + dbName, {
  useNewUrlParser: true,
  useCreateIndex: true
});

// mongoose use model name, convert to lowercase and pluralize it
// so User will go to collection users
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)){
        throw new Error('Invalid Email')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate(value) {
      if(value.toLowerCase().includes('password')){
        throw new Error('password should NOT contain "password"');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if(value < 0) {
        throw new Error('Age must be positive');
      }
    }
  }
});

const User = mongoose.model('User', userSchema);

const taskSchema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
})
const Task = mongoose.model('Task', taskSchema);

// create a user instance
const user = new User({
  name: 'Mike',
  email: 'mike@gmail.com',
  age: 20,
  password:'1234567'
});

/*
user.save().then(() => {
  console.log(user);
}).catch(err => {
  console.log(err);
});
*/

// create a task instance
const task = new Task({
  description: 'Learn Mongoose Lib'
});

task.save().then(()=>{
  console.log(task);
}).catch(err => {
  console.log(err);
})

