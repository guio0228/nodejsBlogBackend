const password = (value, helpers) => {
  // 定義正則表達式
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // 使用正則表達式檢查密碼
  if (!regex.test(value)) {
    return helpers.message('至少一大寫、一小寫字母和數字 長度大於8 不包含特殊字符');
  }
  return value;
};

module.exports = {
  password,
};
