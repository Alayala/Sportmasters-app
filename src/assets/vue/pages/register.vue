<template>
  <f7-page name="form">
    <f7-navbar title="Formulario de Registro" back-link="Back"></f7-navbar>

    <f7-block-title>Debes rellenar todos los campos</f7-block-title>

     <div class="messageAlert">
        <b-alert :show="seen" dismissible variant="danger" @dismissed="clearMsg">
           {{ message }}
        </b-alert>
      </div>

    <f7-list no-hairlines-md>
      <f7-list-input
        label="Nombre"
        type="text"
        placeholder="Tu nombre"
        @input="name = $event.target.value"
        required
        validate
        clear-button
      ></f7-list-input>

      <f7-list-input
        label="E-mail"
        type="email"
        placeholder="E-mail"
        @input="email = $event.target.value"
        required
        validate
        clear-button
      ></f7-list-input>

     <f7-list-input
        label="Password"
        type="password"
        placeholder="Contraseña"
        @input="password = $event.target.value"
        required
        validate
        clear-button
      >
      </f7-list-input> 

      <f7-list-input
        label="Confirmar Password"
        type="password"
        placeholder="Repite Password"
        @input="passwordConfirm = $event.target.value"
        required
        validate
        clear-button
      >
      </f7-list-input>
    </f7-list>

    <f7-block-title>¿Qué tipo de usuario eres?</f7-block-title>
    <f7-list>
      <f7-list-item radio name="userRol" value="0" @change="changeChecked" title="Candidato" checked></f7-list-item>
      <f7-list-item radio name="userRol" value="1" @change="changeChecked" title="Empresa"></f7-list-item>
    </f7-list>

    <f7-block strong>
        <f7-button class="col" fill @click="signup">Registrarme</f7-button>
    </f7-block>

    <!--Modal con información-->
    <div class="sheet-modal sheet-modal-top my-sheet-top">
      <div class="toolbar toolbar-bottom">
        <div class="toolbar-inner">
          <div class="left"></div>
          <div class="right"><a class="link sheet-close" href="/">Cerrar</a></div>
        </div>
      </div>
      <div class="sheet-modal-inner">
        <div class="block">
          <h4>Información</h4>
          <p>Registro completado. Te hemos enviado un email para activar tu cuenta</p>
        </div>
      </div>
    </div>


  </f7-page>
</template>

<script>

  export default {
  
    data() {
      return {
        name: "",
        email: "", 
        password: "",
        passwordConfirm: "",
        message: "",
        seen: false,
        rol: '0',
      };
    },
    methods: {
      showMsg: function(msg){
        this.$f7.$('.page-content').scrollTop(0, 600);
        this.message = msg;
        this.seen = true;
        return false;
      },
      changeChecked: function(event){
        this.rol = event.target.value;
      },
      validate: function(){
        var validate = true;
        if(!this.name || !this.email || !this.password){
          this.showMsg("Debe rellenar todos los campos");
          validate = false;
        }

        if(this.password != this.passwordConfirm){
          this.showMsg("Los password no coinciden");
          validate = false;
        }
        return validate;
      },
      signup: function() {
        if(this.validate()){        
          return this.axios.post('http://127.0.0.1:8080/api/auth/signup', { 
            name: this.name, 
            email: this.email, 
            password: this.password, 
            password_confirmation: this.passwordConfirm,
            rol: this.rol 
          },
              {headers:{
                'Content-Type':'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              }
            }).then(response => { 
              //success
              this.$f7.preloader.show();
              setTimeout(() => {
                this.$f7.preloader.hide();
                this.$f7ready((f7) => { f7.sheet.open(".my-sheet-top"); });
              }, 2000);    
            }).catch( error => {
              //error
              this.showMsg(error.response.data['message']);
            });
        }
      },
      //Función que elimina los mensjes informativos
      clearMsg: function(){
        this.seen = false;
        this.message = "";
      }
    }
  }
</script>