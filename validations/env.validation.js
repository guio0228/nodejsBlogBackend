// 引入Joi库，用于数据验证。Joi是一个强大的数据验证库，支持多种类型的验证。
const joi = require('joi');

// 定义envVarSchema，这是一个Joi对象模式，用于验证环境变量。
const envVarSchema = joi
  .object({
    DB_CONNECTION: joi.string().required(),

    // 定义PORT环境变量。它必须是一个正数。
    // 如果未设置，将默认使用3000。这个环境变量通常用于定义应用监听的端口号。
    PORT: joi.number().positive().default(3000),
  })
  .unknown(); // .unknown()允许对象包含未在模式中明确定义的键。
// 这意味着如果有额外的环境变量未在此模式中定义，验证时不会报错。

// 导出envVarSchema，这样它就可以在应用的其他部分导入并使用了。
// 通常，在应用启动时使用这个模式来验证环境变量，确保必要的变量已正确设置，
// 并且符合预期的格式。
module.exports = envVarSchema;
