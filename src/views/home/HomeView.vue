<template>
  <PostList />
</template>

<script>

import PostList from '@/components/PostList.vue';
import store from '@/store';

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
      isSaved: '',
      isLiked: '',
      searchinfo: '',
      showDeleteModal: false,
      showReportModal: false,
      reportReason: '',
    };
  },
  created() {
    if (localStorage.getItem('Partition')) {
      this.partition = JSON.parse(localStorage.getItem('Partition'));
    } else if (this.$route.query.partitions && this.$route.query.partitions !== '主页') {
      this.partition = this.$route.query.partitions;
      // 将partition保存在本地缓存中
      localStorage.setItem('Partition', JSON.stringify(this.$route.query.partitions));
    } else {
      this.partition = '主页';
    }
    this.searchinfo = this.$route.query.searchinfo;
    store.commit('getNotices');
  },
  beforeRouteLeave(to, from, next) {
    // 返回上一页面时清空本地缓存
    localStorage.removeItem('Partition');
    next();
  },
  methods: {
    goback() {
      this.$router.replace({ name: 'partitions' });
    },
  },
};

</script>
