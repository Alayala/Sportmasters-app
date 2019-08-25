import MainPage from './assets/vue/pages/main.vue';
import HomePage from './assets/vue/pages/home.vue';
import MyAccountPage from './assets/vue/pages/my-account.vue';
import LoginPage from './assets/vue/pages/login.vue';
import RegisterPage from './assets/vue/pages/register.vue';
import AboutPage from './assets/vue/pages/about.vue';
import NotFoundPage from './assets/vue/pages/404.vue';
import PersonalDataPage from './assets/vue/pages/personal-data.vue';
import ConfirmationAccountPage from './assets/vue/pages/confirmation-account.vue';
import ConfirmationPasswordPage from './assets/vue/pages/confirmation-password.vue';
import ChangePasswordPage from './assets/vue/pages/change-password.vue';


export default [
  {
    path: '/',
    component: MainPage,
    name: 'main',
  },
  {
    path: '/home',
    component: HomePage,
    name: 'home',
    /*async(routeTo, routeFrom, resolve, reject) {
       // Router instance
      var router = this;
      // App instance
      var app = router.app;
      // Show Preloader
      //app.preloader.show();
      if (this.$session !== undefined) {
        resolve({ component: LoginPage })
      }
    }*/
  },
  {
    path: '/register',
    component: RegisterPage,
    name: 'register',
  },
  {
    path: '/my-account',
    component: MyAccountPage,
    name: 'account',
  },
  {
    path: '/login',
    component: LoginPage,
    name: 'login',
  },
  {
    path: '/personal-data',
    component: PersonalDataPage,
    name: 'personal-data',
  },
  {
    path: '/about',
    component: AboutPage,
    name: 'about',
  },
  {
    path: '/confirmation-account',
    component: ConfirmationAccountPage,
    name: 'confirmation-account',
  },
  {
    path: '/change-password/:token',
    component: ChangePasswordPage,
    name: 'change-password',
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];
