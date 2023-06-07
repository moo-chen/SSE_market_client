<template>
  <div class="full-screen-container">
    <vue-particles
        class="particles-bg"
        color="#39AFFD"
        :particle-opacity="0.7"
        :particles-number="100"
        shape-type="circle"
        :particle-size="4"
        lines-color="#8DD1FE"
        :lines-width="1"
        :line-linked="true"
        :line-opacity="0.4"
        :lines-distance="150"
        :move-speed="3"
        :hover-effect="true"
        hover-mode="grab"
        :click-effect="true"
        click-mode="push"
    />
  <div class='login-view'>
    <div class='login' @keydown.enter='login'>
      <b-row class='mt-5'>
        <b-col md='8' offset-md='2' lg='6' offset-lg='3'>
          <b-card style="margin-top:-50px">
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
<style lang='scss' scoped>
.full-screen-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
