<template>
  <f7-app :params="f7params">
    <!-- Your main view, should have "view-main" class-->
    <f7-view id="main-view" url="/" main :pushState="true"></f7-view>

  </f7-app>
</template>
<script>
  import routes from '../js/routes.js';

  export default {
    data() {
      return {
        // Framework7 Parameters
        f7params: {
          name: 'My App', // App name
          theme: 'auto', // Automatic theme detection
          routes: routes,
        },
      }
    },
    mounted() {
      this.$f7ready((f7) => {
        // Call F7 APIs here
      });
    }
  }
</script>