// Import Vue
import Vue from 'vue';

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle';

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

// Import F7 Style
import Framework7CSS from 'framework7/css/framework7.bundle.min.css';

// Import F7 iOS Icons
import Framework7Icons from 'framework7-icons/css/framework7-icons.css';

// Import Material Icons
import MaterialIcons from 'material-design-icons/iconfont/material-icons.css';

// Import Fontawesome Theme Styles
import FontAwesome from '@fortawesome/fontawesome-free/css/all.min.css';

// Import fastClick
import FastClick from 'fastclick';

// Import App Custom Styles
import 'assets/css/app.css';
// import AppStyles from './assets/sass/main.scss'

// Import Bootstrap styles
import BootstrapVue from 'bootstrap-vue';

// Import Bootstrap css
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Import App Component
import app from './main.vue';

// Import Vuex Storage
import store from './assets/vuex/storage.js';

// Import Vmodal dialog
import VModal from 'vue-js-modal';

// Import from session component
import VueSessionStorage from 'vue-sessionstorage';

// Import axios component for api comunication
import axios from 'axios';
import VueAxios from 'vue-axios';

//Import component for video player
import vueVimeoPlayer from 'vue-vimeo-player';
import VueYouTubeEmbed from 'vue-youtube-embed';

// Different F7-Vue plugin initialization with f7 v3.0
Framework7.use(Framework7Vue);

//Vue use components
Vue.use(BootstrapVue);
Vue.use(VModal, { dialog: true});
Vue.use(VueAxios, axios);
Vue.use(VueSessionStorage);
Vue.use(vueVimeoPlayer);
Vue.use(VueYouTubeEmbed);

// Init Vue App
export default new Vue({
  // Root Element
  el: '#app',
  store,
  render: c => c('app'),
  components: {
    app
  },
  mounted() {
    window.addEventListener('load', () => {
      // run after everything is in-place
      FastClick.attach(document.body);
    });
  }
});
