<template>
  <div>
    <!-- 通知列表 -->
    <b-list-group v-if="notices.length > 0" class="notification-list">
      <transition-group name="list" tag="div">
      <b-list-group-item
          v-for="(notice, index) in notices"
          :key="index"
          @click="viewNotice(notice,index)"
          class="notification-item"
          :class="{ 'notification-unread': !notice.read }">
        <div class="d-flex align-items-center">
          <!-- 头像 -->
          <b-avatar  v-if="notice.type==='pcomment'|| notice.type==='ccomment'"
                     :src="notice.senderAvatar" size="2rem" class="mr-2"></b-avatar>
          <!-- 发送者名字和通知内容 -->
          <div class="d-flex flex-column justify-content-center">
            <small class="text-muted">{{ formatDate(notice.time) }}</small>
            <div class="d-flex align-items-center justify-content-between">
              <span v-if="notice.type==='pcomment'|| notice.type==='ccomment'"
                    class="sender mr-2">{{ notice.senderName }}</span>
              <!-- 内容和类型 -->
              <span v-if="notice.type === 'pcomment'">评论了你的帖子:</span>
              <span v-if="notice.type === 'ccomment'">回复了你的评论:</span>
              <span v-if="notice.type === 'punishment'" style="color: red">警告，你的账号出现违规：</span>
              <span v-if="notice.type === 'sue'">你的举报已得到处理：</span>
              <span v-if="notice.type === 'feedback'">你的反馈已得到处理回复：</span>
              <span style="color: gray">
                {{ notice.content.length > 5 ?
                  notice.content.slice(0,5)+'...' : notice.content+'' }}</span>
              <!-- 标记未读 -->
              <transition name="fade">
                <span v-if="!notice.read" class="badge badge-danger ml-2 pop">New</span>
              </transition>
            </div>
        </div>
        </div>
      </b-list-group-item>
      </transition-group>
    </b-list-group>
    <p v-else>没有通知</p>

    <!-- 查看通知弹窗 -->
    <b-modal v-if="currentNotice" v-model="modalVisible" hide-footer @hide="markAsRead">
      <div class="d-flex align-items-center">
        <!-- 头像 -->
        <b-avatar v-if="notice.type==='pcomment'|| notice.type==='ccomment'"
                  :src="currentNotice.senderAvatar" size="2rem" class="mr-2"></b-avatar>
        <div class="flex-grow-1">
          <!-- 标题 -->
          <div class="d-flex justify-content-between align-items-center">
            <span class="sender" v-if="notice.type==='pcomment'|| notice.type==='ccomment'"
                  STYLE="color: #409EFF">{{ currentNotice.senderName }}</span>
            <span v-else STYLE="color:saddlebrown">系统通知：</span>
          </div>
          <!-- 内容和类型 -->
          <div>
            <small class="text-muted">{{ formatDate(notice.time) }}</small>
            <span v-if="currentNotice.type === 'pcomment'">评论了你的帖子:</span>
            <span v-if="currentNotice.type === 'ccomment'">回复了你的评论:</span>
            <span v-if="currentNotice.type === 'punishment'" style="color: red">警告，你的账号出现违规：</span>
            <span v-if="currentNotice.type === 'sue'">你的举报已得到处理：</span>
            <span v-if="currentNotice.type === 'feedback'">你的反馈已得到处理回复：</span>
            <span class="preview mb-1" style="color:gray">{{ currentNotice.content }}</span>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import request from '@/utils/request';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      notices: [],
      currentNotice: null,
      currentIndex: 0,
      modalVisible: false, // 弹出窗口是否可见
    };
  },
  mounted() {
    this.getNotices();
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.userModule.userInfo,
    }),

  },
  created() {
    if (this.$route.params.before) {
      this.before = this.$route.params.before;
    }
  },
  methods: {
    // 获取通知列表
    getNotices() {
      request.get('/auth/getNotice').then((response) => {
        // 注意这里接受的notice的字段是小写开头的驼峰,下面是对应的go结构体
        // type NoticeResponse struct {
        //   NoticeID     int    `json:"noticeID"`
        //   ReceiverName string `json:"receiverName"`
        //   SenderName   string `json:"senderName"`
        //   SenderAvatar string `json:"senderAvatar"`
        //   Type         string `json:"type"`
        //   Content      string `json:"content"`
        //   Read         bool   `json:"read"`
        //   PostID       int    `json:"postID"`
        //   Target       int    `json:"target"`
        //   PcommentID   int    `json:"pcommentID"`
        // }
        this.notices = response.data.sort((a, b) => {
          // 先比较是否已读
          if (a.read && !b.read) {
            return 1;
          } if (!a.read && b.read) {
            return -1;
          }
          // 如果两个通知都已读或都未读，则比较时间
          const timeA = Date.parse(a.time);
          const timeB = Date.parse(b.time);
          if (timeA < timeB) {
            return 1;
          } if (timeA > timeB) {
            return -1;
          }
          return 0;
        });
      }).catch((error) => {
        console.error(error);
      });
    },
    // 查看通知
    viewNotice(notice, index) {
      this.currentNotice = notice;
      this.currentIndex = index;
      this.modalVisible = true;
    },
    // 标记为已读
    markAsRead() {
      if (this.currentNotice.read === false) {
        const { noticeID } = this.currentNotice;
        request.patch(`/auth/readNotice/${noticeID}`, { read: true }).then(() => {
          this.notices[this.currentIndex].read = true;
          this.currentIndex = 0;
        }).catch((error) => {
          console.error(error);
        });
      }
      this.currentNotice = null;
    },
    showDetails() {
      // 标为已读
      const nowNotice = this.currentNotice;
      // const nowComment = this.currentComment;
      this.markAsRead();
      if (!this.userInfo) {
        this.toLogin = true;
        return;
      }
      // 跳转到对应的帖子
      if (nowNotice.type === 'pcomment') {
        this.$router.push({
          name: 'postDetails',
          params: {
            id: nowNotice.postID, partition: this.partition, before: 'notice', pcommentID: nowNotice.target,
          },
        });
      } else if (nowNotice.type === 'ccomment') {
        this.$router.push({
          name: 'postDetails',
          params: {
            id: nowNotice.postID, partition: this.partition, before: 'notice', pcommentID: nowNotice.pcommentID, ccommentID: nowNotice.target,
          },
        });
      }
    },
    formatDate(date) {
      // 格式化日期时间
      const d = new Date(date);
      return `${d.getFullYear()}年${
        d.getMonth() + 1
      }月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    },
  },
};
</script>
<style>
.notification-item {
  cursor: pointer;
}

.notification-item:hover {
  background-color: #f5f5f5;}

.postjump:hover {
  color: cornflowerblue;
  cursor: pointer;
}

@keyframes pop {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}
.pop {
  animation: pop 0.5s ease-in-out;
}
.list-enter-active, .list-leave-active {
  transition: opacity 0.5s;
}
.list-enter, .list-leave-to {
  opacity: 0;
}
</style>
