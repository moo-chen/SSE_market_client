<template>
  <div class='post'>
    <el-steps :active="3" simple>
      <el-step title="编辑题目与正文" icon="el-icon-edit"></el-step>
      <el-step title="上传图片(可选)" icon="el-icon-upload"></el-step>
      <el-step title="选择分区" icon="el-icon-s-unfold"></el-step>
      <el-step title="添加标签(可选)"></el-step>
      <el-step title="确认发帖" icon="el-icon-check"></el-step>
    </el-steps>
    <b-row class='mt-4'>
      <b-col md='8' offset-md='2' lg='10' offset-lg='1'>
        <b-card style='max-width: 1200px; max-height: 2000px'>
          <b-form-group label='标题'>
            <b-form-input ref="titleInput" v-model='posts.title' type='text'></b-form-input>
            <button variant='primary' @click="showEmojiOnTitle()">😀</button>
            <div v-if="showEmojiTitle">
              <picker
                :include="['people']"
                :showSearch="false"
                :showPreview="false"
                :showCategories="false"
                @select="addEmojiToTitle"
              />
            </div>
          </b-form-group>
          <b-form-group label='正文'>
            <b-form-textarea ref="contentTextarea" v-model="posts.content" :rows="20">
            </b-form-textarea>
            <button variant='primary' @click="showEmojiOnContent()">😀</button>
            <div v-if="showEmojiContent">
              <picker
                :include="['people']"
                :showSearch="false"
                :showPreview="false"
                :showCategories="false"
                @select="addEmojiToContent"
              />
            </div>
          </b-form-group>
          <el-upload
            :action="uploadPhotosActionURL"
            list-type='picture-card'
            multiple
            :on-preview='handlePictureCardPreview'
            :on-remove='handleRemove'
            :on-success='handleSuccess'
            accept=".jpg,.png"
          >
            <i class='el-icon-plus'></i>
          </el-upload>
          <el-dialog :visible.sync='dialogVisible'>
            <img width='100%' :src='dialogImageUrl' alt=''/>
          </el-dialog>
          <b-form-group label='选择分区' v-if="this.mode === 'post'">
            <b-form-select v-model='posts.partition'>
              <b-form-select-option value='日常吐槽'>日常吐槽</b-form-select-option>
              <b-form-select-option value='学习交流'>学习交流</b-form-select-option>
              <b-form-select-option value='恋爱交友'>恋爱交友</b-form-select-option>
              <b-form-select-option value='二手闲置'>二手闲置</b-form-select-option>
              <b-form-select-option value='打听求助'>打听求助</b-form-select-option>
              <b-form-select-option value='课程专区'>课程专区</b-form-select-option>
              <b-form-select-option value='其他'>其他</b-form-select-option>
            </b-form-select>
          </b-form-group>
          <el-select
            v-if="posts.partition==='课程专区'"
            v-model="tagitems"
            filterable
            default-first-option
            placeholder="请选择教师">
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
          <div class='d-flex justify-content-center w-100'>
            <div class='mx-3'></div>
            <b-button variant='primary' @click='send()'> 确认发布</b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Picker } from 'emoji-mart-vue';
import request from '@/utils/request';

export default {
  computed: mapState({
    userInfo: (state) => state.userModule.userInfo,
  }),
  props: {
    mode: String,
  },
  components: {
    Picker,
  },
  data() {
    return {
      options: [], // tag标签选择列表
      uploadPhotosActionURL: `${process.env.VUE_APP_BASE_URL}auth/uploadPhotos`,
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      posts: {
        userTelephone: '',
        title: '',
        content: '',
        partition: '主页',
        photos: '',
        tagList: [],
      },
      showEmojiTitle: false,
      showEmojiContent: false,
      tags: ['大厂', '实习', '高工资'],
      tagitems: [],
    };
  },
  methods: {
    ...mapActions('postModule', { Post: 'post' }),
    handleSuccess(response, file) {
      this.fileList.push({
        name: file.name,
        url: response.fileURL,
      });
    },
    handleRemove(file, fileList) {
      this.fileList = this.fileList.filter((item) => item.name !== file.name);
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    send() {
      if (this.mode === 'post') {
        this.post();
      } else if (this.mode === 'feedback') {
        this.feedback();
      }
    },
    post() {
      this.posts.userTelephone = this.userInfo.phone;
      // 提取 fileList 中的所有 url，并连接成一个字符串
      this.posts.photos = this.fileList.map((file) => file.url)
        .join('|');
      this.posts.tagList = this.tagitems;
      // 请求
      const loadingInstance = this.$loading({ fullscreen: true, lock: true, text: '正在发帖中...' });
      this.Post(this.posts)
        .then(() => {
          this.$bvToast.toast('发帖成功', {
            title: '系统提醒',
            variant: 'primary',
            solid: true,
          });
          // 跳转主页
          setTimeout(() => {
            loadingInstance.close();
            this.$router.go(0);
          }, 500);
        })
        .catch((err) => {
          this.$bvToast.toast(err.response.data.msg, {
            title: '数据验证错误',
            variant: 'danger',
            solid: true,
          });
          loadingInstance.close();
        });
    },
    // feedback() {
    //
    // },
    addEmojiToTitle(emoji) {
      const titleInput = this.$refs.titleInput.$el; // Get the title input element
      const startPos = titleInput.selectionStart; // Get the cursor's start position
      const endPos = titleInput.selectionEnd; // Get the cursor's end position

      // Insert the emoji at the cursor position in the title
      this.posts.title = this.posts.title.slice(0, startPos)
        + emoji.native + this.posts.title.slice(endPos);

      // Update the cursor position to be after the inserted emoji
      const newCursorPos = startPos + emoji.native.length;
      titleInput.setSelectionRange(newCursorPos, newCursorPos);
    },
    addEmojiToContent(emoji) {
      const textarea = this.$refs.contentTextarea.$el; // Get the textarea element
      const startPos = textarea.selectionStart; // Get the cursor's start position
      const endPos = textarea.selectionEnd; // Get the cursor's end position

      // Insert the emoji at the cursor position
      this.posts.content = this.posts.content.slice(0, startPos)
        + emoji.native + this.posts.content.slice(endPos);

      // Update the cursor position to be after the inserted emoji
      const newCursorPos = startPos + emoji.native.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    },
    showEmojiOnTitle() {
      this.showEmojiTitle = !this.showEmojiTitle;
    },
    showEmojiOnContent() {
      this.showEmojiContent = !this.showEmojiContent;
    },
    getTag() {
      request.get('/auth/getTags')
        .then((res) => {
          this.options = res.data.data.tags.map((tag) => ({
            label: tag.Name,
            value: tag.Value,
          }));
        });
    },
  },
  created() {
    this.getTag();
  },
};
</script>

<style lang='scss' scoped>
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
