// 引入jsonwebtoken库，用于生成JWT（JSON Web Tokens）。
const jwt = require('jsonwebtoken');
// 引入dayjs库，一个轻量级的时间库，用于处理时间和日期。
const dayjs = require('dayjs');
// 引入配置文件，其中包含JWT的密钥和令牌过期时间等配置。
const config = require('../config/config');
const { Token } = require('../models');
// 引入令牌类型配置，定义了access token和refresh token的类型。
const { tokenTypes } = require('../config/tokens');

/**
 * 生成一个JWT令牌。
 *
 * @param {string} userId - 用户的唯一标识符。
 * @param {object} expires - 令牌的过期时间，是一个dayjs对象。
 * @param {string} type - 令牌的类型（例如，access或refresh）。
 * @param {string} [secret=config.jwt.secret] - 用于签名令牌的密钥，默认使用配置文件中的密钥。
 * @returns {string} - 返回签名的JWT令牌。
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const generatToken = (userId, expires, type, secret = config.jwt.secret) => {
  // 创建令牌的载荷（payload），包含用户ID、令牌类型、签发时间和过期时间。
  const payload = {
    sub: userId, // subject，指令牌的主题，这里使用用户ID。
    iat: dayjs().unix(), // issued at，令牌的签发时间。
    exp: expires.unix(), // expiration time，令牌的过期时间。
    type, // 令牌的类型，如access或refresh。
  };

  // 使用jsonwebtoken的sign方法生成JWT令牌。
  return jwt.sign(payload, secret);
};

/**
 * 为用户生成access token和refresh token。
 *
 * @param {string} userId - 用户的唯一标识符。
 * @returns {object} - 包含access token和refresh token及其过期时间的对象。
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token, user: payload.sub, type, blacklisted: false,
  });

  if (!tokenDoc) {
    throw new Error('Token not found');
  }

  return tokenDoc;
};

const generateAuthTokens = (userId) => {
  // 为访问令牌生成过期时间。
  const accessTokenExpires = dayjs().add(config.jwt.accessExpirationMinutes, 'minutes');
  // 生成访问令牌。
  const accessToken = generatToken(userId, accessTokenExpires, tokenTypes.ACCESS);

  // 为刷新令牌生成过期时间。
  const refreshTokenExpires = dayjs().add(config.jwt.refreshExpirationDays, 'days');
  // 生成刷新令牌。
  const refreshToken = generatToken(userId, refreshTokenExpires, tokenTypes.REFRESH);
  saveToken(refreshToken, userId, refreshTokenExpires, tokenTypes.REFRESH);
  // 返回包含两种令牌及其过期时间的对象。
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

// 导出generateAuthTokens和generatToken函数，以便在其他模块中使用。
module.exports = {
  generateAuthTokens,
  generatToken,
  verifyToken,
  saveToken,
};
