const Joi = require('joi');
const { password } = require('./custom.validation');
// 定义loginSchema对象，用于验证登录请求体（body）的结构和内容。
const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
const refreshTokenSchema = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};
module.exports = {
  loginSchema,
  refreshTokenSchema,
};
