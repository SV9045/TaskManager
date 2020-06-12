const express = require('express');
require('./database/mongoose');
const User = require('./models/user-model');
const Task = require('./models/task-model');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Posting on users end-point
app.post('/users', (req, res) => {
  const user = new User(req.body);

  user.save().then(() => {
    res.status(201).send(user)
  }).catch((e) => {
      res.status(400).send(e);
    });
});

// Getting from users end-point
app.get('/users', (req,res) =>{
  User.find({}).then((users) => {
    res.send(users);
  }).catch((error) => {
    res.status(500).send();
  })
});

// Getting specific user
app.get('/users/:id', (req,res) => {
  const _id = req.params.id;
  User.findById(_id).then((user) => {
    if(!user) {
      return res.status(404).send();
    }
    res.send(user);
  }).catch((error) => {
    res.status(500).send(error);
  })
})

// Creating a task
app.post('/tasks', (req, res) => {
  const task = new Task(req.body);

  task.save().then(() => {
      res.status(201).send(task);
    }).catch((e) => {
      res.status(400).send(e)
    });
});

// Getting tasks
app.get('/tasks', (req,res) => {
  Task.find({}).then((tasks) => {
    res.send(tasks);
  }).catch((error) => {
    res.status(500).send();
  })
})

//  Getting specific task
app.get('/tasks/:id', (req,res) => {
  const _id = req.params.id;
  Task.findById(_id).then((task) =>{
    if(!task) {
      return res.status(404).send();
    }
    res.send(task);
  }).catch((error) => {
    res.status(500).send();
  })
})

app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});
