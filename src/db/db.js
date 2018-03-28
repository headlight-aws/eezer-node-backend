import mongoose from 'mongoose';
import getConfig from '../config/config';

const config = getConfig();

module.exports = {
  connect: () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(`mongodb://${config.dbuser}:${config.dbpass}@${config.dbUrl}`, {
      useMongoClient: true,
      keepAlive: true,
      reconnectTries: Number.MAX_VALUE
      /* other options */
    });
  },
};
