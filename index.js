const mongoose = require('mongoose');
const http = require('http');
const config = require('./config/config.js');
const app = require('./server.js');
const logger = require('./config/logger.js');

mongoose
  .connect(config.dbConnection)
  .then(() => {
    logger.info('mongo connect');
  })
  .catch((err) => logger.error(err));

const httpServer = http.createServer(app);
const server = httpServer.listen(config.port, () => {
  logger.info(`http://localhost:${config.port}`);
});
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const uncaughtExceptionHandler = (error) => {
  logger.error(error);
  exitHandler();
};
process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', uncaughtExceptionHandler);
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
