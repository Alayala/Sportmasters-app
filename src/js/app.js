// Import Vue
import Vue from 'vue';
//Import Route
//import VueRouter from 'vue-router';
//Import SessinStorage
import VueSessionStorage from 'vue-sessionstorage';
//Import Axios, nos ayuda a realizar peticiones a servidores
import VueAxios from 'vue-axios';
//Import bootstrapVue
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle.js';
// Import Framework7-Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';
// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css';
// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
// Import App Component
import App from '../components/app.vue';
import axios from 'axios';
//Import modal component
import VModal from 'vue-js-modal';
import Routes from './routes.js';


// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

//Init Vue
Vue.use(VueAxios, axios);
Vue.use(VueSessionStorage);
Vue.use(BootstrapVue);
Vue.use(VModal, { dialog: true });

//Vue.use(VueRouter);

// Init App
new Vue({
  el: '#app',
  render: (h) => h(App),
  // Register App Component
  components: {
    app: App,
  }
});