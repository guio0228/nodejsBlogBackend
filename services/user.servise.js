const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../untils/ApiError');

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(userBody);
  return user;
};

const getUserbyemail = async (email) => await User.findOne({ email });
const getUserByid = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      // 处理用户不存在的情况
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  } catch (error) {
    // 处理查询过程中可能发生的错误
    console.error(`Error fetching user by id ${id}:`, error);
    throw error; // 可以重新抛出错误或返回特定错误信息
  }
};

module.exports = {
  createUser,
  getUserbyemail,
  getUserByid,
};
