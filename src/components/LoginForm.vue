<template>
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
import customValidator from '@/helper/validator';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      user: {
        phone: '',
        password: '',
      },
      rememberMe: false, // Added rememberMe property
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

  mounted() {
    // Load saved login information if rememberMe is true
    if (localStorage.rememberMe === 'true') {
      this.user.phone = localStorage.phone || '';
      this.user.password = localStorage.password || '';
      this.rememberMe = true;
    }
  },

  methods: {
    ...mapActions('userModule', { userlogin: 'login' }),
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
        localStorage.phone = this.user.phone;
        localStorage.password = this.user.password;
      } else {
        // Clear saved login information if rememberMe is false
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('phone');
        localStorage.removeItem('password');
      }

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
</style>
