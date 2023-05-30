<template>
  <div id='app'>
    <navbar />
    <b-container>
      <router-view :style="{ marginTop: $route.name == 'home' ? '20px' : '120px'}">>
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
