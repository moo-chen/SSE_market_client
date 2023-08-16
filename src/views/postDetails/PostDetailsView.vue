<template>
  <div>
    <b-button variant="primary" class="back_button"
      @click="goback" style="margin-left: 60px;">
      <b-icon-reply class="mr-2"></b-icon-reply>返回
    </b-button>
  <div class='postDetails' style="margin-left:200px">
    <b-card class='mx-auto my-5' style="max-width: 1500px;"
    :style="{ 'background-color': isNightStyle ? 'rgb(50,50,50)' : 'white',
          'color': isNightStyle ? 'gray' : null}">
      <div class="text-muted" style="margin-left:850px;" @click.stop>
        <b-icon icon="three-dots-vertical" @click.stop="toggleMenu"></b-icon></div>
      <b-list-group v-if="this.post.showMenu" style="width:100px;height:1.25rem;margin-left: 880px;
        margin-top: -20px;font-size: 0.9rem;" @click.stop>
          <b-list-group-item :style="{ 'background-color': isNightStyle ? 'rgb(50,50,50)' : 'white',
                    'color': isNightStyle ? 'gray' : null}">
            <b-icon class="mr-2" :icon="post.isSaved ? 'star-fill' : 'star'"
            @click.stop="save()" :class="{ 'text-warning': post.isSaved }"></b-icon>收藏
          </b-list-group-item>
          <b-list-group-item v-if="this.post.authorTelephone !== userInfo.phone"
          :style="{ 'background-color': isNightStyle ? 'rgb(50,50,50)' : 'white',
                    'color': isNightStyle ? 'gray' : null}"
            @click.stop="showReportModal = true">
            <b-icon-exclamation-triangle class="mr-2"></b-icon-exclamation-triangle>举报
          </b-list-group-item>
          <b-modal v-model="showReportModal" title="举报" @hidden="clearReportReason"
            @ok="submitReport('post',post.postID)" ok-title="Submit">
            <b-form-textarea v-model="reportReason" placeholder="请输入举报原因" rows="8">
            </b-form-textarea>
          </b-modal>
          <b-list-group-item v-if="this.post.authorTelephone === userInfo.phone"
          :style="{ 'background-color': isNightStyle ? 'rgb(50,50,50)' : 'white',
                    'color': isNightStyle ? 'gray' : null}"
            @click.stop="showDeleteModal = true">
            <b-icon-trash class="mr-2"></b-icon-trash>删除
          </b-list-group-item>
          <b-modal v-model="showDeleteModal" title="确认删除" ok-title="Confirm"
            @ok="postdelete(post)">
            <p>你确定要删除这个帖子吗？</p>
          </b-modal>
      </b-list-group>
      <b-avatar :src="post.authorAvatar" size="5rem" class="mr-3"></b-avatar>
      <div class='author-box mb-2' :style="{ 'background-color': isNightStyle ?
                  'rgb(246, 155, 10)' : 'rgb(17, 167, 226)' }">
        {{ post.author }}</div>
      <b-card-title>{{ post.title }}</b-card-title>
      <b-card-text>{{ post.content }}</b-card-text>
      <div v-if="fileListGet.length > 0" class="photo-viewer">
        <div class="thumbnail-container">
          <template v-if="fileListGet.length === 4">
            <div>
              <img :src="fileListGet[0]"
                  width="270"
                  height="270"
                  @click="handlePictureCardPreview(fileListGet[0])"
                  @keyup.enter="handlePictureCardPreview(fileListGet[0])"
                  alt="Post Photo" />
              <img :src="fileListGet[1]"
                  width="270"
                  height="270"
                  style="margin-top:20px"
                  @click="handlePictureCardPreview(fileListGet[1])"
                  @keyup.enter="handlePictureCardPreview(fileListGet[1])"
                  alt="Post Photo" />
            </div>
            <div>
              <img :src="fileListGet[2]"
                  width="270"
                  height="270"
                  @click="handlePictureCardPreview(fileListGet[2])"
                  @keyup.enter="handlePictureCardPreview(fileListGet[2])"
                  alt="Post Photo" />
              <img :src="fileListGet[3]"
                  width="270"
                  height="270"
                  style="margin-top:20px"
                  @click="handlePictureCardPreview(fileListGet[3])"
                  @keyup.enter="handlePictureCardPreview(fileListGet[3])"
                  alt="Post Photo" />
            </div>
          </template>
          <template v-else>
            <div v-for="(file, index) in fileListGet" :key="index">
              <img :src="file"
                  width="270"
                  height="270"
                  @click="handlePictureCardPreview(file)"
                  @keyup.enter="handlePictureCardPreview(file)"
                  alt="Post Photo" />
            </div>
          </template>
        </div>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="Preview" />
        </el-dialog>
      </div>
      <div class="d-flex justify-content-between">
        <div class='d-flex justify-content-between'>
          <small class='text-muted'>{{ formatDate(post.postTime) }}</small>
        </div>
        <div class="tag-group">
          <span class="tag-group__title"></span>
          <el-tag v-for="tag in post.tag" :key="tag.label" :type="tag.type"
          effect="plain" size="mini">{{ tag.label }}
          </el-tag>
        </div>
      </div>
      <div class='d-flex justify-content-between align-items-center mt-3'>
        <div class="text-muted">
          <b-icon :icon="post.isLiked ? 'heart-fill' : 'heart'"
          @click.stop="like()" :class="{ 'text-danger': post.isLiked }"></b-icon>
          {{ post.like }}
        </div>
        <div class="text-muted">
              <b-icon-eye-fill></b-icon-eye-fill> {{ post.browse }}
        </div>
        <div class='text-muted'><b-icon icon='chat-dots-fill'></b-icon> {{ commentsNum }}</div>
      </div>
    </b-card>
    <b-button @click="post.showCommentForm
            = !post.showCommentForm" variant="primary">
      {{ post.showCommentForm ? '隐藏评论' : '评论' }}
    </b-button>
  <!--显示帖子评论窗口-->
  <div v-if="post.showCommentForm" style="margin-top:10px">
        <b-form-group>
          <b-form-textarea v-model="pcomment.content"
          placeholder="请写下你的精彩评论..." rows="3">
          </b-form-textarea>
        </b-form-group>
        <div>
          <button  variant='primary' @click="showEmojiStatus()">😀</button>
            <div v-if="showEmoji">
              <picker
                :include="['people']"
                :showSearch="false"
                :showPreview="false"
                :showCategories="false"
                @select="addEmojiToPcomment"
              />
            </div>
        </div>
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
    <div v-for="(comment, index) in visibleComments"
         :key="index" ref="commentRef" :id="`comment-${comment.pcommentID}`">
      <b-card class="my-1" :style="{ 'background-color': isNightStyle ? 'rgb(50,50,50)' : 'white',
          'color': isNightStyle ? 'gray' : null }">
        <div class="d-flex mb-2">
          <div class="flex-shrink-0 mr-3">
            <b-avatar :src="comment.authorAvatar" size="2rem"></b-avatar>
          </div>
          <div>
            <div class="font-weight-bold">{{ comment.author }}</div>
            <div>{{ comment.content }}</div>
            <!--显示每个评论的点赞和回复数-->
            <div class='d-flex justify-content-between align-items-center mt-3'>
              <div class="text-muted">
                <b-icon :icon="comment.isLiked ? 'heart-fill' : 'heart'"
                        @click.stop="pclike(index)" :class="{ 'text-danger': comment.isLiked }">
                </b-icon>
                {{ comment.likeNum }}
              </div>
            </div>
            <div class="text-muted">{{ formatDate(comment.commentTime) }}</div>
            <b-button @click="comment.showReplyForm
            = !comment.showReplyForm" class="mr-2 btn-sm"
            variant="primary" style="margin-top:10px">
              {{ comment.showReplyForm ? '隐藏评论' : '评论' }}
            </b-button>
            <div class='text-muted' style='margin-left: 820px' @click.stop>
              <b-icon icon='three-dots-vertical' @click.stop="comment.showMenu =
              !comment.showMenu"></b-icon>
            </div>
            <b-list-group
            v-if='comment.showMenu'
            style='
              width: 100px;
              height: 1.25rem;
              margin-left: 850px;
              margin-top: -20px;
              font-size: 0.9rem;
            '
            @click.stop
          >
            <b-list-group-item
              v-if='comment.authorTelephone !== userInfo.phone'
              @click.stop='showReportModal = true'
            >
              <b-icon-exclamation-triangle class='mr-2'></b-icon-exclamation-triangle>举报
            </b-list-group-item>
            <b-modal
              v-model='showReportModal'
              title='举报'
              @hidden='clearReportReason'
              @ok='submitReport("pcomment",comment.pcommentID)'
              ok-title='Submit'
            >
              <b-form-textarea v-model='reportReason' placeholder='请输入举报原因' rows='8'>
              </b-form-textarea>
            </b-modal>
            <b-list-group-item
              v-if='comment.authorTelephone === userInfo.phone'
              @click.stop='showDeleteModal = true'
            >
              <b-icon-trash class='mr-2'></b-icon-trash>删除
            </b-list-group-item>
            <b-modal
              v-model='showDeleteModal'
              title='确认删除'
              ok-title='Confirm'
              @ok='pcommentdelete(comment)'
            >
              <p>你确定要删除这条评论吗？</p>
            </b-modal>
          </b-list-group>
            <!--如果点击了评论，将显示评论窗口-->
            <div v-if="comment.showReplyForm" style="margin-top:10px">
              <form @submit.prevent="ccommentPost(index)">
                <b-form-group>
                  <b-form-textarea v-model="ccomment.content"
                                   placeholder="请写下你的精彩评论..." rows="3">
                  </b-form-textarea>
                </b-form-group>
                <div>
                  <button  type="button" variant='primary' @click="showEmojiStatus()">😀</button>
                  <div v-if="showEmoji">
                    <picker
                      :include="['people']"
                      :showSearch="false"
                      :showPreview="false"
                      :showCategories="false"
                      @select="addEmojiToCcomment"
                    />
                  </div>
                </div>
                <b-button type="submit" variant="primary">
                  提交评论</b-button>
              </form>
            </div>
            <!-- 显示评论的评论 -->
            <b-button v-if="comment.subComments.length > 0"
                      @click="showRepliesModal=true;showcommentsindex=index"
                      variant="outline-primary"
                      style="font-size: 12px;margin-top:10px">
              查看评论共{{len(comment.subComments)}}条
            </b-button>
            <b-modal hide-footer v-model="showRepliesModal"  v-if="index===showcommentsindex">
            <transition-group name="comment-list" tag="div">
            <div v-for="(subComment, subIndex) in visibleSubComments(index)"
                 :key="subIndex" :id="`ccomment-${subComment.ccommentID}`" tabindex="0">
              <hr>
              <div class="d-lg-flex mb-2" @mouseover="isHovered = true;
                nowSubIndex = subIndex;nowIndex = index"
                   @mouseleave="nowIndex =0"
                   @focus="nowSubIndex = subIndex"
                   @focusout="nowSubIndex = subIndex;isHovered = false">
                <div class="flex-shrink-0 mr-3">
                  <b-avatar :src="subComment.authorAvatar" size="2rem"></b-avatar>
                </div>
                <div>
                  <div class="font-weight-bold">{{ subComment.author }}</div>
                  <div v-if="subComment.userTargetName !== ''">
                    <span style="color: cadetblue">回复@{{ subComment.userTargetName }}:</span>
                  </div>
                  <div>{{ subComment.content }}</div>
                  <div class="text-muted">{{ formatDate(subComment.commentTime) }}</div>
                </div>
                <div class="text-muted">
                  <b-icon :icon="subComment.isLiked ? 'heart-fill' : 'heart'"
                          @click.stop="cclike(index,subIndex)"
                          :class="{ 'text-danger': subComment.isLiked }">
                  </b-icon>
                  {{ subComment.likeNum }}
                </div>
          <div class="d-flex justify-content-end">
            <div class='text-muted' style='margin-top: -19px; position: relative;margin-top: 50px;'>
              <div v-if="subComment.authorTelephone !== userInfo.phone"
              style="position: absolute; top: 0; right: 0;">
                <b-icon icon='exclamation-triangle' @click.stop='showReportModal = true'></b-icon>
                <b-modal
                  v-model='showReportModal'
                  title='举报'
                  @hidden='clearReportReason'
                  @ok='submitReport("ccomment",subComment.ccommentID)'
                  ok-title='Submit'
                >
                  <b-form-textarea v-model='reportReason'
                  placeholder='请输入举报原因' rows='8'></b-form-textarea>
                </b-modal>
              </div>
              <div v-else style="position: absolute; top: 0; right: 0;">
                <b-icon icon='trash' @click.stop='showDeleteModal = true'></b-icon>
                <b-modal
                  v-model='showDeleteModal'
                  title='确认删除'
                  ok-title='Confirm'
                  @ok='ccommentdelete(subComment)'
                >
                  <p>你确定要删除这条评论吗？</p>
                </b-modal>
              </div>
              </div>
            </div>
                <div v-if="isHovered && subIndex===nowSubIndex && index===nowIndex"
                style="margin-left:10px">
                  <!--回复按钮，点击后跳出评论的评论的回复窗口-->
                  <b-button @click="replyshow = !replyshow; nowReplyComment=subComment"
                  variant="outline-info">
                    回复
                  </b-button>
                </div>
              </div>
            </div>
            </transition-group>
              <b-modal hide-footer v-model="replyshow" v-if="index===showcommentsindex">
                <form @submit.prevent=
                          "ccommentPost(showcommentsindex,
                          nowReplyComment.author,
                          nowReplyComment.ccommentID)">
                  <b-form-group>
                    <b-form-textarea v-model="ccomment.content"
                                     :placeholder="'回复@'+nowReplyComment.author" rows="3">
                    </b-form-textarea>
                  </b-form-group>
                  <div>
                    <button  type="button" variant='primary' @click="showEmojiStatus()">😀</button>
                    <div v-if="showEmoji">
                      <picker
                        :include="['people']"
                        :showSearch="false"
                        :showPreview="false"
                        :showCategories="false"
                        @select="addEmojiToCcomment"
                      />
                    </div>
                  </div>
                  <b-button type="submit" variant="primary">
                    提交回复</b-button>
                </form>
              </b-modal>
              <b-button v-if="comment.subComments.length > 0 && len(comment.subComments) > 5"
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
import { Picker } from 'emoji-mart-vue';

export default {
  components: {
    Picker,
  },
  computed: {
    // 计算属性，根据当前展示的评论数和每次展示的评论数量，返回可见的评论
    visibleComments() {
      if (this.allComments === true) {
        return this.comments;
      }
      return this.comments.slice(0, 10);
    },
    fileListGet() {
      if (this.post.photos === '') return [];
      return this.post.photos.split('|');
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
    isNightStyle() {
      if (JSON.parse(localStorage.getItem('Style')) === 'night') {
        return true;
      }
      return false;
    },
    tagTypeMap() {
      return {
        大厂: '',
        高工资: 'success',
        实习: 'danger',
      };
    },
  },
  mounted() {
    // 获取当前评论ID
    this.currentPcommentID = this.$route.query.pcommentID;
    this.currentCcommentID = this.$route.query.ccommentID;
  },
  data() {
    return {
      // currentPcommentID和currentCcommentID是用来进行通知的跳转
      currentPcommentID: 0,
      currentCcommentID: 0,
      before: '',
      sortkind: 'Date',
      allComments: false,
      userTelephone: '',
      partition: '',
      showDeleteModal: false,
      showReportModal: false,
      showccmenu: false,
      reportReason: '',
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      post: {
        postID: 0,
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
        photos: '',
        browse: '',
      },
      comments: [],
      pcomment: {
        userTelephone: '',
        postID: '',
        content: '',
      },
      ccomment: {
        userTelephone: '',
        postID: 0,
        pcommentID: 0,
        content: '',
        userTargetName: '',
        ccommentID: 0,
      },
      // 用来记录是否悬停在子评论上
      isHovered: false,
      nowSubIndex: 0,
      nowIndex: 0,
      replyshow: false,
      // 用来修复发表评论后页面的跳转问题（尚未修复）
      showcommentsindex: 0, // 当先评论的回复所对应的帖子评论
      nowReplyComment: -1, // 当前想要回复的评论的评论
      showRepliesModal: false, // 显示窗口
      showEmoji: false,
    };
  },
  created() {
    if (typeof localStorage !== 'undefined') {
      if (!localStorage.getItem('Style')) {
        localStorage.setItem('Style', JSON.stringify('day'));
      }
    }
    if (this.$route.query.before) {
      this.before = this.$route.query.before;
      // 将postID保存在本地缓存中
      localStorage.setItem('Before', JSON.stringify(this.$route.query.before));
    } else {
      // 在本地缓存在直接读取postID
      this.before = JSON.parse(localStorage.getItem('Before'));
    }
    if (this.$route.query.id) {
      this.post.postID = parseInt(this.$route.query.id, 10);
      // 将postID保存在本地缓存中
      localStorage.setItem('PostID', JSON.stringify(this.$route.query.id));
    } else {
      // 在本地缓存在直接读取postID
      this.post.postID = JSON.parse(localStorage.getItem('PostID'));
    }
    if (this.$route.query.partition) {
      this.partition = this.$route.query.partition;
      // 将partition保存在本地缓存中
      localStorage.setItem('Partition', JSON.stringify(this.$route.query.partition));
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
        this.post.authorAvatar = post.data.UserAvatar;
        this.post.title = post.data.Title;
        this.post.content = post.data.Content;
        this.post.like = post.data.Like;
        this.post.comment = post.data.Comment;
        this.post.postTime = post.data.PostTime;
        this.post.tag = post.data.Tag ? post.data.Tag.split(',').map((tagText) => ({
          type: this.tagTypeMap[tagText.trim()],
          label: tagText.trim(),
        })) : [];
        this.post.isSaved = post.data.IsSaved;
        this.post.isLiked = post.data.IsLiked;
        this.post.showMenu = false;
        this.post.photos = post.data.Photos;
        this.post.browse = post.data.Browse;
      })
      .catch((err) => {
        console.error(err);
      });
    this.pcommentsShow();
    // 这里或许有比setTimeout更好的写法，但是暂时写不出来，
    // 所以先用setTimeout的方法来确保pcommentsShow执行完成之后再执行this.scrollToComment()
    setTimeout(() => {
      this.scrollToComment();
    }, 500);
  },
  beforeRouteLeave(to, from, next) {
    // 返回上一页面时清空本地缓存
    localStorage.removeItem('PostID');
    localStorage.removeItem('Before');
    next();
  },
  methods: {
    scrollToComment() {
      console.log('scrollToComment');
      // 获取当前评论所在的元素
      let commentEl = document.getElementById(`comment-${this.currentPcommentID}`);
      console.log(commentEl);
      // const commentRef = this.$refs.commentRef[3];
      // if (commentRef) {
      //   commentRef.setAttribute('tabindex', '-1');
      //   commentRef.scrollIntoView({ behavior: 'smooth', duration: 500 });
      // }
      if (commentEl === null) {
        this.allComments = true;
        const get = new Promise((resolve, reject) => {
          setTimeout(() => {
            commentEl = document.getElementById(`comment-${this.currentPcommentID}`);
            if (commentEl) resolve(commentEl);
            else reject(commentEl);
          });
        });
        get.then(() => {
          // 使用vue-scrollto插件平滑滚动到元素所在位置
          this.$scrollTo(commentEl, {
            duration: 750, // 滚动动画持续时间，单位为毫秒
            offset: -150, // 滚动偏移量，用于调整滚动位置
          });
          commentEl.classList.add('blink');
          setTimeout(() => {
            commentEl.classList.remove('blink');
          }, 10000);
          if (this.currentCcommentID) {
            const parentEl = commentEl.parentNode;
            this.showcommentsindex = Array.prototype.indexOf.call(parentEl.children, commentEl);
            this.showRepliesModal = true;
            setTimeout(() => {
              let childEl = document.getElementById(`ccomment-${this.currentCcommentID}`);
              console.log(childEl, this.currentCcommentID);
              if (childEl === null) {
                this.showAllReplies(this.showcommentsindex);
                setTimeout(() => {
                  childEl = document.getElementById(`ccomment-${this.currentCcommentID}`);
                });
              }
              if (childEl) {
                // 使用vue-scrollto插件平滑滚动到元素所在位置
                childEl.focus();
                childEl.classList.add('blink');
                setTimeout(() => {
                  childEl.classList.remove('blink');
                }, 10000);
              }
            }, 500);
          }
        }).catch((err) => {
          console.log(err);
        });
      } else {
        // 使用vue-scrollto插件平滑滚动到元素所在位置
        this.$scrollTo(commentEl, {
          duration: 750, // 滚动动画持续时间，单位为毫秒
          offset: -150, // 滚动偏移量，用于调整滚动位置
        });
        commentEl.classList.add('blink');
        setTimeout(() => {
          commentEl.classList.remove('blink');
        }, 10000);
        if (this.currentCcommentID) {
          const parentEl = commentEl.parentNode;
          this.showcommentsindex = Array.prototype.indexOf.call(parentEl.children, commentEl);
          this.showRepliesModal = true;
          setTimeout(() => {
            let childEl = document.getElementById(`ccomment-${this.currentCcommentID}`);
            console.log(childEl, this.currentCcommentID);
            if (childEl === null) {
              this.showAllReplies(this.showcommentsindex);
              const get = new Promise((resolve, reject) => {
                setTimeout(() => {
                  childEl = document.getElementById(`ccomment-${this.currentCcommentID}`);
                  if (childEl) resolve();
                  else reject();
                });
              });
              get.then(() => {
                childEl.focus();
                childEl.classList.add('blink');
                setTimeout(() => {
                  childEl.classList.remove('blink');
                }, 10000);
              }).catch((error) => {
                console.log(error);
              });
            }
          });
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file;
      this.dialogVisible = true;
    },
    len,
    ...mapActions('postModule', { postShowDetails: 'showDetails' }),
    ...mapActions('postModule', { postLike: 'like' }),
    ...mapActions('userModule', { postSave: 'save' }),
    ...mapActions('postModule', { deletepost: 'deletepost' }),
    ...mapActions('postModule', { submitreport: 'submitreport' }),
    ...mapActions('commentModule', { showPcomments: 'showPcomments' }),
    ...mapActions('commentModule', { deletePcomment: 'deletePcomment' }),
    ...mapActions('commentModule', { deleteCcomment: 'deleteCcomment' }),
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
      console.log(this.before);
      if (this.before === 'home') {
        this.$router.replace({ name: 'home', query: { partitions: this.partition } });
      } else if (this.before === 'save') {
        this.$router.replace({ name: 'save' });
      } else if (this.before === 'history') {
        this.$router.replace({ name: 'history' });
      } else if (this.before === 'notice') {
        this.$router.replace({ name: 'notice' });
      }
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
    pcommentdelete(comment) {
      this.deletePcomment({
        pcommentID: comment.pcommentID,
      }).then(() => {
        this.$router.go(0);
      }).catch((err) => {
        console.error(err);
      });
    },
    ccommentdelete(SubComment) {
      this.deleteCcomment({
        ccommentID: SubComment.ccommentID,
      }).then(() => {
        this.$router.go(0);
      }).catch((err) => {
        console.error(err);
      });
    },
    submitReport(type, idnum) {
      this.submitreport({
        TargetID: idnum,
        Targettype: type,
        userTelephone: this.userInfo.phone,
        Reason: this.reportReason,
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
          authorTelephone: pcomment.AuthorTelephone,
          commentTime: pcomment.CommentTime,
          content: pcomment.Content,
          likeNum: pcomment.LikeNum,
          subComments: pcomment.SubComments,
          isLiked: pcomment.IsLiked,
          showMenu: false,
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
    ccommentPost(index, author, ccommentID) {
      const comment = this.comments[index];
      this.ccomment.postID = this.post.postID;
      this.ccomment.pcommentID = comment.pcommentID;
      this.ccomment.userTelephone = this.userTelephone;
      this.ccomment.userTargetName = author;
      this.ccomment.ccommentID = ccommentID;
      this.postCcomment(this.ccomment).then(() => {
        this.$bvToast.toast('回复成功', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
        setTimeout(() => {
          this.showcommentsindex = 0;
          this.nowReplyComment = '';
          this.replyshow = false;
          this.pcommentsShow();
          // 清空输入的内容
          this.ccomment.content = '';
          this.ccomment.ccommentID = 0;
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
    addEmojiToPcomment(emoji) {
      this.pcomment.content += emoji.native;
    },
    addEmojiToCcomment(emoji) {
      this.ccomment.content += emoji.native;
    },
    showEmojiStatus() {
      this.showEmoji = !this.showEmoji;
    },
  },
};
</script>

<style>
@import '../../style/css/PostDetailsView.css';
.thumbnail-container {
  display: flex;
  flex-wrap: wrap;
}
.thumbnail-container div {
  width: calc(100% / 3);
  padding: 10px;
  box-sizing: border-box;
}
@keyframes blink {
  0% {
    opacity: 1;
    background-color: transparent;
  }
  50% {
    opacity: 0.5;
    background-color: gray;
  }
  100% {
    opacity: 1;
    background-color: transparent;
  }
}
/* 使用更具体的选择器 */
.blink {
  animation-name: blink;
  animation-duration: 1.0s;
  animation-iteration-count: 3;
  background-color: transparent !important; /* 覆盖框架中的样式 */
}
.emoji-mart[data-v-7bc71df8] {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  height: 300px;
  color: #ffffff !important;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  background: #fff;
}
</style>
