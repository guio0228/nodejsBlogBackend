// 引入mongoose库，用于操作MongoDB数据库。
const mongoose = require('mongoose');
// 引入bcryptjs库，用于密码的哈希处理。
const bcrypt = require('bcryptjs');

// 定义用户的schema，即用户数据结构和验证规则。
const userSchema = mongoose.Schema(
  {
    // 用户名字段，必填，去除两端空格。
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // 电子邮箱字段，必填，唯一，去除两端空格，转换为小写，并进行格式验证。
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        // 使用正则表达式验证电子邮箱格式。
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    // 密码字段，必填，去除两端空格，最小长度为8，自定义验证规则。
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        // 正则表达式验证密码必须包含至少一个小写字母、一个大写字母和一个数字，且至少8个字符。
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(value)) {
          throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long without special characters.');
        }
      },
    },
    role: {
      type: String,
      enum: ['admin', 'member', 'guest'],
      default: 'guest',
    },
  },
  {
    // 启用时间戳，自动记录创建和更新的时间。
    timestamps: true,
  }
);

// 定义一个静态方法，用于检查电子邮箱是否已经被注册。
userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

// 在保存用户之前自动哈希处理密码。
userSchema.pre('save', async function (next) {
  const user = this;
  // 如果密码被修改了，才进行哈希处理。
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// 定义一个实例方法，用于验证提供的密码与用户密码是否匹配。
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

// 创建User模型，绑定"user"集合和userSchema。
const User = mongoose.model('User', userSchema);

// 导出User模型，使其可以在其他部分的应用中被引入和使用。
module.exports = User;
