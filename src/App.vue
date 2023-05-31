<template>
  <div id='app'>
    <navbar />
    <b-container>
      <router-view :style="{ marginTop: $route.name == 'home' &&
      (!this.$route.query.partitions || this.$route.query.partitions == '主页')
          ? '20px' : '120px', marginLeft: $route.name == 'home' &&
      (!this.$route.query.partitions || this.$route.query.partitions == '主页')
          ? '-150px' : '0px'}">>
        </router-view>
    </b-container>
  </div>
</template>

<script>
import Navbar from './views/layout/NavbarView.vue';

export default {
  components: { Navbar },
  data() {
    return {};
  },
};
</script>
<style lang='scss'></style>
