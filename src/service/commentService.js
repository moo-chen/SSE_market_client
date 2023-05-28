// eslint-disable-next-line import/no-cycle
import request from '@/utils/request';

// 获取帖子评论和帖子评论的评论
const showPcomments = ({ userTelephone, postID }) => {
  return request.post('auth/showPcomments', { userTelephone, postID });
};

// 对帖子评论
const postPcomment = ({ userTelephone, postID, content }) => {
  return request.post('auth/postPcomment', { userTelephone, postID, content });
};

// 对评论进行评论或回复评论的评论
const postCcomment = ({
  userTelephone, postID, pcommentID, content, userTargetName,
}) => {
  return request.post('auth/postCcomment', {
    userTelephone, postID, pcommentID, content, userTargetName,
  });
};

// 帖子评论点赞
const pcommentLike = ({ userTelephone, pcommentID, isLiked }) => {
  return request.post('auth/updatePcommentLike', { userTelephone, pcommentID, isLiked });
};
// 评论的评论点赞
const ccommentLike = ({ userTelephone, ccommentID, isLiked }) => {
  return request.post('auth/updateCcommentLike', { userTelephone, ccommentID, isLiked });
};
export default {
  showPcomments,
  postPcomment,
  postCcomment,
  pcommentLike,
  ccommentLike,
};
