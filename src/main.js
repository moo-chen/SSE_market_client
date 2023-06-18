import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import Vuelidate from 'vuelidate';
import axios from 'axios';
import ElementUI from 'element-ui';
import VueParticles from 'vue-particles';
import 'element-ui/lib/theme-chalk/index.css';
import VueAxios from 'vue-axios';
import VueScrollTo from 'vue-scrollto';
import VueTypedJs from 'vue-typed-js';
import App from './App.vue';
import router from './router';
import store from './store';
import './style/scss/index.scss';

Vue.config.productionTip = false;

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.use(Vuelidate);
Vue.use(ElementUI);
Vue.use(VueParticles);
Vue.use(VueAxios, axios);
Vue.use(VueScrollTo);
Vue.use(VueTypedJs);
Vue.prototype.$axios = axios;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
