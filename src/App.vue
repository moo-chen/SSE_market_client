<template>
    <div id='app' :style="{ 'background-color': isNightStyle ? 'rgb(25,25,25)' : 'white',
          'min-height': $route.name == 'home' ? '300vh' : '100vh'}">
      <navbar />
        <b-container>
          <router-view :style="{ marginTop: $route.name == 'home' &&
          (!this.$route.query.partitions || this.$route.query.partitions == '主页')
              ? '20px' : '120px', marginLeft: $route.name == 'home' &&
          (!this.$route.query.partitions || this.$route.query.partitions == '主页')
              ? '-120px' : '0px'}">>
            </router-view>
        </b-container>
    </div>
</template>

<script>
import Navbar from './views/layout/NavbarView.vue';

export default {
  components: { Navbar },
  computed: {
    isNightStyle() {
      if (JSON.parse(localStorage.getItem('Style')) === 'night') {
        return true;
      }
      return false;
    },
  },
  data() {
    return {};
  },
  created() {
    if (typeof localStorage !== 'undefined') {
      if (!localStorage.getItem('Style')) {
        localStorage.setItem('Style', JSON.stringify('day'));
      }
    }
  },
};
</script>
<style lang='scss'>
</style>
