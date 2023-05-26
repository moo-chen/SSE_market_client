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
        <div class='text-muted'><b-icon icon='chat-dots-fill'></b-icon> {{ commentsNum }}</div>
      </div>
    </b-card>
    <b-button @click="post.showCommentForm
            = !post.showCommentForm" variant="primary">
      {{ post.showCommentForm ? '隐藏评论' : '评论' }}
    </b-button>
  <!--显示帖子评论窗口-->
  <div v-if="post.showCommentForm">
        <b-form-group>
          <b-form-textarea v-model="pcomment.content"
                           placeholder="请写下你的精彩评论..." rows="3">
          </b-form-textarea>
        </b-form-group>
        <b-button @click="pcommentPost" variant="primary">提交评论</b-button>
    </div>
  </div>

 <!--显示和发表帖子评论、评论的评论-->
  <div class='comment' style="margin-left: 200px" >
    <!--排序-->
    <div class="d-flex justify-content-end">
      <b-button @click="sortkind='Date';comments=sortcomments(comments)"
                variant="primary" class="mr-2 btn-sm">按时间排序</b-button>
      <b-button @click="sortkind='heat';comments=sortcomments(comments)"
                variant="primary" class="btn-sm">按热度排序</b-button>
    </div>
    <transition-group name="comment-list" tag="div">
    <div v-for="(comment, index) in visibleComments" :key="index">
      <b-card class="my-1">
        <h4 class="mb-3">Comment {{ index + 1 }}</h4>
        <div class="d-flex mb-2">
          <div class="flex-shrink-0 mr-3">
            <b-avatar :src="comment.authorAvatar" size="2rem"></b-avatar>
          </div>
          <div>
            <div class="font-weight-bold">{{ comment.author }}</div>
            <div class="text-muted">{{ formatDate(comment.commentTime) }}</div>
            <div>{{ comment.content }}</div>
            <!--显示每个评论的点赞和回复数-->
            <div class='d-flex justify-content-between align-items-center mt-3'>
              <div class="text-muted">
                <b-icon :icon="comment.isLiked ? 'heart-fill' : 'heart'"
                        @click.stop="pclike(index)" :class="{ 'text-danger': comment.isLiked }">
                </b-icon>
                {{ comment.likeNum }}
              </div>
              <div class='text-muted'>
                <b-icon icon='chat-dots-fill'></b-icon> {{ len(comment.subComments) }}
              </div>
            </div>
            <b-button @click="comment.showReplyForm
            = !comment.showReplyForm" class="mr-2 btn-sm"
                      variant="primary">
              {{ comment.showReplyForm ? '隐藏评论' : '评论' }}
            </b-button>
            <!--如果点击了评论，将显示评论窗口-->
            <div v-if="comment.showReplyForm">
              <form @submit.prevent="ccommentPost(index)">
                <b-form-group>
                  <b-form-textarea v-model="ccomment.content"
                                   placeholder="请写下你的精彩评论..." rows="3">
                  </b-form-textarea>
                </b-form-group>
                <b-button type="submit" variant="primary">
                  提交评论</b-button>
              </form>
            </div>
            <!-- 显示评论的评论 -->
            <b-button v-if="comment.subComments.length > 0"
                      @click="showRepliesModal=true;showcommentsindex=index"
                      variant="outline-primary"
                      style="font-size: 12px;">
              查看评论共{{len(comment.subComments)}}条
            </b-button>
            <b-modal hide-footer v-model="showRepliesModal" v-if="index===showcommentsindex">
            <transition-group name="comment-list" tag="div">
            <div v-for="(subComment, subIndex) in visibleSubComments(index)" :key="subIndex">
              <hr>
              <div class="d-lg-flex mb-2" @mouseover="isHovered = true;
                nowSubIndex = subIndex;nowIndex = index"
                   @mouseleave="isHovered = false;nowSubIndex = 0;replyshow=false;nowIndex=0"
                   @focus="nowSubIndex = subIndex" @focusout="nowSubIndex = subIndex">
                <div class="flex-shrink-0 mr-3">
                  <b-avatar :src="subComment.authorAvatar" size="2rem"></b-avatar>
                </div>
                <div>
                  <div class="font-weight-bold">{{ subComment.author }}</div>
                  <div class="text-muted">{{ formatDate(subComment.commentTime) }}</div>
                  <div v-if="subComment.userTargetName !== ''">
                    <span style="color: cadetblue">回复@{{ subComment.userTargetName }}:</span>
                  </div>
                  <div>{{ subComment.content }}</div>
                </div>
                <div class="text-muted">
                  <b-icon :icon="subComment.isLiked ? 'heart-fill' : 'heart'"
                          @click.stop="cclike(index,subIndex)"
                          :class="{ 'text-danger': subComment.isLiked }">
                  </b-icon>
                  {{ subComment.likeNum }}
                </div>
                <div v-if="isHovered && subIndex===nowSubIndex && index===nowIndex" >
                  <b-button @click="replyshow = !replyshow"
                            variant="outline-info">
                    回复
                  </b-button>
                  <div v-if="replyshow && subIndex===nowSubIndex">
                    <form @submit.prevent="ccommentPost(index,subComment.author)">
                      <b-form-group>
                        <b-form-textarea v-model="ccomment.content"
                                         :placeholder="'回复@'+subComment.author" rows="3">
                        </b-form-textarea>
                      </b-form-group>
                      <b-button type="submit" variant="primary">
                        提交回复</b-button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            </transition-group>
              <b-button v-if="comment.subComments.length > 1"
                        @click="showAllReplies(index)" variant="outline-primary"
                        style="font-size: 12px;">
                <div v-if="comment.showAllReplies">折叠评论</div>
                <div v-else>展开全部评论共{{len(comment.subComments)}}条</div>
              </b-button>
            </b-modal >
          </div>
        </div>
      </b-card>
    </div>
      </transition-group>
    <b-button v-if="visibleComments.length < comments.length" @click="showAllComments()">
      {{ allComments ? '折叠评论' : '展开全部评论' }}
    </b-button>
  </div>

  </div>

</template>

<script>

import { mapState, mapActions } from 'vuex';
import { len } from 'vuelidate/lib/validators/common';

export default {
  computed: {
    // 计算属性，根据当前展示的评论数和每次展示的评论数量，返回可见的评论
    visibleComments() {
      if (this.allComments === true) {
        return this.comments;
      }
      return this.comments.slice(0, 10);
    },
    ...mapState({
      userInfo: (state) => state.userModule.userInfo,
    }),
    commentsNum() {
      let num = len(this.comments);
      for (let i = 0; i < this.comments.length; i += 1) {
        const comment = this.comments[i];
        num += len(comment.subComments);
      }
      return num;
    },
  },
  data() {
    return {
      sortkind: 'Date',
      allComments: false,
      userTelephone: '',
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
        showCommentForm: '',
      },
      comments: [],
      pcomment: {
        userTelephone: '',
        postID: '',
        content: '',
      },
      ccomment: {
        userTelephone: '',
        pcommentID: '',
        content: '',
        userTargetName: '',
      },
      // 用来记录是否悬停在子评论上
      isHovered: false,
      nowSubIndex: 0,
      nowIndex: 0,
      replyshow: false,
      // 用来修复发表评论后页面的跳转问题（尚未修复）
      showcommentsindex: 0,
      showRepliesModal: false, // 显示窗口
    };
  },
  created() {
    if (this.$route.query.id) {
      this.post.postID = this.$route.query.id;
      // 将postID保存在本地缓存中
      localStorage.setItem('PostID', JSON.stringify(this.$route.query.id));
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
    this.userTelephone = this.userInfo.phone;
    // 根据该id向后端发送请求，获取该帖子的详细信息，并展示在页面上
    this.postShowDetails({ userTelephone: this.userTelephone, postID: this.post.postID })
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
    this.pcommentsShow();
  },
  beforeRouteLeave(to, from, next) {
    // 返回上一页面时清空本地缓存
    localStorage.removeItem('PostID');
    next();
  },
  methods: {
    len,
    ...mapActions('postModule', { postShowDetails: 'showDetails' }),
    ...mapActions('postModule', { postLike: 'like' }),
    ...mapActions('userModule', { postSave: 'save' }),
    ...mapActions('postModule', { deletepost: 'deletepost' }),
    ...mapActions('postModule', { submitreport: 'submitreport' }),
    ...mapActions('commentModule', { showPcomments: 'showPcomments' }),
    ...mapActions('commentModule', { postPcomment: 'postPcomment' }),
    ...mapActions('commentModule', { postCcomment: 'postCcomment' }),
    ...mapActions('commentModule', { pcommentlike: 'pcommentLike' }),
    ...mapActions('commentModule', { ccommentlike: 'ccommentLike' }),
    showAllReplies(index) {
      // 将评论的所有子评论都显示出来
      this.comments[index].showAllReplies = !this.comments[index].showAllReplies;
    },
    showAllComments() {
      this.allComments = !this.allComments;// 将帖子所有评论都展示出来
    },
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
    pclike(index) {
      this.pcommentlike({
        userTelephone: this.userTelephone,
        pcommentID: this.comments[index].pcommentID,
        isLiked: this.comments[index].isLiked,
      }).then(() => {
      }).catch((err) => {
        console.error(err);
      });
      // 更新点赞状态及点赞数
      this.comments[index].isLiked = !this.comments[index].isLiked;
      if (this.comments[index].isLiked) this.comments[index].likeNum += 1;
      else this.comments[index].likeNum -= 1;
    },
    cclike(index, subIndex) {
      this.ccommentlike({
        userTelephone: this.userTelephone,
        ccommentID: this.comments[index].subComments[subIndex].ccommentID,
        isLiked: this.comments[index].subComments[subIndex].isLiked,
      }).then(() => {
      }).catch((err) => {
        console.error(err);
      });
      // 更新点赞状态及点赞数
      // eslint-disable-next-line max-len
      this.comments[index].subComments[subIndex].isLiked = !this.comments[index].subComments[subIndex].isLiked;
      // eslint-disable-next-line max-len
      if (this.comments[index].subComments[subIndex].isLiked) this.comments[index].subComments[subIndex].likeNum += 1;
      else this.comments[index].subComments[subIndex].likeNum -= 1;
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
    async pcommentsShow() {
      const postid = this.post.postID;
      // 请求
      try {
        const { data } = await this.showPcomments({
          userTelephone: this.userTelephone, postID: postid,
        });
        const comments = data.map((pcomment) => ({
          pcommentID: pcomment.PcommentID,
          author: pcomment.Author,
          authorAvatar: pcomment.AuthorAvatar,
          commentTime: pcomment.CommentTime,
          content: pcomment.Content,
          likeNum: pcomment.LikeNum,
          subComments: pcomment.SubComments,
          isLiked: pcomment.IsLiked,
          showReplyForm: false,
          showAllReplies: false,
          heat: pcomment.LikeNum + len(pcomment.SubComments),
        }));
        this.comments = this.sortcomments(comments);
        // .sort((a, b) => new Date(b.commentTime) - new Date(a.commentTime))
        // this.comments = data;
      } catch (err) {
        console.error(err);
      }
    },
    sortcomments(comments) {
      if (this.sortkind === 'Date') {
        return comments.sort((a, b) => new Date(b.commentTime) - new Date(a.commentTime));
      }
      return comments.sort((a, b) => b.heat - a.heat);
    },
    // 发表帖子评论
    pcommentPost() {
      this.pcomment.postID = this.post.postID;
      this.pcomment.userTelephone = this.userTelephone;
      this.postPcomment(this.pcomment).then(() => {
        this.$bvToast.toast('评论成功', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
        setTimeout(() => {
          this.pcommentsShow();
          this.pcomment.content = '';
        }, 1000);
      })
        .catch((err) => {
          this.$bvToast.toast(err.msg, {
            title: '发帖失败',
            variant: 'danger',
            solid: true,
          });
        });
    },
    // 发表评论的评论或者回复评论的评论
    ccommentPost(index, author) {
      const comment = this.comments[index];
      this.ccomment.pcommentID = comment.pcommentID;
      this.ccomment.userTelephone = this.userTelephone;
      this.ccomment.userTargetName = author;
      this.postCcomment(this.ccomment).then(() => {
        this.$bvToast.toast('回复成功', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
        setTimeout(() => {
          this.pcommentsShow();
          // 清空输入的内容
          this.ccomment.content = '';
        }, 1000);
      })
        .catch((err) => {
          this.$bvToast.toast(err.response.data.msg, {
            title: '回复失败',
            variant: 'danger',
            solid: true,
          });
        });
    },
    visibleSubComments(index) {
      if (this.comments[index].showAllReplies === true) {
        return this.comments[index].subComments;
      }
      return this.comments[index].subComments.slice(0, 5);
    },
  },
};
</script>

<style>
@import '../../style/css/PostDetailsView.css';
</style>
