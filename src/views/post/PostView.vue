<template>
  <div class='post'>
    <b-row class='mt-4' style="margin-left:200px;">
      <b-col md='8' offset-md='2' lg='10' offset-lg='1'>
        <b-card style="max-width: 1200px;max-height: 800px;">
          <b-form-group label='标题'>
            <b-form-input v-model='posts.title' type='text'></b-form-input>
          </b-form-group>
          <b-form-group label='正文'>
            <b-form-textarea v-model='posts.content' :rows='20'></b-form-textarea>
          </b-form-group>
          <el-upload
              action="http://localhost:8080/api/auth/uploadphotos"
              list-type="picture-card"
              multiple
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <b-form-group label='选择分区'>
            <b-form-select v-model='posts.partition'>
              <b-form-select-option value='日常吐槽'>日常吐槽</b-form-select-option>
              <b-form-select-option value='学习交流'>学习交流</b-form-select-option>
              <b-form-select-option value='恋爱交友'>恋爱交友</b-form-select-option>
              <b-form-select-option value='二手闲置'>二手闲置</b-form-select-option>
              <b-form-select-option value='打听求助'>打听求助</b-form-select-option>
              <b-form-select-option value='其他'>其他</b-form-select-option>
            </b-form-select>
          </b-form-group>
          <div class='d-flex justify-content-center w-100'>
            <b-button variant='primary' @click="$router.replace({ name: 'profile' })">
              取消发帖
            </b-button>
            <div class='mx-3'></div>
            <b-button variant='primary' @click='post'> 确认发帖 </b-button>
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
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      posts: {
        userTelephone: '',
        title: '',
        content: '',
        partition: '',
        photos: '',
      },
    };
  },
  methods: {
    handleSuccess(response, file) {
      this.fileList.push({ name: file.name, url: response.fileURL });
    },
    handleRemove(file, fileList) {
      this.fileList = this.fileList.filter((item) => item.name !== file.name);
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    ...mapActions('postModule', { Post: 'post' }),
    post() {
      this.posts.userTelephone = this.userInfo.phone;
      // 提取 fileList 中的所有 url，并连接成一个字符串
      this.posts.photos = this.fileList.map((file) => file.url).join('|');
      // 请求
      this.Post(this.posts)
        .then(() => {
          this.$bvToast.toast('发帖成功', {
            title: '系统提醒',
            variant: 'primary',
            solid: true,
          });
          // 跳转主页
          setTimeout(() => {
            this.$router.replace({ name: 'home' });
          }, 1000);
        })
        .catch((err) => {
          this.$bvToast.toast(err.response.data.msg, {
            title: '数据验证错误',
            variant: 'danger',
            solid: true,
          });
        });
    },
  },
};
</script>

<style lang='scss' scoped></style>
