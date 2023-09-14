<template>
  <div class='login-view'>
    <div class='login' @keydown.enter='login'>
      <b-row class='mt-5'>
        <b-col md='8' offset-md='2' lg='6' offset-lg='3'>
          <b-card style="margin-top:100px;height: 350px;width: 800px;">
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
                <b-form-checkbox
                  v-model="rememberMe"
                  name="rememberMe"
                >
                  记住我
                </b-form-checkbox>
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

// eslint-disable-next-line import/no-extraneous-dependencies
import CryptoJS from 'crypto-js';

export default {
  data() {
    return {
      user: {
        email: '',
        password: '',
      },
      rememberMe: false, // Added rememberMe property
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

  mounted() {
    // Load saved login information if rememberMe is true
    if (localStorage.rememberMe === 'true') {
      this.user.email = localStorage.email || '';
      this.user.password = localStorage.password || '';
      this.rememberMe = true;
    }
  },

  methods: {
    ...mapActions('userModule', { userlogin: 'login' }),
    setPassword(data, key) {
      const cypherKey = CryptoJS.enc.Utf8.parse(key);
      CryptoJS.pad.ZeroPadding.pad(cypherKey, 4);
      const iv = CryptoJS.SHA256(key).toString();
      const cfg = { iv: CryptoJS.enc.Utf8.parse(iv) };
      return CryptoJS.AES.encrypt(data, cypherKey, cfg).toString();
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.user[name];
      return $dirty ? !$error : null;
    },
    login() {
      this.$v.user.$touch();
      if (this.$v.user.$anyError) {
        return;
      }
      // Save login information if rememberMe is true
      if (this.rememberMe) {
        localStorage.rememberMe = true;
        localStorage.email = this.user.email;
        localStorage.password = this.user.password;
      } else {
        // Clear saved login information if rememberMe is false
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }
      this.user.password = this.setPassword(this.user.password, '16bit secret key');
      console.error(this.user);
      this.userlogin(this.user)
        .then(() => {
          this.$router.replace({ name: 'home' });
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
.login-view {
  background-image: url('https://sse-market-source-1320172928.cos.ap-guangzhou.myqcloud.com/assets/image/background.jpg');
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  margin-top: 0px !important;
  height: 100vh;
  width: 100vw;
}
</style>
