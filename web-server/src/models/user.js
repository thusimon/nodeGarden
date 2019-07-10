const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

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

module.exports = User;