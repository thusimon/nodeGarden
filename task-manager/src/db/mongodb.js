const mongodb = require('mongodb');
const {MongoClient, ObjectID} = mongodb;
const connectionURL = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';
const taskCollectionName = 'tasks';


const connectRes = MongoClient.connect(connectionURL, {useNewUrlParser:true});
connectRes.then(client=>{
  console.log('connected correctly');
  const db = client.db(dbName);
  const taskCollection = db.collection(taskCollectionName);
  // return taskCollection.insertMany([
  //   {description:'task1', completed:false},
  //   {description:'task2', completed:true},
  //   {description:'task3', completed:false}
  // ]);
  
  //return taskCollection.find({completed:false}).toArray();

  //return taskCollection.updateMany({}, {
  //   $set: {
  //     completed: true
  //   }
  // });

  return taskCollection.deleteMany({
    completed: true
  });
  
}).then(result => {
  console.log('operation success');
  console.log(result);
}).catch(err => {
  console.log('error occurs');
  console.log(err);
});
