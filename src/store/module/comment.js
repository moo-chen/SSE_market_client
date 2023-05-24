import commentService from '@/service/commentService';

const commentModule = {
  namespaced: true,
  actions: {
    // 显示帖子评论及评论的评论
    showPcomments(context, { userTelephone, postID }) {
      return new Promise((resolve, reject) => {
        commentService.showPcomments({ userTelephone, postID }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 对帖子评论
    postPcomment(context, { userTelephone, postID, content }) {
      return new Promise((resolve, reject) => {
        commentService.postPcomment({ userTelephone, postID, content }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 对评论的评论或对评论的评论回复
    postCcomment(context, {
      userTelephone, pcommentID, content, userTargetName,
    }) {
      return new Promise((resolve, reject) => {
        commentService.postCcomment({
          userTelephone, pcommentID, content, userTargetName,
        }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 帖子评论点赞
    pcommentLike(context, { userTelephone, pcommentID, isLiked }) {
      return new Promise((resolve, reject) => {
        commentService.pcommentLike({ userTelephone, pcommentID, isLiked }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 评论的评论点赞
    ccommentLike(context, { userTelephone, ccommentID, isLiked }) {
      return new Promise((resolve, reject) => {
        commentService.ccommentLike({ userTelephone, ccommentID, isLiked }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },

};
export default commentModule;
