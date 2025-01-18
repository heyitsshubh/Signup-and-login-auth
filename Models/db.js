const mongoose = require('mongoose');

const connect = process.env.MONGO_URI;
mongoose.connect(connect)
  .then(() => console.log('Connected!'))
  .catch((err) => console.error('Connection error:', err));
