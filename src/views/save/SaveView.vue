<template>
   <PostList />
</template>

<script>

import PostList from '@/components/PostList.vue';

export default {
  components: {
    PostList,
  },
  data() {
    return {
      partition: '主页',
      posts: [],
      userTelephone: '',
      postID: '',
      isLiked: '',
      isSaved: '',
      showDeleteModal: false,
      showReportModal: false,
      reportReason: '',
    };
  },
  created() {
    // 在页面创建时默认加载主页帖子列表
    this.browsePosts();
  },
  beforeRouteLeave(to, from, next) {
    // 返回上一页面时清空本地缓存
    next();
  },
};
</script>
