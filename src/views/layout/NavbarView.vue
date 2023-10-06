<template>
  <div>
    <b-modal v-model='toLogin' title='登录' ok-only ok-title="取消登录"
             modal-class="custom-modal">
      <LoginForm/>
    </b-modal>
    <!--    电脑端头部（欢迎界面与搜索框）-->
    <div class="video-container" v-if="$route.name == 'home' && (!this.$route.query.partitions ||
      this.$route.query.partitions == '主页')">
      <video autoplay loop muted playsinline>
        <source
          src="https://sse-market-source-1320172928.cos.ap-guangzhou.myqcloud.com/assets/vedio/Background.mp4"
          type="video/mp4">
      </video>
      <div class="overlay">
        <vue-typed-js :showCursor="false"
                      :strings="['这是中山大学', '欢迎来到软工集市','今日火文等你看','SSE_market']">
          <h1 class="typing">SSE_market</h1>
        </vue-typed-js>
        <div class="search-box">
          <b-form-input placeholder="搜索  支持标签和内容" v-model="searchinfo"
                        style="height: 50px;border-radius: 20px;">
          </b-form-input>
          <b-button variant="dark" @click="refreshPageAndNavigate" class="d-flex text-nowrap"
                    style="margin-left:10px;padding:20px;border-radius: 20px;">
            <b-icon-search class="mr-2"></b-icon-search>
            搜索
          </b-button>
        </div>
      </div>
    </div>
    <!-- 导航栏-->
    <b-navbar fixed="top" v-if="($route.name !== 'home'&&$route.name !== 'register'
    && $route.name !== 'login' && this.$route.name != 'modifyPassword'
    && this.$route.name != 'identityValidate' && this.$route.name != 'deleteMe' ) ||
    scrollPosition > 400 || (this.$route.query.partitions && this.$route.query.partitions != '主页' )"
              :style=
                "{ 'background-color': isNightStyle ? 'rgb(246, 155, 10)' : 'rgb(17, 167, 226)'}"
    class="d-flex justify-content-between">
      <!-- SSE_MARKET文字-->
      <b-navbar-brand>
        <b-icon-shop class="mr-3"></b-icon-shop>
        SSE_market
      </b-navbar-brand>
      <!--      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>-->
      <!-- 搜索栏-->
      <div>
        <b-input-group v-if="this.$route.name == 'home' &&
            (this.$route.query.partitions == '主页' || !this.$route.query.partitions)">
          <b-form-input style="width: 600px; border-radius: 5px; height: 50px;
              z-index: 100;"
                        placeholder="搜索" v-model="searchinfo"></b-form-input>
          <b-input-group-append>
            <b-button style="margin-left:20px; border-radius: 5px; pointer-events: auto;"
                      variant="dark"
                      @click="refreshPageAndNavigate">
              <b-icon-search class="mr-2"></b-icon-search>
              搜索
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
      <!--夜间模式和个人信息-->
      <div class="d-flex">
        <div>
          <StyleButton/>
        </div>
        <!-- 个人登录信息 -->
        <div class="ml-2">
          <b-nav-item-dropdown right v-if="userInfo" class="d-flex">
            <template #button-content >
              <a style="color: #e4e7ed">{{ userInfo.name }}
                <b-icon-person-fill>
                </b-icon-person-fill></a>
            </template>
            <b-dropdown-item @click="logout">
              <b-icon-box-arrow-left class="mr-1"></b-icon-box-arrow-left>
              退出登录
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </div>
      </div>
    </b-navbar>
    <!--   侧边栏 -->
    <b-row no-gutters v-if="this.$route.name != 'register' && this.$route.name != 'modifyPassword'
      && this.$route.name != 'identityValidate' && this.$route.name != 'deleteMe'
        && $route.name !== 'login'"
           class="d-flex " style="position:fixed;z-index: 1001;">
      <b-col class="col-lg-12">
        <b-list-group flush class="list-group"
                      :style="{ marginTop: $route.name == 'home' &&
      (!this.$route.query.partitions || this.$route.query.partitions == '主页') ?
        (scrollPosition < 400 ? `${60-scrollPosition}px` : '-300px') : '120px',
        'background-color': isNightStyle ? 'rgb(50, 50, 50)' : null,
        'border-right': isNightStyle ? '1px solid rgb(50, 50, 50)' :
          '1px solid rgb(237, 235, 235)' }">
          <b-list-group-item to="/" :style="{ 'background-color': $route.path !== '/' ?
            isNightStyle ? 'rgb(70, 70, 70)' : null :
            isNightStyle ? 'rgb(246, 155, 10)' : 'rgb(17, 167, 226)',
            'color': isNightStyle ? 'gray' : null}"
                             style="font-size: 18px; display: flex; align-items: center;"
                             @click="togglePartitions()" class="click" ref="parent">
            <b-icon-house-fill class="mr-3"></b-icon-house-fill>
            主页
            <b-icon-caret-right-fill v-if="!showPartitions" style="margin-left: auto;">
            </b-icon-caret-right-fill>
            <b-icon-caret-down-fill v-if="showPartitions" style="margin-left: auto;">
            </b-icon-caret-down-fill>
          </b-list-group-item>
          <b-list-group-item v-if="showPartitions" to="/partitions" class="click"
                             :style="{ 'background-color': $route.path !== '/partitions' ?
            isNightStyle ? 'rgb(50, 50, 50)' : null :
            isNightStyle ? 'rgb(246, 155, 10)' : 'rgb(17, 167, 226)',
            'color': isNightStyle ? 'gray' : null}"
                             style="font-size: 18px;">
            <b-icon-grid1x2-fill class="mr-3"></b-icon-grid1x2-fill>
            分区选择
          </b-list-group-item>
          <b-list-group-item @click="showPostForm()"
                             :style="{ 'background-color': isNightStyle ? 'rgb(50, 50, 50)' : null,
              'color': isNightStyle ? 'gray' : null}"
                             style="font-size: 18px;" class="click">
            <b-icon-pencil-fill class="mr-3"></b-icon-pencil-fill>
            发帖
          </b-list-group-item>
          <b-modal v-model='PostFormVisible' title='发帖' ok-only ok-title="取消发帖"
                   modal-class="custom-modal">
            <PostForm :mode="'post'"/>
          </b-modal>
          <b-list-group-item @click="toNotifications()"
                             :style="{ 'background-color': $route.path !== '/notice' ?
            isNightStyle ? 'rgb(50, 50, 50)' : null :
            isNightStyle ? 'rgb(246, 155, 10)' : 'rgb(17, 167, 226)',
            'color': isNightStyle ? 'gray' : null }"
                             style="font-size: 18px;" class="click">
            <b-icon-bell-fill class="mr-3"></b-icon-bell-fill>
            通知
            <span v-if="noticesNum!=0"
                  class="badge badge-danger ml-2 pop">{{ noticesNum }}</span>
          </b-list-group-item>
          <b-list-group-item @click="toFeedback()"
                             :style="{ 'background-color': $route.path !== '/feedback' ?
            isNightStyle ? 'rgb(50, 50, 50)' : null
            : isNightStyle ? 'rgb(246, 155, 10)' : 'rgb(17, 167, 226)',
            'color': isNightStyle ? 'gray' : null}"
                             style="font-size: 18px;" class="click">
            <b-icon-envelope-fill class="mr-3"></b-icon-envelope-fill>
            反馈
          </b-list-group-item>
          <b-modal v-model='FeedbackVisible' title='反馈' ok-only ok-title="取消反馈"
                   modal-class="custom-modal">
          </b-modal>
          <b-list-group-item
            :style="{ 'font-size': '18px', 'display': 'flex', 'align-items': 'center',
        'background-color': showProfiles ? 'rgb(245, 245, 245)' : '' ,
        'background-color': isNightStyle ? 'rgb(50, 50, 50)' : null,
        'color': isNightStyle ? 'gray' : null}"
            @click="toggleProfiles" class="click">
            <b-icon-person-circle class="mr-3"></b-icon-person-circle>
            我的
            <b-icon-caret-right-fill v-if="!showProfiles" style="margin-left: auto;">
            </b-icon-caret-right-fill>
            <b-icon-caret-down-fill v-if="showProfiles" style="margin-left: auto;">
            </b-icon-caret-down-fill>
          </b-list-group-item>
          <b-list-group-item class="click" v-if="showProfiles" to="/profile"
                             :style="{ 'background-color': $route.path !== '/profile' ?
            isNightStyle ? 'rgb(50, 50, 50)' : null :
            isNightStyle ? 'rgb(246, 155, 10)' : 'rgb(17, 167, 226)',
            'color': isNightStyle ? 'gray' : null}"
                             style="font-size: 18px;">
            <b-icon-table class="mr-3"></b-icon-table>
            个人信息
          </b-list-group-item>
          <b-list-group-item v-if="showProfiles" to="/save" class="click"
                             :style="{ 'background-color': $route.path !== '/save' ?
            isNightStyle ? 'rgb(50, 50, 50)' : null :
            isNightStyle ? 'rgb(246, 155, 10)' : 'rgb(17, 167, 226)',
            'color': isNightStyle ? 'gray' : null}"
                             style="font-size: 18px;">
            <b-icon-star-fill class="mr-3"></b-icon-star-fill>
            我的收藏
          </b-list-group-item>
          <b-list-group-item v-if="showProfiles" to="/history" class="click"
                             :style="{ 'background-color': $route.path !== '/history' ?
            isNightStyle ? 'rgb(50, 50, 50)' : null :
            isNightStyle ? 'rgb(246, 155, 10)' : 'rgb(17, 167, 226)',
            'color': isNightStyle ? 'gray' : null}"
                             style="font-size: 18px;">
            <b-icon-clock-fill class="mr-3"></b-icon-clock-fill>
            发帖历史
          </b-list-group-item>
          <b-list-group-item
            :style="{ 'font-size': '18px', 'display': 'flex', 'align-items': 'center',
          'background-color': showSettings ? 'rgb(245, 245, 245)' : '' ,
          'background-color': isNightStyle ? 'rgb(50, 50, 50)' : null,
          'color': isNightStyle ? 'gray' : null}"
            @click="toggleSettings" class="click" >
            <b-icon-gear-fill class="mr-3"></b-icon-gear-fill>
            设置
            <b-icon-caret-right-fill v-if="!showSettings" style="margin-left: auto;">
            </b-icon-caret-right-fill>
            <b-icon-caret-down-fill v-if="showSettings" style="margin-left: auto;">
            </b-icon-caret-down-fill>
          </b-list-group-item>
          <b-list-group-item v-if="showSettings" class="click"
                             @click="toModifyPassword()" style="font-size: 18px;"
                             :style="{ 'background-color': isNightStyle ? 'rgb(50, 50, 50)' : null,
            'color': isNightStyle ? 'gray' : null}">
            <b-icon-lock-fill class="mr-3"></b-icon-lock-fill>
            修改密码
          </b-list-group-item>
          <b-list-group-item v-if="showSettings" class="click"
                             @click="toDeleteUser()" style="font-size: 18px;"
                             :style="{ 'background-color': isNightStyle ? 'rgb(50, 50, 50)' : null,
            'color': isNightStyle ? 'gray' : null}">
            <b-icon-x-circle-fill class="mr-3"></b-icon-x-circle-fill>
            注销账号
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex';
import PostForm from '@/components/PostForm.vue';
import LoginForm from '@/components/LoginForm.vue';
import StyleButton from '@/components/StyleButton.vue';
import store from '@/store';

export default {
  // 获取在浏览器缓存中的包含用户信息的token，userInfo中包含用户的name和telephone
  // 所以要从前端返回用户信息时，一般采用telephone(因为name不唯一，id又无法从前端直接获取)
  components: {
    PostForm,
    LoginForm,
    StyleButton,
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userModule.userInfo,
    }),
    noticesNum() {
      return store.state.noticesNum;
    },
    style() {
      return store.state.style;
    },
    isNightStyle() {
      if (JSON.parse(localStorage.getItem('Style')) === 'night') {
        return true;
      }
      return false;
    },
  },
  data() {
    return {
      PostFormVisible: false,
      FeedbackVisible: false,
      showPartitions: false,
      showSettings: false,
      showProfiles: false,
      searchinfo: '',
      scrollPosition: 0,
      toLogin: false,
    };
  },
  created() {
    if (typeof localStorage !== 'undefined') {
      if (!localStorage.getItem('Style')) {
        localStorage.setItem('Style', JSON.stringify('day'));
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    // 使用map将映射'store/module'里的logout函数
    ...mapActions('userModule', ['logout']),
    showPostForm() {
      if (!this.userInfo) {
        this.toLogin = true;
        return;
      }
      this.PostFormVisible = true;
    },
    toNotifications() {
      if (!this.userInfo) {
        this.toLogin = true;
        return;
      }
      if (this.$route.path !== '/notice') {
        this.$router.replace({ name: 'notice' });
      }
    },
    toFeedback() {
      if (!this.userInfo) {
        this.toLogin = true;
        return;
      }
      if (this.$route.path !== '/feedback') {
        this.$router.replace({ name: 'feedback' });
      }
    },
    toModifyPassword() {
      window.open('/identityValidate', '_blank');
    },
    toDeleteUser() {
      window.open('/deleteMe', '_blank');
    },
    handleScroll() {
      this.scrollPosition = window.scrollY;
    },
    toggleSettings() {
      if (!this.userInfo) {
        this.toLogin = true;
        return;
      }
      this.showSettings = !this.showSettings;
    },
    toggleProfiles() {
      if (!this.userInfo) {
        this.toLogin = true;
        return;
      }
      this.showProfiles = !this.showProfiles;
    },
    togglePartitions() {
      this.showPartitions = !this.showPartitions;
    },
    refreshPageAndNavigate() {
      this.$router.push({
        name: 'home',
        query: { searchinfo: this.searchinfo },
      });
      this.$router.go(0);
    },

  },
};
</script>

<style>
@import '../../style/css/NavbarView.css';

.pop {
  animation: pop 0.5s ease-in-out;
}
</style>
