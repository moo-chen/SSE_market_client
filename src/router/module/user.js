const userRoutes = [
  // path是路径，在浏览器搜索是用的
  // name是名字，在跳转页面时用，具体使用参见'views/layout/NavbarView.vue'
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/RegisterView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginView.vue'),
  },
  {
    path: '/save',
    name: 'save',
    meta: {
      auth: true,
    },
    component: () => import('@/views/save/SaveView.vue'),
  },
  {
    path: '/history',
    name: 'history',
    meta: {
      auth: true,
    },
    component: () => import('@/views/history/HistoryView.vue'),
  },
  {
    path: '/modifyPassword',
    name: 'modifyPassword',
    component: () => import('@/views/modifyPassword/ModifyPassword.vue'),
  },
  {
    path: '/identityValidate',
    name: 'identityValidate',
    component: () => import('@/views/identityValidate/IdentityValidateView.vue'),
  },
];

export default userRoutes;
