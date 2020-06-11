const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
});

// User Model
const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new error('Email is invalid!');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new error("password doesn't meet minimum security requirements");
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new error('Age must be positive number!');
      }
    }
  }
});

const me = new User({
  email: 'SUNNYSHH45@GMAIL.COM',
  password: '  Password123   ',
  name: 'Sunny    ',
}).save()
  .then((me) => console.log(me))
  .catch((error) => console.log('Error:', error));

// Tasks Model
const Task = mongoose.model('Task', {
  description: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const task  = new Task({
  description: '1st task done',
  completed: true
}).save()
  .then((task) => console.log(task))
  .catch((error) => console.log(error))
