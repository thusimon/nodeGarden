const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if(value.length<=2){
        throw new Error('Task description too short');
      }
    }
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps:true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;