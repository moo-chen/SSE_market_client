<!-- eslint-disable max-len -->
<!-- <template>中放的是页面的html框架，可用html语言编写，也可调用bootstrap-vue等第三方提供的组件，但需要在main.js中引入  -->
<template>
  <div class='register-view'>
    <div class="full-screen-container">
      <vue-particles
          class="particles-bg"
          color="#FFC0CB"
          :particle-opacity="0.7"
          :particles-number="100"
          shape-type="star"
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
    <div class='register'>
      <b-row class='mt-5'>
        <b-col md='8' offset-md='2' lg='6' offset-lg='3'>
          <b-card title='注册'>
            <b-form>
              <b-form-group label='姓名'>
                <!-- v-model里的内容是下面script中data()函数中return的属性，可实现数据连接 -->
                <b-form-input
                  v-model='$v.user.name.$model'
                  type='text'
                  placeholder='输入您的名称（选填）'
                ></b-form-input>
              </b-form-group>
              <b-form-group label='手机号'>
                <b-form-input
                v-model="$v.user.phone.$model"
                type="number"
                placeholder="输入手机号"
                :state="validateState('phone')"
              ></b-form-input>
              <b-form-invalid-feedback :state="validateState('phone')">
                手机号不符合要求
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label='邮箱'>
                <b-form-input
                v-model="$v.user.email.$model"
                type="email"
                placeholder="输入邮箱"
                :state="validateState('email')"
              ></b-form-input>
              <b-form-invalid-feedback :state="validateState('email')">
                邮箱格式不符合要求
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label='学号'>
                <b-form-input
                v-model="$v.user.num.$model"
                type="num"
                placeholder="输入学号"
                :state="validateState('num')"
              ></b-form-input>
              <b-form-invalid-feedback :state="validateState('num')">
                学号格式不符合要求
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label='密码'>
                <b-form-input
                v-model="$v.user.password.$model"
                type="password"
                placeholder="输入密码"
                :state="validateState('password')"
              ></b-form-input>
              <b-form-invalid-feedback :state="validateState('password')">
                密码必须大于等于 6 位
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label='再次输入密码'>
                <b-form-input
                v-model="$v.user.password2.$model"
                type="password"
                placeholder="再次输入密码"
                :state="validateState('password2')"
              ></b-form-input>
              <b-form-invalid-feedback :state="validateState('password2')">
                密码必须大于等于 6 位
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group label='验证码'>
                <b-form-input
                v-model="$v.user.valiCode.$model"
                type="valiCode"
                placeholder="输入验证码"
                :state="validateState('valiCode')"
              ></b-form-input>
              <b-form-invalid-feedback :state="validateState('valiCode')">
                验证码不符合要求
                </b-form-invalid-feedback>
              </b-form-group>
              <b-form-group>
                <!-- 发送邮箱验证码 -->
                <b-button @click='validateEmail' variant='outline-primary' block
                  >发送验证码</b-button
                >
                <!-- 使用click添加事件，这里是定向到下面的register函数。click的另一个用户参见'views/layout/NavbarView.vue'文件 -->
                <b-button @click='register' variant='outline-primary' block>注册</b-button>
              </b-form-group>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
  </div>
</template>

<script>
// 引入一些需要的组件及库
import { required, minLength, maxLength } from 'vuelidate/lib/validators';

import customValidator from '@/helper/validator';

import { mapActions } from 'vuex';

// export default用于导出模块中的一个默认值，函数一般放在其中
export default {
  // data 函数用于定义组件的数据。它返回一个对象，其中包含组件的各种数据属性和初始值。
  data() {
    return {
      user: {
        name: '',
        phone: '',
        password: '',
        password2: '',
        email: '',
        num: '',
        valiCode: '',
        mode: '',
      },
    };
  },
  // 用于定义数据的格式规则
  validations: {
    user: {
      name: {},
      phone: {
        required,
        phone: customValidator.telephoneValidator,
      },
      password: {
        required,
        minLength: minLength(6),
      },
      password2: {
        required,
        minLength: minLength(6),
      },
      email: {
        required,
        email: customValidator.emailValidator,
      },
      num: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(8),
      },
      valiCode: {},
      mode: {},
    },
  },
  // methods 属性用于定义组件的方法。它是一个对象，其中包含了一组可以在组件实例中使用的方法
  methods: {
    // 使用map将userRegister映射到'store/module'里的user函数，在下面使用时就写成userRegister
    ...mapActions('userModule', { userRegister: 'register' }),
    ...mapActions('userModule', { userValidate: 'validateEmail' }),
    // validators库里规定的，用于规则验证什么的，我也不是很了解
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
      this.user.mode = 0;
      this.$v.user.$touch();
      if (this.$v.user.$anyError) {
        return;
      }
      this.userValidate(this.user)
        .then(() => {
          this.$bvToast.toast('已发送验证码，请将邮箱发送的验证码输入以完成注册验证', {
            title: '系统提醒',
            variant: 'primary',
            solid: true,
          });
        })
        .catch((err) => {
          this.$bvToast.toast(err.response.data.msg, {
            title: '发送邮箱错误',
            variant: 'danger',
            solid: true,
          });
        });
    },

    register() {
      // 验证数据
      this.$v.user.$touch();
      if (this.$v.user.$anyError) {
        return;
      }
      // 请求
      this.userRegister(this.user)
        .then(() => {
          // 这里写从后端成功返回数据后的操作
          this.$bvToast.toast('注册成功,请登录', {
            title: '系统提醒',
            variant: 'primary',
            solid: true,
          });
        })
        .catch((err) => {
          // 这里写从后端返回数据失败后的操作
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
// 可以在这里直接写css语句，如果css语句较多也可写成一个css文件放在'style/css'里并用下列语句引入：
// @import '../../style/css/XXX.css';
.register-view {
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

.register {
  height: 1000px;
  width: 1200px;
  margin: auto;
  margin-top: 50px !important;
  margin-left: 350px !important;
}
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
