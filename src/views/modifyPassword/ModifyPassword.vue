<template>
    <div class="modifyPassword-view">
      <div class='modifyPassword' @keydown.enter="modifyPassword">
    <b-row class='mt-5'>
      <b-col md='8' offset-md='2' lg='6' offset-lg='3'>
        <b-card title='修改密码'>
          <b-form>
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

            <b-form-group label='再次输入密码'>
              <b-form-input
                v-model='$v.user.password2.$model'
                type='password'
                placeholder='再次输入密码'
                :state="validateState('password2')"
              ></b-form-input>
              <b-form-invalid-feedback :state="validateState('password2')">
                密码必须大于等于 6 位
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <b-button @click='modifyPassword' variant='outline-primary' block>修改密码</b-button>
              <b-button @click="$router.replace({ name : 'login' })"
              variant="outline-primary" block>返回登录</b-button>
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { required, minLength } from 'vuelidate/lib/validators';

export default {
  computed: mapState({
    userInfo: (state) => state.userModule.userInfo,
  }),
  data() {
    return {
      user: {
        phone: '',
        password: '',
        password2: '',
      },
    };
  },
  validations: {
    user: {
      phone: {

      },
      password: {
        required,
        password: minLength(6),
      },
      password2: {
        required,
        password2: minLength(6),
      },
    },
  },
  methods: {
    ...mapActions('userModule', { userModify: 'modifyPassword' }),
    validateState(name) {
      // 这里是es6 解构赋值
      const { $dirty, $error } = this.$v.user[name];
      return $dirty ? !$error : null;
    },
    modifyPassword() {
      this.$v.user.$touch();
      if (this.$v.user.$anyError) {
        console.error('error!');
        return;
      }
      this.user.phone = this.userInfo.phone;
      console.error(this.user.phone);
      this.userModify(this.user).then(() => {
        this.$bvToast.toast('修改密码成功', {
          title: '系统提醒',
          variant: 'primary',
          solid: true,
        });
      }).catch((err) => {
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

<style lang="scss" scoped>
// 可以在这里直接写css语句，如果css语句较多也可写成一个css文件放在'style/css'里并用下列语句引入：
// @import '../../style/css/XXX.css';
.modifyPassword-view {
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

.modifyPassword {
  height: 1000px;
  width: 1200px;
  margin-top: 180px !important;
  margin-left: 250px !important;
}
</style>
