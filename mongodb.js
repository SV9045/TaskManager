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

    // Adding to the users collection.
    db.collection('users').insertOne(
      {
        _id: id,
        name: 'Sunny',
        age: 26,
      },
      (error, result) => {
        if (error) {
          return console.log('Unable to insert User');
        }
        console.log(result.ops);
      }
    );

    db.collection('users').insertMany(
      [
        {
          name: 'Sunny',
          age: 26,
        },
        {
          name: 'Prachi',
          age: 27,
        },
      ],
      (error, result) => {
        if (error) {
          return console.log('Unable to insert Documents');
        }
        console.log(result.ops);
      }
    );

    // Adding to the tasks collection.
    db.collection('tasks').insertMany([
      {
        description: 'small',
        completed: false,
      },
      {
        description: 'large',
        completed: true,
      },
      {
        description: 'X large',
        completed: true,
      }
    ],(error, result) => {
      if(error) {
        return console.log('uanble to connect');
      }
      console.log(result.ops);
    });

    // Find One Document from users collection
    db.collection('users').findOne({ name: 'Prachi' }, (error, user) => {
      if (error) {
        console.log('Error');
      }
      console.log(user);
    });

    // Find Documents from users collection
    db.collection('users')
      .find({ age: 26 })
      .toArray((error, users) => {
        console.log(users);
      });

    // Count Documents from users collection
    db.collection('users')
      .find({ age: 27 })
      .count((error, count) => {
        console.log(count);
      });

    // Find One task from Collection
    db.collection('tasks').findOne(
      { _id: new ObjectID('5edfff860161551bf0459636') },
      (error, task) => {
        console.log(task);
      }
    );

    // Find all the incompelete tasks from collection
    db.collection('tasks')
      .find({ completed: false })
      .toArray((error, tasks) => {
        console.log(tasks);
      });

    // Update One Document
    db.collection('users')
      .updateOne(
        { _id: new ObjectID('5ee0583a80f2c72404973085') },
        {
          $set: {
            name: 'Prachi',
            age: 23
          }
        }
      )
      .then((result) => console.log(result))
      .catch((error) => console.log(error));

    // Updating age with $inc operator
    db.collection('users')
      .updateOne(
        { name: 'Prachi'},
        {
          $inc: {
            age: 1
          }
        }
      )
      .then((result) => console.log(result))
      .catch((error) => console.log(error));

    // Update all the incompleted documents.
    db.collection('tasks')
      .updateMany(
        { completed: true },
        {
          $set: {
            completed: false
          }
        }
      )
      .then((result) => console.log(result))
      .catch((error) => console.log(error));

    // Delete the documents
    db.collection('users')
      .deleteMany({
        age: 26,
      })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));

    db.collection('tasks')
      .deleteOne({ _id: new ObjectID('5edfff860161551bf0459635') })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }
);
