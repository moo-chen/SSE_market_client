// eslint-disable-next-line import/no-cycle
import request from '@/utils/request';

// 发帖
const post = ({
  userTelephone,
  title,
  content,
  partition,
  photos,
}) => {
  return request.post('auth/post', {
    userTelephone,
    title,
    content,
    partition,
    photos,
  });
};

// 看帖
const browse = ({ userTelephone, partition, searchinfo }) => {
  return request.post('auth/browse', { userTelephone, partition, searchinfo });
};

// 帖子点赞
const like = ({ userTelephone, postID, isLiked }) => {
  return request.post('auth/updateLike', { userTelephone, postID, isLiked });
};

const deletepost = ({ postID }) => {
  return request.post('auth/deletePost', { postID });
};

const submitreport = ({
  TargetID, Targettype, userTelephone, Reason,
}) => {
  return request.post('auth/submitReport', {
    TargetID, Targettype, userTelephone, Reason,
  });
};

// 获取帖子详情
const showDetails = ({ userTelephone, postID }) => {
  return request.post('auth/showDetails', { userTelephone, postID });
};

const submitFeedback = ({ ftext, attachment }) => {
  return request.post('auth/submitFeedback', { ftext, attachment });
};

// 更新浏览次数
const updatebrowse = ({ userTelephone, postID }) => {
  return request.post('auth/updateBrowseNum', { userTelephone, postID });
};

// 热火榜
const calculateheat = ({
  postID,
  title,
  heat,
}) => {
  return request.get('auth/calculateHeat', {
    postID,
    title,
    heat,
  });
};

export default {
  post,
  browse,
  like,
  deletepost,
  submitreport,
  showDetails,
  submitFeedback,
  updatebrowse,
  calculateheat,
};
