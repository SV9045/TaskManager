const express = require('express');
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
router.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

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

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
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

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch {
    res.status(500).send();
  }
});

// Updating a task
router.patch('/tasks/:id', async (req, res) => {
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
    const task = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(404).send(error);
  }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const task = await Task.findByIdAndDelete(id);

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