<template>
  <PostList />
</template>

<script>

import PostList from '@/components/PostList.vue';

export default {
  components: {
    PostList,
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
