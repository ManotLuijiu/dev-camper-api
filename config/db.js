const mongoose = require('mongoose');
const logger = require('../util/logger');

const source = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(source, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    // console.log(conn);
    logger.info(`MongoDB Connected: ${conn.connection.host}`.green);
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = connectDB;
