const mongoose = require('mongoose');
const validator = require('validator');

// User Model
const UserModel = mongoose.model('User', {
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
        throw new error('password doesn\'t meet minimum security requirements');
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

module.exports = UserModel;

// const me = new User({
//   email: 'SUNNYSHH45@GMAIL.COM',
//   password: '  Password123   ',
//   name: 'Sunny    ',
// }).save()
//   .then((me) => console.log(me))
//   .catch((error) => console.log('Error:', error));