const mongoose = require('mongoose');

// Tasks Model
const TaskModel = mongoose.model('Task', {
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'}
});

// const task  = new Task({
//   description: '1st task done',
//   completed: true
// }).save()
//   .then((task) => console.log(task))
//   .catch((error) => console.log(error))

module.exports = TaskModel;