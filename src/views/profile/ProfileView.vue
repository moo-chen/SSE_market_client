<template>
  <div style="margin-left:200px;">
    <h4>个人信息</h4>
    <el-upload
        class="avatar-uploader"
        action="https://localhost:8080/api/auth/uploadavatar"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="Uploaded Avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div class="mt-5">
      <el-form :model="userInfo" @submit.native.prevent="updateUserInfo">
        <el-row>
          <el-col :span="5" class="field-col">
            <el-form-item label="用户名">
              <el-input v-model="userInfo.name" required></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" class="field-col">
            <el-form-item label="手机">
              <el-input v-model="userInfo.phone" required :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" class="field-col">
            <el-form-item label="邮箱">
              <el-input v-model="userInfo.email" required :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="个人简介">
          <el-input type="textarea" v-model="userInfo.intro"></el-input>
        </el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form>
    </div>
    <el-button type="text" @click="open">点击查看更多信息</el-button>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import request from '@/utils/request';

export default {
  computed: mapState({
    user: (state) => state.userModule.userInfo,
  }),
  data() {
    return {
      imageUrl: '',
      userTelephone: '',
      userInfo: {
        userID: '',
        phone: '',
        email: '',
        name: '',
        num: '',
        intro: '',
        ban: '',
        punishnum: '',
        avatarURL: '',
      },
    };
  },
  created() {
    this.getInfo({ phone: this.user.phone })
      .then((res) => {
        this.userInfo.userID = res.data.userID;
        this.userInfo.name = res.data.name;
        this.userInfo.num = res.data.num;
        this.userInfo.phone = res.data.phone;
        this.userInfo.email = res.data.email;
        this.userInfo.intro = res.data.intro;
        this.userInfo.ban = res.data.ban;
        this.userInfo.punishnum = res.data.punishnum;
        this.userInfo.avatarURL = res.data.avatarURL;
        this.imageUrl = this.userInfo.avatarURL;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  methods: {

    open() {
      if (this.userInfo.punishnum !== 0) {
        this.$alert(`解除封禁日期：${this.userInfo.ban}，违规次数：${this.userInfo.punishnum}次\n`, '违规信息', {
          confirmButtonText: '确定',
        });
      } else {
        this.$alert('您没有违规记录，请继续保持~', '违规信息', {
          confirmButtonText: '确定',
        });
      }
    },
    handleAvatarSuccess(res) {
      this.imageUrl = res.data.avatar_url;
      this.userInfo.avatarURL = this.imageUrl;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isJPG && isLt2M;
    },
    ...mapActions('userModule', { getInfo: 'getInfo' }),
    updateUserInfo() {
      const updatedUserInfo = {
        userID: this.userInfo.userID,
        name: this.userInfo.name,
        num: this.userInfo.num,
        intro: this.userInfo.intro,
        avatarURL: this.userInfo.avatarURL,
      };

      request.post('https://localhost:8080/api/auth/updateUserInfo', updatedUserInfo)
        .then((response) => {
          // 处理更新成功的逻辑
          console.log(response);
          console.log('用户信息更新成功');
          this.$bvToast.toast('用户信息更新成功', {
            title: '系统提醒',
            variant: 'primary',
            solid: true,
          });
        })
        .catch((error) => {
          // 处理更新失败的逻辑
          console.error('用户信息更新失败', error);
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.field-col {
  margin-left: 10px;
}
</style>
