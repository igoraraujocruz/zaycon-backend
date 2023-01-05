import mongoose from 'mongoose'
require('dotenv/config');

console.log(process.env.MONGODB_USER, process.env.MONGODB_PASS)

mongoose.connect(
  `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@0.0.0.0:27017`,
  {
    useNewUrlParser: true,
  }
)

mongoose.connection.on('error', () => console.error('connection error:'))
mongoose.connection.once('open', () => console.log('database connected'))