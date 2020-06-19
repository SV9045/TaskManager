const express = require('express');
const auth = require('../middleware/auth-middleware');
const Task = require('../models/task-model');
const router = new express.Router();

// Creating a task
// router.post('/tasks', (req, res) => {
//   const task = new Task(req.body);

//   task
//     .save()
//     .then(() => {
//       res.status(201).send(task);
//     })
//     .catch((e) => {
//       res.status(400).send(e);
//     });
// });
router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  
  try {
    await task.save();
    res.status(201).send(task);
  } catch {
    res.status(500).send();
  }
});

// Getting tasks
// router.get('/tasks', (req, res) => {
//   Task.find({})
//     .then((tasks) => {
//       res.send(tasks);
//     })
//     .catch((error) => {
//       res.status(500).send();
//     });
// });

router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({owner: req.user._id});
    res.send(tasks);
  } catch {
    res.status(500).send();
  }
});

//  Getting specific task
// router.get('/tasks/:id', (req, res) => {
//   const _id = req.params.id;
//   Task.findById(_id)
//     .then((task) => {
//       if (!task) {
//         return res.status(404).send();
//       }
//       res.send(task);
//     })
//     .catch((error) => {
//       res.status(500).send();
//     });
// });

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({_id, owner: req.user._id})
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch {
    res.status(500).send();
  }
});

// Updating a task
router.patch('/tasks/:id', auth, async (req, res) => {
  const taskUpdates = Object.keys(req.body);
  const allowedTaskUpdates = ['description', 'completed'];
  const isValidTask = taskUpdates.every((updateTask) =>
    allowedTaskUpdates.includes(updateTask)
  );

  if (!isValidTask) {
    return res.status(400).send({ error: 'Invalid Updates!' });
  }

  try {
    const id = req.params.id;
    const task= await Task.findOneAndUpdate({_id: id, owner: req.user._id})
    // const task = await Task.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    if (!task) {
      return res.status(404).send();
    }
    taskUpdates.forEach((update) => task[update] = req.body[update]);
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(404).send(error);
  }
});

// Delete a task
router.delete('/tasks/:id', auth, async (req, res) => {
  const id = req.params.id;
  const task = await Task.findOneAndDelete({_id: id, owner: req.user._id});

  try {
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
