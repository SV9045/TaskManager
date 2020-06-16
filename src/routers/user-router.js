const express = require('express');
const User = require('../models/user-model');
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
    res.status(201).send(user);
  } catch (error) {
    res.status(404).send();
  }
});

// User-login route
router.post('/users/login', async(req,res) => {
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password);
    res.send(user);
  }catch(error){
    res.status(400).send();
  }
})

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

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch {
    res.status(500).send();
  }
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

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch {
    res.status(500).send();
  }
});

// Updating an user
router.patch('/users/:id', async (req, res) => {
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
    const user = await User.findById(req.params.id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete an User
router.delete('/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
