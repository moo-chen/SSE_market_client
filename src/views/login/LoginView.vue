<template>
    <div class="login-view">
      <div class='login' @keydown.enter="login">
    <b-row class='mt-5'>
      <b-col md='8' offset-md='2' lg='6' offset-lg='3'>
        <b-card title='登录'>
          <b-form>
            <b-form-group label='手机号'>
              <b-form-input
                v-model='$v.user.phone.$model'
                type='number'
                placeholder='输入手机号'
                :state="validateState('phone')"
              ></b-form-input>
              <b-form-invalid-feedback :state="validateState('phone')">
                手机号不符合要求
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group label='密码'>
              <b-form-input
                v-model='$v.user.password.$model'
                type='password'
                placeholder='输入密码'
                :state="validateState('password')"
              ></b-form-input>
              <b-form-invalid-feedback :state="validateState('password')">
                密码必须大于等于 6 位
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <b-button @click='login' variant='outline-primary' block>登录</b-button>
            </b-form-group>
          </b-form>
          <b-row>
            <b-col>
              <button class="register-button" @click="$router.push({ name : 'register'})">
                没有账号？注册</button>
            </b-col>
            <b-col class="text-right">
              <button class="changePassword-button"
              @click="$router.push({ name : 'changePassword'})">忘记密码？</button>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>
    </div>
</template>
<script>
import { required, minLength } from 'vuelidate/lib/validators';

import customValidator from '@/helper/validator';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      user: {
        phone: '',
        password: '',
      },
    };
  },
  validations: {
    user: {
      phone: {
        required,
        phone: customValidator.telephoneValidator,
      },
      password: {
        required,
        minLength: minLength(6),
      },
    },
  },

  methods: {
    ...mapActions('userModule', { userlogin: 'login' }),
    validateState(name) {
      // 这里是es6 解构赋值
      const { $dirty, $error } = this.$v.user[name];
      return $dirty ? !$error : null;
    },
    login() {
      // 验证数据
      this.$v.user.$touch();
      if (this.$v.user.$anyError) {
        return;
      }
      // 请求
      this.userlogin(this.user)
        .then(() => {
          this.$router.replace({ name: 'home', params: { partition: '主页' } });
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
<style lang='scss' scoped>
.login-view {
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

.login {
  height: 1000px;
  width: 1200px;
  margin-top: 200px !important;
  margin-left: 250px !important;
}
.register-button {
  background: none;
  border: none;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
  z-index: 100;
}
.changePassword-button {
  background: none;
  border: none;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
  z-index: 100;
}
</style>
