<template>
  <div>
    <b-button variant="primary" class="back_button"
      @click="goback" style="margin-left: 60px;">
      <b-icon-reply class="mr-2"></b-icon-reply>返回
    </b-button>
  <div class='postDetails' style="margin-left:200px">
    <b-card class='mx-auto my-5' style="max-width: 1500px;">
      <div class="text-muted" style="margin-left:850px;" @click.stop>
        <b-icon icon="three-dots-vertical" @click.stop="toggleMenu"></b-icon></div>
      <b-list-group v-if="this.post.showMenu" style="width:100px;height:1.25rem;margin-left: 880px;
        margin-top: -20px;font-size: 0.9rem;" @click.stop>
          <b-list-group-item>
            <b-icon class="mr-2" :icon="post.isSaved ? 'star-fill' : 'star'"
            @click.stop="save()" :class="{ 'text-warning': post.isSaved }"></b-icon>收藏
          </b-list-group-item>
          <b-list-group-item v-if="this.post.authorTelephone !== userInfo.phone"
            @click.stop="showReportModal = true">
            <b-icon-exclamation-triangle class="mr-2"></b-icon-exclamation-triangle>举报
          </b-list-group-item>
          <b-modal v-model="showReportModal" title="举报" @hidden="clearReportReason"
            @ok="submitReport" ok-title="Submit">
            <b-form-textarea v-model="reportReason" placeholder="请输入举报原因" rows="8">
            </b-form-textarea>
          </b-modal>
          <b-list-group-item v-if="this.post.authorTelephone === userInfo.phone"
            @click.stop="showDeleteModal = true">
            <b-icon-trash class="mr-2"></b-icon-trash>删除
          </b-list-group-item>
          <b-modal v-model="showDeleteModal" title="确认删除" ok-title="Confirm"
            @ok="postdelete(post)">
            <p>你确定要删除这个帖子吗？</p>
          </b-modal>
      </b-list-group>
      <div class='author-box mb-2'>{{ post.author }}</div>
      <h2 class='title-font-size mb-3'>{{ post.title }}</h2>
      <p class='content-font-size mb-3'>{{ post.content }}</p>
      <div class="d-flex justify-content-between">
        <small class="text-muted">{{ formatDate(post.postTime) }}</small>
      </div>
      <div class='d-flex justify-content-between align-items-center mt-3'>
        <div class="text-muted">
          <b-icon :icon="post.isLiked ? 'heart-fill' : 'heart'"
          @click.stop="like()" :class="{ 'text-danger': post.isLiked }"></b-icon>
          {{ post.like }}
        </div>
        <div class='text-muted'><b-icon icon='chat-dots-fill'></b-icon> {{ post.comment }}</div>
      </div>
    </b-card>
  </div>
    <div style="margin-left:200px">
      <b-card class="my-5">
        <h3 class="mb-3">Comments</h3>
        <div v-for="comment in pcomments" :key="comment.id">
          <div class="d-flex mb-2">
            <div class="flex-shrink-0 mr-3">
              <b-avatar :src="comment.authorAvatar" size="2rem"></b-avatar>
            </div>
            <div>
              <div class="font-weight-bold">{{ comment.author }}</div>
              <div class="text-muted">{{ formatDate(comment.commentTime) }}</div>
              <div>{{ comment.content }}</div>
            </div>
          </div>
          <hr>
        </div>

        <!-- 添加新评论（发表评论） -->
        <form @submit.prevent="addComment" class="mt-3">
          <b-form-group>
            <b-form-textarea v-model="newCommentContent" placeholder="Leave a comment..." rows="3">
            </b-form-textarea>
          </b-form-group>
          <b-button type="submit" variant="primary">Post Comment</b-button>
        </form>
      </b-card>
    </div>
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
      partition: '',
      showDeleteModal: false,
      showReportModal: false,
      reportReason: '',
      post: {
        postID: '',
        author: '',
        authorTelephone: '',
        title: '',
        content: '',
        like: '',
        comment: '',
        postTime: '',
        isSaved: '',
        isLiked: '',
        showMenu: '',
      },
      pcomments: [{
        id: 1,
        author: 'John Doe',
        authorAvatar: 'https://picsum.photos/50',
        commentTime: '2023-05-15T12:34:56.789Z',
        content: 'This is a sample comment.',
      },
      {
        id: 2,
        author: 'Jane Smith',
        authorAvatar: 'https://picsum.photos/50',
        commentTime: '2023-05-16T09:23:45.678Z',
        content: 'I agree with John. Another sample comment here.',
      }],
      newCommentContent: '',
    };
  },
  created() {
    if (this.$route.params.id) {
      this.post.postID = this.$route.params.id;
      // 将postID保存在本地缓存中
      localStorage.setItem('PostID', JSON.stringify(this.$route.params.id));
    } else {
      // 在本地缓存在直接读取postID
      this.post.postID = JSON.parse(localStorage.getItem('PostID'));
    }
    if (this.$route.params.partition) {
      this.partition = this.$route.params.partition;
      // 将partition保存在本地缓存中
      localStorage.setItem('Partition', JSON.stringify(this.$route.params.partition));
    } else {
      // 在本地缓存在直接读取postID
      this.partition = JSON.parse(localStorage.getItem('Partition'));
    }
    const userTelephone = this.userInfo.phone;
    // 根据该id向后端发送请求，获取该帖子的详细信息，并展示在页面上
    this.postShowDetails({ userTelephone, postID: this.post.postID })
      .then((post) => {
        this.post.postID = post.data.PostID;
        this.post.author = post.data.UserName;
        this.post.authorTelephone = post.data.UserTelephone;
        this.post.title = post.data.Title;
        this.post.content = post.data.Content;
        this.post.like = post.data.Like;
        this.post.comment = post.data.Comment;
        this.post.postTime = post.data.PostTime;
        this.post.isSaved = post.data.IsSaved;
        this.post.isLiked = post.data.IsLiked;
        this.post.showMenu = false;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  beforeRouteLeave(to, from, next) {
    // 返回上一页面时清空本地缓存
    localStorage.removeItem('PostID');
    next();
  },
  methods: {
    ...mapActions('postModule', { postShowDetails: 'showDetails' }),
    ...mapActions('postModule', { postLike: 'like' }),
    ...mapActions('userModule', { postSave: 'save' }),
    ...mapActions('postModule', { deletepost: 'deletepost' }),
    ...mapActions('postModule', { submitreport: 'submitreport' }),
    goback() {
      this.$router.replace({ name: 'home', params: { partition: this.partition } });
    },
    toggleMenu() {
      this.post.showMenu = !this.post.showMenu;
    },
    formatDate(date) {
      // 格式化日期时间
      const d = new Date(date);
      return `${d.getFullYear()}年${
        d.getMonth() + 1
      }月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    },
    save() {
      const userTelephone = this.userInfo.phone;
      // 请求
      this.postSave({
        userTelephone, postID: this.post.postID, isSaved: this.post.isSaved,
      }).then(() => {
      }).catch((err) => {
        console.error(err);
      });
      // 更新点赞状态及点赞数
      this.post.isSaved = !this.post.isSaved;
    },
    like() {
      const userTelephone = this.userInfo.phone;
      // 请求
      this.postLike({
        userTelephone, postID: this.post.postID, isLiked: this.post.isLiked,
      }).then(() => {
      }).catch((err) => {
        console.error(err);
      });
      // 更新点赞状态及点赞数
      this.post.isLiked = !this.post.isLiked;
      if (this.post.isLiked) this.post.like += 1;
      else this.post.like -= 1;
    },
    postdelete() {
      this.deletepost({
        postID: this.post.postID,
      }).then(() => {
        this.$router.go(-1);
      }).catch((err) => {
        console.error(err);
      });
    },
    submitReport() {
      this.submitreport({
        TargetID: this.post.postID, userTelephone: this.userInfo.phone, Reason: this.reportReason,
      }).then(() => {
        this.$bvToast.toast('举报发送成功', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
      }).catch((err) => {
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

<style>
@import '../../style/css/PostDetailsView.css';
</style>
