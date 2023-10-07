<template>
  <div id='app' :style="{ 'background-color': isNightStyle ? 'rgb(25,25,25)' : 'white',
          'min-height': $route.name == 'home' ? '300vh' : '100vh', 'min-width': '1500px'}">
    <b-row class="d-flex justify-content-center no-gutters" style="background: black">
      <navbar/>
    </b-row>
    <b-row class="d-flex justify-content-center"
           :style="{ 'background-color': isNightStyle ? 'rgb(25,25,25)' : 'white'}">
      <b-col class="col-lg-12 mr-5"
             :style="{ 'background-color': isNightStyle ? 'rgb(25,25,25)' : 'white',
          'max-width': '300px'}">
        <sidebar/>
      </b-col>
      <b-col :style="{ 'background-color': isNightStyle ? 'rgb(25,25,25)' : 'white',
          'max-width': '1200px'}">
        <b-container>
          <transition name="fade-right" mode="out-in">
            <keep-alive>
              <router-view v-if="this.$route.meta.keepAlive"
                           :style="{ marginTop: $route.name == 'home' &&
          (!this.$route.query.partitions || this.$route.query.partitions == '主页')
              ? '20px' : '120px', marginLeft: $route.name == 'home' &&
          (!this.$route.query.partitions || this.$route.query.partitions == '主页')
              ? '-120px' : '0px'}">
              </router-view>
            </keep-alive>
          </transition>
          <transition name="fade-right" mode="out-in">
            <router-view v-if="!this.$route.meta.keepAlive"
                         :style="{ marginTop: $route.name == 'home' &&
          (!this.$route.query.partitions || this.$route.query.partitions == '主页')
              ? '20px' : '120px', marginLeft: $route.name == 'home' &&
          (!this.$route.query.partitions || this.$route.query.partitions == '主页')
              ? '-120px' : '0px'}"></router-view>
          </transition>
        </b-container>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Navbar from './views/layout/NavbarView.vue';
// import DevicePixelRatio from './utils/devicePixelRatio';
import Sidebar from './views/layout/SidebarView.vue';

export default {
  components: {
    Navbar,
    Sidebar,
  },
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
    // new DevicePixelRatio().init();
    if (typeof localStorage !== 'undefined') {
      if (!localStorage.getItem('Style')) {
        localStorage.setItem('Style', JSON.stringify('day'));
      }
    }
  },
};
</script>
<style lang='scss'>
// 进入后和离开前保持原位
.fade-right-enter-to,
.fade-right-leave-from {
  opacity: 1;
  transform: none;
}

// 设置进入和离开过程中的动画时长0.5s
.fade-right-enter-active,
.fade-right-leave-active {
  transition: all 0.5s;
}

// 进入前和离开后为透明，并在右侧20px位置
.fade-right-enter-from,
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
