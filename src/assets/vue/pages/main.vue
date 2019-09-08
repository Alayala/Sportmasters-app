<template>
  <f7-page name="main" style="text-align:center;">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false" large>
      <f7-nav-title-large sliding>Sportmasters</f7-nav-title-large>
    </f7-navbar>

    <!-- Page content-->
    <f7-block strong>
      <p>Bienvenido a nuestra plataforma para profesionales del deporte</p>
    </f7-block>

    <f7-block-title>Acceder</f7-block-title>
    <f7-block strong class="mainMenu">
      <f7-link class="button button-fill button-raised" href="/login/">Inicio de sesión</f7-link>
      <f7-link class="button button-fill button-raised" href="/register/">Registro</f7-link>
    </f7-block>

  </f7-page>
</template>

<script>
  export default {
    data() {
      return {
        }
    },
    mounted: function(){
        //this.$f7router.navigate({ name: 'main' });
        this.$session.clear();
        localStorage.removeItem('user-token');
        localStorage.removeItem('login');
    }
  };
  </script>