import request from '@/utils/request';

// 用户注册
// { name, telephone, password }为要传给后端的数据的结构体变量
// post中的路径与后端对于功能处理函数的路由后缀保持一致，前缀已在环境变量中定义
// 添加新的函数记得在下方export default中添加导出
const register = ({ name, phone, password }) => {
  return request.post('auth/register', { name, phone, password });
};

// 用户登录
const login = ({ phone, password }) => {
  return request.post('auth/login', { phone, password });
};

// 发帖
const post = ({
  phone,
  title,
  ptext,
  partition,
}) => {
  return request.post('auth/post', {
    phone,
    title,
    ptext,
    partition,
  });
};

// 看帖
const browse = ({ userTelephone, partition }) => {
  return request.post('auth/browse', { userTelephone, partition });
};

// 点赞
const like = ({ userTelephone, postID, isLiked }) => {
  return request.post('auth/updateLike', { userTelephone, postID, isLiked });
};

// 收藏
const save = ({ userTelephone, postID, isSaved }) => {
  return request.post('auth/updateSave', { userTelephone, postID, isSaved });
};

// 获取帖子详情
const showDetails = ({ postId }) => {
  return request.post('auth/showDetails', { postId });
};

// 获取用户信息
const info = () => {
  return request.get('auth/info');
};

export default {
  register,
  login,
  post,
  browse,
  like,
  showDetails,
  info,
  save,
};
