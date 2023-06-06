// 定义手机号规则
const telephoneValidator = (value) => /^1[3|4|5|7|8]\d{9}$/.test(value);

// 定义邮箱规则
const emailValidator = (value) => /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value);

export default {
  telephoneValidator,
  emailValidator,
};
