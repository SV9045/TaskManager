const express = require('express');
require('./database/mongoose');
const userRouter = require('./routers/user-router');
const taskRouter = require('./routers/task-router');

const app = express();
const port = process.env.PORT || 3000;
// app.use((req, res, next) => {
//   console.log(req.method, req.path);
//   if (req.method === 'GET') {
//     res.send('GET methods are disabled');
//   } else {
//     next();
//   }
// });
// app.use((req, res, next) => {
//   res.status(503).send('Site is Currently down, please try again later');
// })
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});

const Task = require('./models/task-model');
const User = require('./models/task-model');

const main = async() => {
  // find owner by task ID
  // const task = await Task.findById('5eec3c63181c971cc84511da');
  // await task.populate('owner').execPopulate();
  // console.log(task.owner);

  // 
  const user = await User.findById('5eec3b352a9efa0cf00761b4');
}

main();