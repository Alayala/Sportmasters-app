
import HomePage from '../pages/home.vue';
import MainPage from '../pages/main.vue';
import LoginPage from '../pages/login.vue';
import RegisterPage from '../pages/register.vue';
import AboutPage from '../pages/about.vue';
import NotFoundPage from '../pages/404.vue';
import PersonalDataPage from '../pages/personal-data.vue';
import ConfirmationAccountPage from '../pages/confirmation-account.vue';
import ConfirmationPasswordPage from '../pages/confirmation-password.vue';
import ChangePasswordPage from '../pages/change-password.vue';


/*import FormPage from '../pages/form.vue';
import DynamicRoutePage from '../pages/dynamic-route.vue';
import RequestAndLoad from '../pages/request-and-load.vue';
import NotFoundPage from '../pages/404.vue';
import AboutPage from '../pages/about.vue';
*/

var routes = [
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
    path: '/register',
    component: RegisterPage,
    name: 'register',
  },
  {
    path: '/confirmation-account',
    component: ConfirmationAccountPage,
    name: 'confirmation-account',
  },
  {
    path: '/confirmation-password',
    component: ConfirmationPasswordPage,
    name: 'confirmation-password',
  },
  {
    path: '/change-password/:token',
    //url: '/change-password/{{token}}',
    component: ChangePasswordPage,
    name: 'change-password',
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
