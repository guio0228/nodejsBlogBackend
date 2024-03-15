// 引入catchAsync工具函数，用于错误处理的异步函数包装器。
const httpStatus = require('http-status');
const catchAsync = require('../untils/catchAsync');

// 引入http-status库，用于引用HTTP状态码的常量，使得代码更易于理解。

// 引入services层的相关服务，这里包括userService、tokenService和authService，
// 分别用于用户管理、令牌生成和认证服务。
const { userService, tokenService, authService } = require('../services');

const register = catchAsync(async (req, res) => {
  // create a user
  const user = await userService.createUser(req.body);
  // generate token
  const tokens = await tokenService.generateAuthTokens(user.id);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password, req.connection.remoteAddress);
  // generate token
  const tokens = await tokenService.generateAuthTokens(user.id);
  res.status(httpStatus.OK).send({ user, tokens });
});

const refreshToken = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuthToken(req.body.refreshToken);
  res.status(httpStatus.OK).send({ ...tokens });
});

module.exports = {
  register,
  login,
  refreshToken,
};
