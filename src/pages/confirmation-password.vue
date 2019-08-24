<template>
  <f7-page no-toolbar no-navbar no-swipeback login-screen>

    <div class="confirmation">
      <f7-block-title>Mensaje de confirmación</f7-block-title>
      <f7-card>
        <f7-card-header class="no-border" valign="bottom">Password modificada</f7-card-header>
        <f7-card-content>
          <p>Su password se ha modificado correctamente. Puede iniciar sesión con su nueva clave</p>
          <img src="../assets/images/success_animation.gif">
        </f7-card-content>
        <f7-card-footer>
          <f7-link class="button button-fill button-raised" href="/login/">Iniciar sesión</f7-link>
        </f7-card-footer>
      </f7-card>
    </div>
    
  </f7-page>
</template>