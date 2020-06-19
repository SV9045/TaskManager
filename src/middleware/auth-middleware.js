const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

const auth = async (req, res, next) => {
  try{
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'thisismytoken');
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token});
    
    if(!user) {
      throw new Error();
    }
    // getting user here.
    req.token = token;
    req.user = user;
    next();
    // console.log(token);
  } catch(error){
    console.log(error);
    res.status(401).send({error: 'You are not authenticated'});
  }
}

module.exports = auth;
