<template>
  <div class="identityValidate-view">
    <div class='identityValidate' @keydown.enter="modifyPassword">
  <b-row class='mt-5'>
    <b-col md='8' offset-md='2' lg='6' offset-lg='3'>
      <b-card title='身份验证'>
        <b-form>
          <b-form-group label='邮箱'>
            <b-form-input
              v-model='$v.user.email.$model'
              type='email'
              placeholder='输入邮箱'
              :state="validateState('email')"
            ></b-form-input>
            <b-form-invalid-feedback :state="validateState('email')">
              邮箱不符合要求
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group label='验证码'>
            <b-form-input
              v-model='$v.user.valiCode.$model'
              type='valiCode'
              placeholder='输入验证码'
              :state="validateState('valiCode')"
            ></b-form-input>
          </b-form-group>
          <b-form-group>
            <b-button @click='validateEmail' variant='outline-primary' block>获取验证码</b-button>
            <b-button @click='identityValidate' variant='outline-primary' block>修改密码</b-button>
          </b-form-group>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import customValidator from '@/helper/validator';

export default {
  data() {
    return {
      user: {
        email: '',
        valiCode: '',
        mode: '',
      },
    };
  },
  validations: {
    user: {
      email: {
        required,
        email: customValidator.emailValidator,
      },
      valiCode: {

      },
    },
  },
  methods: {
    ...mapActions('userModule', { idValidate: 'identityValidate' }),
    ...mapActions('userModule', { userValidate: 'validateEmail' }),
    validateState(name) {
      // 这里是es6 解构赋值
      const { $dirty, $error } = this.$v.user[name];
      return $dirty ? !$error : null;
    },
    validateEmailState(name) {
      // 这里是es6 解构赋值
      const { $dirty, $error } = this.$v.onlyEmail[name];
      return $dirty ? !$error : null;
    },
    validateEmail() {
      this.user.mode = 1;
      this.$v.user.$touch();
      if (this.$v.user.$anyError) {
        return;
      }
      this.userValidate(this.user).then(() => {
        this.$bvToast.toast('已发送验证码，请将邮箱发送的验证码输入以完成注册验证', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
      }).catch((err) => {
        this.$bvToast.toast(err.response.data.msg, {
          title: '发送邮箱错误',
          variant: 'danger',
          solid: true,
        });
      });
    },

    identityValidate() {
      this.user.mode = 1;
      this.$v.user.$touch();
      if (this.$v.user.$anyError) {
        return;
      }
      this.idValidate(this.user).then(() => {
        this.$bvToast.toast('身份验证成功,可以更改密码', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
        console.error(this.user.email);
        setTimeout(() => {
          this.$router.push({
            name: 'modifyPassword',
            query: { email: this.user.email },
          });
        }, 500);
      }).catch((err) => {
        if (err.response && err.response.data && err.response.data.msg) { // 新增判断
          this.$bvToast.toast(err.response.data.msg, {
            title: '数据验证错误',
            variant: 'danger',
            solid: true,
          });
        } else {
          console.error(err); // 输出错误
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
// 可以在这里直接写css语句，如果css语句较多也可写成一个css文件放在'style/css'里并用下列语句引入：
// @import '../../style/css/XXX.css';
.identityValidate-view {
background-image: url('../../assets/image/background.jpg');
background-size: cover;
background-position: center;
position: fixed;
top: 0;
left: 0;
margin-top: 0px !important;
height: 100vh;
width: 100vw;
}

.identityValidate {
height: 1000px;
width: 1200px;
margin-top: 180px !important;
margin-left: 250px !important;
}
</style>
