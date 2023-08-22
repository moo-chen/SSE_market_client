<template>
  <div class='login-view'>
    <div class='login' @keydown.enter='login'>
      <b-row class='mt-5'>
        <b-col md='8' offset-md='2' lg='6' offset-lg='3'>
          <b-card style="margin-top:-50px">
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
              <a href="#" onclick="window.open('/register', '_blank');">立即注册！</a>
            </b-col>
            <b-col class="text-right">
              <a href="#" onclick="window.open('/identityValidate', '_blank');">忘记密码？</a>
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

import { mapActions } from 'vuex';
import customValidator from '@/helper/validator';

export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
    };
  },
  validations: {
    user: {
      email: {
        required,
        email: customValidator.emailValidator,
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
          this.$router.go(0);
        })
        .catch((err) => {
          this.$bvToast.toast(err.response.data.msg, {
            title: '数据验证错误',
            variant: 'danger',
            solid: true,
          });
        });
    },
    toRegister() {
      window.open('/register', '_blank');
    },
  },
};
</script>
