const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
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

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne(email);

  if (!user) {
    throw new error('Unable to Login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) {
    throw new error('Unable to Login');
  }

  return user;
};

// hash the plain text schema before saving.
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// User Model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;

// const me = new User({
//   email: 'SUNNYSHH45@GMAIL.COM',
//   password: '  Password123   ',
//   name: 'Sunny    ',
// }).save()
//   .then((me) => console.log(me))
//   .catch((error) => console.log('Error:', error));
