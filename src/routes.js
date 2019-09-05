import MainPage from './assets/vue/pages/main.vue';
import HomePage from './assets/vue/pages/home.vue';
import MyAccountPage from './assets/vue/pages/my-account.vue';
import LoginPage from './assets/vue/pages/login.vue';
import RegisterPage from './assets/vue/pages/register.vue';
import AboutPage from './assets/vue/pages/about.vue';
import NotFoundPage from './assets/vue/pages/404.vue';
import PersonalDataPage from './assets/vue/pages/personal-data.vue';
import PersonalVideosPage from './assets/vue/pages/personal-videos.vue';
import PersonalOffersPage from './assets/vue/pages/personal-offers.vue';
import RegisterVideoPage from './assets/vue/pages/register-video.vue';
import EditVideoPage from './assets/vue/pages/edit-video.vue';
import ConfirmationPage from './assets/vue/pages/confirmation.vue';
import ShowProfilePage from './assets/vue/pages/show-profile.vue';
import RegisterOfferPage from './assets/vue/pages/register-offer.vue';
import EditOfferPage from './assets/vue/pages/edit-offer.vue';
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
    async(routeTo, routeFrom, resolve, reject) {
       // Router instance
      var router = this;
      // App instance
      var app = router.app;
      // Show Preloader
      //app.preloader.show();
      if (this.$session !== undefined) {
        resolve({ component: LoginPage })
      }
    }
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
    path: '/personal-videos',
    component: PersonalVideosPage,
    name: 'personal-videos',
  },
  {
    path: '/register-video',
    component: RegisterVideoPage,
    name: 'register-video',
  },
  {
    path: '/edit-video/:id',
    component: EditVideoPage,
    name: 'edit-video',
  },
   {
    path: '/show-profile/:id',
    component: ShowProfilePage,
    name: 'show-profile',
  },
  {
    path: '/about',
    component: AboutPage,
    name: 'about',
  },
  {
    path: '/confirmation/:code/:status',
    component: ConfirmationPage,
    name: 'confirmation',
  },
  {
    path: '/change-password/:token',
    component: ChangePasswordPage,
    name: 'change-password',
  },
  {
    path: '/personal-offers',
    component: PersonalOffersPage,
    name: 'personal-offers',
  },
  {
    path: '/register-offer',
    component: RegisterOfferPage,
    name: 'register-offer',
  },
  {
    path: '/edit-offer/:id',
    component: EditOfferPage,
    name: 'edit-offer',
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];
