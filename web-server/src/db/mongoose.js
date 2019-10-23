const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/node-garden';

mongoose.connect(CONNECTION_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log(`Connected to mongoDB to ${CONNECTION_URI}`);
}).catch(err => {
  console.log(err);
});