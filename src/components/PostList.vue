<template>
  <div class='home-view'>
    <b-button variant="primary" v-if="this.partition != '主页'" class="back_button"
      @click="goback" style="margin-left: 60px;">
      <b-icon-reply class="mr-2"></b-icon-reply>返回
    </b-button>
    <b-row>
      <b-col v-for='post in posts' :key='post.id' cols='12' md='12' lg='12' class='mb-3'>
        <b-card class='px-3 py-2 card-shadow' @click='showDetails(post)'>
          <div class='text-muted' style='margin-left: 820px' @click.stop>
            <b-icon icon='three-dots-vertical' @click.stop='toggleMenu(post)'></b-icon>
          </div>
          <b-list-group
            v-if='post.showMenu'
            style='
              width: 100px;
              height: 1.25rem;
              margin-left: 850px;
              margin-top: -20px;
              font-size: 0.9rem;
            '
            @click.stop
          >
            <b-list-group-item>
                <b-icon class="mr-2" :icon="post.isSaved ? 'star-fill' : 'star'"
              @click.stop="save(post)" :class="{ 'text-warning': post.isSaved }"></b-icon>收藏
            </b-list-group-item>
            <b-list-group-item
              v-if='post.authorTelephone !== userInfo.phone'
              @click.stop='showReportModal = true'
            >
              <b-icon-exclamation-triangle class='mr-2'></b-icon-exclamation-triangle>举报
            </b-list-group-item>
            <b-modal
              v-model='showReportModal'
              title='举报'
              @hidden='clearReportReason'
              @ok='submitReport(post)'
              ok-title='Submit'
            >
              <b-form-textarea v-model='reportReason' placeholder='请输入举报原因' rows='8'>
              </b-form-textarea>
            </b-modal>
            <b-list-group-item
              v-if='post.authorTelephone === userInfo.phone'
              @click.stop='showDeleteModal = true'
            >
              <b-icon-trash class='mr-2'></b-icon-trash>删除
            </b-list-group-item>
            <b-modal
              v-model='showDeleteModal'
              title='确认删除'
              ok-title='Confirm'
              @ok='postdelete(post)'
            >
              <p>你确定要删除这个帖子吗？</p>
            </b-modal>
          </b-list-group>
          <b-row class='mt-0'>
            <b-col md='4' class='mb-2'>
              <div class='author-box' @click.stop>
                {{ post.author }}
              </div>
            </b-col>
          </b-row>
          <b-card-title>{{ post.title }}</b-card-title>
          <b-card-text>{{ post.content }}</b-card-text>
          <div class='d-flex justify-content-between'>
            <small class='text-muted'>{{ formatDate(post.postTime) }}</small>
          </div>
          <div class='d-flex justify-content-between align-items-center mt-3'>
            <div class='text-muted'>
                <b-icon :icon="post.isLiked ? 'heart-fill' : 'heart'"
              @click.stop="like(post)" :class="{ 'text-danger': post.isLiked }"></b-icon>
              {{ post.like }}
            </div>
            <div class='text-muted'><b-icon-eye-fill></b-icon-eye-fill> 100</div>
            <div class='text-muted'><b-icon icon='chat-dots-fill'></b-icon> {{ post.comment }}</div>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: mapState({
    userInfo: (state) => state.userModule.userInfo,
  }),
  data() {
    return {
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
    // 在页面创建时默认加载主页帖子列表
    this.browsePosts();
  },
  beforeRouteLeave(to, from, next) {
    // 返回上一页面时清空本地缓存
    localStorage.removeItem('Partition');
    next();
  },
  methods: {
    ...mapActions('postModule', { postBrowse: 'browse' }),
    ...mapActions('postModule', { postLike: 'like' }),
    ...mapActions('userModule', { postSave: 'save' }),
    ...mapActions('postModule', { deletepost: 'deletepost' }),
    ...mapActions('postModule', { submitreport: 'submitreport' }),
    goback() {
      this.$router.replace({ name: 'partitions' });
    },
    showDetails(post) {
      if (this.$route.name === 'home') {
        this.$router.push({
          name: 'postDetails',
          params: { id: post.id, partition: this.partition, before: 'home' },
          query: { title: post.title },
        });
      } else if (this.$route.name === 'save') {
        this.$router.push({
          name: 'postDetails',
          params: { id: post.id, partition: this.partition, before: 'save' },
          query: { title: post.title },
        });
      } else if (this.$route.name === 'history') {
        this.$router.push({
          name: 'postDetails',
          params: { id: post.id, partition: this.partition, before: 'history' },
          query: { title: post.title },
        });
      }
    },
    async browsePosts() {
      this.userTelephone = this.userInfo.phone;
      // 从后端返回一个结构体变量的方法
      try {
        // 向后端发送请求并获取帖子列表
        const { data } = await this.postBrowse({
          userTelephone: this.userTelephone,
          partition: this.partition,
          searchinfo: this.searchinfo,
        });
        if (this.$route.name === 'home') {
          // 将获取到的帖子列表数据赋值给 posts 变量
          this.posts = data
            .map((post) => ({
              id: post.PostID,
              author: post.UserName,
              authorTelephone: post.UserTelephone,
              title: post.Title,
              content: post.Content,
              like: post.Like,
              comment: post.Comment,
              postTime: post.PostTime,
              isSaved: post.IsSaved,
              isLiked: post.IsLiked,
              showMenu: false,
            })).sort((a, b) => new Date(b.postTime) - new Date(a.postTime)); // 按时间倒序排序展示
        } else if (this.$route.name === 'save') {
          // 根据是否被收藏过滤帖子列表
          const filteredData = data.filter((post) => post.IsSaved === true);
          // 将获取到的帖子列表数据赋值给 posts 变量
          this.posts = filteredData.map((post) => ({
            id: post.PostID,
            author: post.UserName,
            authorTelephone: post.UserTelephone,
            title: post.Title,
            content: post.Content,
            like: post.Like,
            comment: post.Comment,
            postTime: post.PostTime,
            isSaved: post.IsSaved,
            isLiked: post.IsLiked,
            showMenu: false,
          })).sort((a, b) => new Date(b.postTime) - new Date(a.postTime)); // 按时间倒序排序展示
        } else if (this.$route.name === 'history') {
          // 根据用户电话号码过滤帖子列表
          const filteredData = data.filter((post) => post.UserTelephone === this.userTelephone);
          // 将获取到的帖子列表数据赋值给 posts 变量
          this.posts = filteredData.map((post) => ({
            id: post.PostID,
            author: post.UserName,
            authorTelephone: post.UserTelephone,
            title: post.Title,
            content: post.Content,
            like: post.Like,
            comment: post.Comment,
            postTime: post.PostTime,
            isSaved: post.IsSaved,
            isLiked: post.IsLiked,
            showMenu: false,
          })).sort((a, b) => new Date(b.postTime) - new Date(a.postTime)); // 按时间倒序排序展示
        }
      } catch (error) {
        console.error(error);
      }
    },
    formatDate(date) {
      // 格式化日期时间
      const d = new Date(date);
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${String(
        d.getHours(),
      ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(
        d.getSeconds(),
      ).padStart(2, '0')}`;
    },
    toggleMenu(post) {
      const updatedShowMenu = { ...post, showMenu: !post.showMenu };
      this.posts.splice(this.posts.indexOf(post), 1, updatedShowMenu);
    },
    save(post) {
      // 切换收藏状态
      const updatedPost = { ...post, isSaved: !post.isSaved };
      // 用更新后的 post 对象替换原先的 post 对象
      this.posts.splice(this.posts.indexOf(post), 1, updatedPost);
      this.userTelephone = this.userInfo.phone;
      this.postID = post.id;
      this.isSaved = post.isSaved;
      // 请求
      this.postSave({
        userTelephone: this.userTelephone,
        postID: this.postID,
        isSaved: this.isSaved,
      })
        .then(() => {})
        .catch((err) => {
          console.error(err);
        });
    },
    like(post) {
      // 切换点赞状态
      const updatedPost = { ...post, isLiked: !post.isLiked };
      // 更新点赞数
      updatedPost.like += post.isLiked ? -1 : 1;
      // 用更新后的 post 对象替换原先的 post 对象
      this.posts.splice(this.posts.indexOf(post), 1, updatedPost);
      this.userTelephone = this.userInfo.phone;
      this.postID = post.id;
      this.isLiked = post.isLiked;
      // 请求
      this.postLike({
        userTelephone: this.userTelephone,
        postID: this.postID,
        isLiked: this.isLiked,
      })
        .then(() => {})
        .catch((err) => {
          console.error(err);
        });
    },
    postdelete(post) {
      this.postID = post.id;
      this.deletepost({
        postID: this.postID,
      })
        .then(() => {
          this.$router.go(0);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    submitReport(post) {
      this.postID = post.id;
      this.userTelephone = this.userInfo.phone;
      this.submitreport({
        TargetID: this.postID,
        userTelephone: this.userTelephone,
        Reason: this.reportReason,
      })
        .then(() => {
          this.$bvToast.toast('举报发送成功', {
            title: '系统提醒',
            variant: 'primary',
            solid: true,
          });
        })
        .catch((err) => {
          this.$bvToast.toast(err.response.data.msg, {
            title: '数据验证错误',
            variant: 'danger',
            solid: true,
          });
        });
    },
    clearReportReason() {
      this.reportReason = '';
    },
  },
};
</script>

<style lang='scss' scoped>
@import '@/style/css/HomeView.css';
</style>
