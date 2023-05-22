import request from '@/utils/request';

// 发帖
const post = ({
  userTelephone,
  title,
  content,
  partition,
}) => {
  return request.post('auth/post', {
    userTelephone,
    title,
    content,
    partition,
  });
};

// 看帖
const browse = ({ userTelephone, partition }) => {
  return request.post('auth/browse', { userTelephone, partition });
};

// 帖子点赞
const like = ({ userTelephone, postID, isLiked }) => {
  return request.post('auth/updateLike', { userTelephone, postID, isLiked });
};

// 获取帖子详情
const showDetails = ({ userTelephone, postID }) => {
  return request.post('auth/showDetails', { userTelephone, postID });
};

export default {
  post,
  browse,
  like,
  showDetails,

};
