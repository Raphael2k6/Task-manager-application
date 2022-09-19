// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectId

const { MongoClient, ObjectId, Db } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("Uable to connect to database");
    }
    const db = client.db(databaseName);

    // db.collection('users').insertOne({
    //     name: 'Raphael',
    //     age: 27
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.insertedId)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 28
    //     },
    //     {
    //         name: 'Gunter',
    //         age: 24
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert documents')
    //     }
    //     console.log(result.insertedCount)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Read a book',
    //         completed: true
    //     },
    //     {
    //         description: 'Cook a goat',
    //         completed: false
    //     },
    //     {
    //         description: 'Wash a car',
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert documents')
    //     }
    //     console.log(result)
    // })

    // db.collection('users').findOne({_id: new ObjectId("62d93668cf7947bae3955b39")}, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch');
    //     }
    //     console.log(user)
    // })

    db.collection("tasks").findOne(
      { _id: new ObjectId("62f3b7cdc85faed37bb353af") },
      (error, tasks) => {
        if (error) {
          return console.log("Unable to fetch record");
        }
        console.log(tasks);
      }
    );
    db.collection("tasks")
      .find({ completed: false })
      .toArray((error, tasks) => {
        if (error) {
          return console.log("Unable to fetch record");
        }
        console.log(tasks);
      });

    // db.collection("users").find({age: 27} ).count((error, users) => {
    //     if (error) {
    //         console.log("Unable to get users")
    //     }
    //     console.log(users);
    // })

    db.collection("users")
      .updateOne(
        { _id: new ObjectId("62d81b8de30de092628128f3") },
        {
          $set: {
            name: "Mathews",
          },
          $inc: {
            age: 21,
          },
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });

    db.collection("tasks")

      .updateMany(
        { completed: false },
        {
          $set: {
            completed: true,
          },
        }
      )
      .then((result) => {
        console.log(result.modifiedCount);
      })
      .catch((error) => {
        console.log(error);
      });

    // db.collection("tasks")
    //   .updateMany(
    //     { }, { $unset: { false: ""}}
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    db.collection("users")
      .deleteMany({ age: 27 })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
    db.collection("tasks")
      .deleteOne({ description: "Wash a car" })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }
);
