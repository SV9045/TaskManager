const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task-model');

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
        throw new Error('Email is invalid!');
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
        throw new Error("password doesn't meet minimum security requirements");
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be positive number!');
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
},
{
  timestamps: true
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

// one way - to hide the private data
userSchema.methods.getPublicProfile = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
}

// 2nd way - to hide the private data
// userSchema.methods.toJSON = function() {
//   const user = this;
//   const userObject = user.toObject();
//   delete userObject.password;
//   delete userObject.tokens;
//   return userObject;
// }

// Accessing methods
userSchema.methods.generatetAuthToken = async function() {
  const user = this;
  const token = jwt.sign({_id: user._id.toString()}, 'thisismytoken');
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
}

// Accessing middleware
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({email});

  if (!user) {
    throw new Error('Unable to Login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if(!isMatch) {
    throw new Error('Unable to Login');
  }
  return user;
};

// Delete the tasks of users when user is removed
userSchema.pre('remove', async function(next) {
  const user = this;
  await Task.deleteMany({owner: req.user._id});
  next();
})

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
