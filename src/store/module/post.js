// eslint-disable-next-line import/no-cycle
import postService from '@/service/postService';

const postModule = {
  namespaced: true,
  actions: {
    post(context, {
      userTelephone, title, content, partition, photos,
    }) {
      return new Promise((resolve, reject) => {
        postService.post({
          userTelephone, title, content, partition, photos,
        }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    browse(context, { userTelephone, partition, searchinfo }) {
      return new Promise((resolve, reject) => {
        postService.browse({ userTelephone, partition, searchinfo }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    like(context, { userTelephone, postID, isLiked }) {
      return new Promise((resolve, reject) => {
        postService.like({ userTelephone, postID, isLiked }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    deletepost(context, { postID }) {
      return new Promise((resolve, reject) => {
        postService.deletepost({ postID }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    submitreport(context, {
      TargetID, Targettype, userTelephone, Reason,
    }) {
      return new Promise((resolve, reject) => {
        postService.submitreport({
          TargetID, Targettype, userTelephone, Reason,
        }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    showDetails(context, { userTelephone, postID }) {
      return new Promise((resolve, reject) => {
        postService.showDetails({ userTelephone, postID }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    submitFeedback(context, { ftext, attachment }) {
      return new Promise((resolve, reject) => {
        postService.submitFeedback({ ftext, attachment }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    updatebrowse(context, { userTelephone, postID }) {
      return new Promise((resolve, reject) => {
        postService.updatebrowse({ userTelephone, postID }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },

    calculateheat(context, {
      postID,
      title,
      heat,
    }) {
      return new Promise((resolve, reject) => {
        postService.calculateheat({
          postID,
          title,
          heat,
        }).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
};

export default postModule;
