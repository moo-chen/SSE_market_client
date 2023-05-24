<template>
  <div>
    <b-navbar fixed="top">
      <b-navbar-brand>
        <b-icon-shop class="mr-3"></b-icon-shop>SSE_market
      </b-navbar-brand>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav style="margin-left:100px;">
          <b-navbar-form>
            <b-input-group v-if="this.$route.name === 'home'">
              <b-form-input style="width: 600px; border-radius: 5px;"
              placeholder="搜索" v-model="searchinfo"></b-form-input>
              <b-input-group-append>
                <b-button style="margin-left:20px; border-radius: 5px;"
                variant="dark"
                @click="refreshPageAndNavigate">
                <b-icon-search class="mr-2"></b-icon-search>搜索
              </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-navbar-form>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              <b-icon-person-fill></b-icon-person-fill>
              {{ userInfo.name }}
            </template>
            <b-dropdown-item @click="logout">
              <b-icon-box-arrow-left class="mr-1"></b-icon-box-arrow-left> 退出登录
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-row no-gutters style="margin-top: 60px;" v-if="userInfo.name">
      <b-col sm="2" class="nav-col" style="position: fixed;height: 100vh;">
        <b-list-group flush style="margin-top: 60px;">
          <b-list-group-item to="/" :class="{ active: $route.path === '/' }"
          style="font-size: 18px; display: flex; align-items: center;"
          @click="togglePartitions()">
            <b-icon-house-fill class="mr-3"></b-icon-house-fill>主页
            <b-icon-caret-right-fill v-if="!showPartitions" style="margin-left: auto;">
            </b-icon-caret-right-fill>
            <b-icon-caret-down-fill v-if="showPartitions" style="margin-left: auto;">
            </b-icon-caret-down-fill>
          </b-list-group-item>
          <b-list-group-item v-if="showPartitions" to="/partitions"
            :class="{ active: $route.path === '/partitions' }" style="font-size: 18px;">
            <b-icon-grid1x2-fill class="mr-3"></b-icon-grid1x2-fill>分区选择
          </b-list-group-item>
          <b-list-group-item to="/post" :class="{ active: $route.name === 'post' }"
            style="font-size: 18px;">
            <b-icon-pencil-fill class="mr-3"></b-icon-pencil-fill>发帖
          </b-list-group-item>
          <b-list-group-item to="/notifications"
            :class="{ active: $route.path === '/notifications' }"
            style="font-size: 18px;">
            <b-icon-bell-fill class="mr-3"></b-icon-bell-fill>通知
          </b-list-group-item>
            <b-list-group-item to="/feedback" :class="{ active: $route.path === '/feedback' }"
            style="font-size: 18px;">
            <b-icon-envelope-fill class="mr-3"></b-icon-envelope-fill>反馈
          </b-list-group-item>
          <b-list-group-item to="/myPage" :class="{ active: $route.path === '/myPage' }"
            style="font-size: 18px; display: flex; align-items: center;" @click="toggleProfiles">
            <b-icon-person-circle class="mr-3"></b-icon-person-circle>我的
            <b-icon-caret-right-fill v-if="!showProfiles" style="margin-left: auto;">
            </b-icon-caret-right-fill>
            <b-icon-caret-down-fill v-if="showProfiles" style="margin-left: auto;">
            </b-icon-caret-down-fill>
          </b-list-group-item>
          <b-list-group-item v-if="showProfiles" to="/profile"
          :class="{ active: $route.path === '/profile' }" style="font-size: 18px;">
            <b-icon-table class="mr-3"></b-icon-table>个人信息
          </b-list-group-item>
          <b-list-group-item v-if="showProfiles" to="/save"
          :class="{ active: $route.path === '/save' }" style="font-size: 18px;">
            <b-icon-star-fill class="mr-3"></b-icon-star-fill>我的收藏
          </b-list-group-item>
          <b-list-group-item v-if="showProfiles" to="/history"
          :class="{ active: $route.path === '/history' }" style="font-size: 18px;">
            <b-icon-clock-fill class="mr-3"></b-icon-clock-fill>历史记录
          </b-list-group-item>
          <b-list-group-item to="/set" :class="{ active: $route.path === '/set' }"
            style="font-size: 18px; display: flex; align-items: center;" @click="toggleSettings">
            <b-icon-gear-fill class="mr-3"></b-icon-gear-fill>设置
            <b-icon-caret-right-fill v-if="!showSettings" style="margin-left: auto;">
            </b-icon-caret-right-fill>
            <b-icon-caret-down-fill v-if="showSettings" style="margin-left: auto;">
            </b-icon-caret-down-fill>
          </b-list-group-item>
          <b-list-group-item v-if="showSettings" to="/changePassword"
          :class="{ active: $route.path === '/changePassword' }" style="font-size: 18px;">
            <b-icon-lock-fill class="mr-3"></b-icon-lock-fill>修改密码
          </b-list-group-item>
          <b-list-group-item v-if="showSettings" to="/delete"
          :class="{ active: $route.path === '/delete' }" style="font-size: 18px;">
            <b-icon-x-circle-fill class="mr-3"></b-icon-x-circle-fill>注销账号
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col style="margin-left: 160px;">
      </b-col>
    </b-row>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex';

export default {
  // 获取在浏览器缓存中的包含用户信息的token，userInfo中包含用户的name和telephone
  // 所以要从前端返回用户信息时，一般采用telephone(因为name不唯一，id又无法从前端直接获取)
  computed: mapState({
    userInfo: (state) => state.userModule.userInfo,
  }),
  data() {
    return {
      showPartitions: false,
      showSettings: false,
      showProfiles: false,
      searchinfo: '',
    };
  },
  methods: {
    // 使用map将映射'store/module'里的logout函数
    ...mapActions('userModule', ['logout']),
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },
    toggleProfiles() {
      this.showProfiles = !this.showProfiles;
    },
    togglePartitions() {
      this.showPartitions = !this.showPartitions;
    },
    refreshPageAndNavigate() {
      this.$router.push({ name: 'home', query: { searchinfo: this.searchinfo } });
      this.$router.go(0);
    },
  },
};
</script>

<style>
@import '../../style/css/NavbarView.css';
</style>
