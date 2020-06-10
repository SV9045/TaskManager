const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';
const ObjectID = mongodb.ObjectID;
const id = new ObjectID();

// console.log(id.id.length);

mongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log('Unable to Connect Database');
    }

    const db = client.db(databaseName);

    db.collection('users').findOne({ name: 'Prachi' }, (error, user) => {
      if (error) {
        console.log('Error');
      }
      console.log(user);
    });

    db.collection('users')
      .find({ age: 26 })
      .toArray((error, users) => {
        console.log(users);
      });

    db.collection('users')
      .find({ age: 27 })
      .count((error, count) => {
        console.log(count);
      });

    db.collection('users').find({ age: 26 }).limit(1);

    // Adding to the users collection.
    // db.collection('users').insertOne(
    //   {
    //     _id: id,
    //     name: 'Andrew',
    //     age: 26,
    //   },
    //   (error, result) => {
    //     if (error) {
    //       return console.log('Unable to insert User');
    //     }
    //     console.log(result.ops);
    //   });

    // db.collection('users').insertMany(
    //   [
    //     {
    //       name: 'Sunny',
    //       age: 26,
    //     },
    //     {
    //       name: 'Prachi',
    //       age: 27,
    //     },
    //   ],
    //   (error, result) => {
    //     if (error) {
    //       return console.log('Unable to insert Documents');
    //     }
    //     console.log(result.ops);
    //   }
    // );

    // Adding to the tasks collection.
    // db.collection('tasks').insertMany([
    //   {
    //     description: 'small',
    //     completed: false,
    //   },
    //   {
    //     description: 'large',
    //     completed: true,
    //   },
    //   {
    //     description: 'X large',
    //     completed: true,
    //   }
    // ],(error, result) => {
    //   if(error) {
    //     return console.log('uanble to connect');
    //   }

    //   console.log(result.ops);
    // });

    db.collection('tasks').findOne(
      { _id: new ObjectID('5edfff860161551bf0459636') },
      (error, task) => { console.log(task) }
    );

    db.collection('tasks')
      .find({ completed: false })
      .toArray((error, tasks) => {
        console.log(tasks);
      });
  }
);
