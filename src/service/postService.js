// eslint-disable-next-line import/no-cycle
import request from '@/utils/request';

// 发帖
const post = ({
  userTelephone,
  title,
  content,
  partition,
  photos,
  tagList,
}) => {
  return request.post('auth/post', {
    userTelephone,
    title,
    content,
    partition,
    photos,
    tagList,
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
const calculateheat = ({postID, title, heat,}) => {
  return request.get('auth/calculateHeat', {postID, title, heat,});
};

export default {
  post,
  browse,
  getPostNum,
  like,
  deletepost,
  submitreport,
  showDetails,
  submitFeedback,
  updatebrowse,
  calculateheat,
};

