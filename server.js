const express = require('express');

const app = express(); // 創建實例
const httpStatus = require('http-status');
const passport = require('passport');
const { xss } = require('express-xss-sanitizer');
const helmet = require('helmet');
const cors = require('cors');
const { errorHandler, errorConverter } = require('./middlewares/error.js');
const blogRouter = require('./router/blog.route.js');
const authRouter = require('./router/auth.route.js');
const ApiError = require('./untils/ApiError.js');
const morgan = require('./config/morgan.js');
const { jwtStrategy } = require('./config/passport.js');
const { cspOptions } = require('./config/config.js');

app.use(cors());
app.use(morgan.successHandler);
app.use(morgan.errorHandler);
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use(express.json());
app.use(xss());
app.use(
  helmet({
    contentSecurityPolicy: cspOptions,
  }),
);

app.use(blogRouter);
app.use(authRouter);
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not Found'));
});

app.use(errorConverter);
app.use(errorHandler);
module.exports = app;
