const express = require('express');
const User = require('../models/user-model');
const auth = require('../middleware/auth-middleware');
const sharp = require('sharp');
const multer = require('multer');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account');
const router = new express.Router();

// Posting on users end-point
// router.post('/users', (req, res) => {
//   const user = new User(req.body);

//   user.save().then(() => {
//     res.status(201).send(user)
//   }).catch((e) => {
//       res.status(400).send(e);
//     });
// });

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generatetAuthToken();
    res.status(201).send({ user: user.getPublicProfile(), token });
  } catch (error) {
    res.status(404).send();
  }
});

// User-login route
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generatetAuthToken();
    res.send({ user: user.getPublicProfile(), token });
    // res.send({user, token});
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// User Logout route
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// Logout from all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});
// Getting from users end-point
// router.get('/users', (req, res) => {
//   User.find({})
//     .then((users) => {
//       res.send(users);
//     })
//     .catch((error) => {
//       res.status(500).send();
//     });
// });

router.get('/users/me', auth, async (req, res) => {
  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch {
  //   res.status(500).send();
  // }
  res.send(req.user.getPublicProfile());
});

// Getting specific user
// router.get('/users/:id', (req, res) => {
//   const _id = req.params.id;
//   User.findById(_id)
//     .then((user) => {
//       if (!user) {
//         return res.status(404).send();
//       }
//       res.send(user);
//     })
//     .catch((error) => {
//       res.status(500).send(error);
//     });
// });

// Updating an user
router.patch('/users/me', auth, async (req, res) => {
  // Convert Object to Array.
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'password', 'email', 'age'];
  const isValidOperation = updates.every((update) => {
    // Validating that it is from the allowed updates or not
    allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates!' });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Delete an User
router.delete('/users/me', auth, async (req, res) => {
  const id = req.user.id;
  try {
    // const user = await User.findByIdAndDelete(id);
    // if (!user) {
    //   return res.status(404).send();
    // }
    await req.user.remove();
    sendCancelEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

const upload = multer({
  limits: { 
    fileSize: 1000000 
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.endsWith('.jpg') &&
      !file.originalname.endsWith('.jpeg') &&
      !file.originalname.endsWith('.png')) {
      return callback(
        new Error('File must be with .jpg, .jpeg, .png extension')
      );
    }
    callback(undefined, true);
  }
});

// Upload the avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer();
  req.user.avatar = buffer;
  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({error: error.message});
});

// delete the avatar
router.delete('/users/me/avatar', auth, async(req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

// Get the avatar
router.get('/users/:id/avatar', async(req,res) => {
  try{
    const user = await User.findById(req.params.id);
    if(!user || !user.avatar) {
      throw new Error();
    }
    res.sent('Content-Type', 'image/png');
    res.send(user.avatar);
  } catch {
    res.status(400).send();
  }
})

module.exports = router;
