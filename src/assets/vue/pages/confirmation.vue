<template>
  <f7-page no-toolbar no-navbar no-swipeback login-screen>

    <div class="confirmation">
      <f7-block-title>Mensaje de confirmación</f7-block-title>
      <f7-card>
        <f7-card-header class="no-border" valign="bottom">{{ title }}</f7-card-header>
        <f7-card-content>
        
          <p>{{ message }}</p>
          <img v-if="status == 0" src="../../images/success_animation.gif">
          <img v-else src="../../images/error_animation.gif">

        </f7-card-content>
        <f7-card-footer>
          <f7-link class="button button-fill button-raised" href="/login/">Iniciar sesión</f7-link>
        </f7-card-footer>
      </f7-card>
    </div>
    
  </f7-page>
</template>

<script>
  export default {
    data() {
      return {
        code: '',
        status: '',
        message: '',
        image: '',
        title: '',
      };
    }, 
    mounted(){
        this.code = this.$f7route.params.code;
        this.status = this.$f7route.params.status;
        this.showMessage(this.code, this.status);
    },
    methods: {
      showMessage: function(){
        //Si el codígo es 0 mostramos información relativa al cambio de Password
        if(this.code == 0){
          this.title = 'Cambiar password';
          if(this.status == 0){ // Si el status es 0, se ha cambiado correctamente
            this.message = "Su password se ha modificado correctamente. Puede iniciar sesión con su nueva clave";
          }else{ //Si status es 1, ha ocurrido un error durante el cambio
            this.message = "Ha ocurrido un error. Inténtelo de nuevo o póngase en contacto con el administrador.";
          }
        }else if(this.code == 1){
          this.title = "Activar cuenta";
          if(this.status == 0){
            this.message = "Felicidades. Su cuenta se ha activado correctamente. Ya puede iniciar sesión y comenzar a disfrutar de nuestros servicios";
          }else if(this.status == 1){
            this.message = "El token de activación es inválido. Póngase en contacto con el administrador";
          }else{
            this.message = "Ha ocurrido un error. Inténtelo de nuevo o póngase en contacto con el administrador.";
          }
        }
      }
    }
  }
</script>