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
        :value="name"
        required
        validate
        clear-button
      ></f7-list-input>

      <f7-list-input
        label="E-mail"
        type="email"
        placeholder="E-mail"
        @input="email = $event.target.value"
        :value="email"
        required
        validate
        clear-button
      ></f7-list-input>

     <f7-list-input
        label="Password"
        type="password"
        placeholder="Tu Password"
        @input="password = $event.target.value"
        :value="password"
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
        :value="passwordConfirm"
        required
        validate
        clear-button
      >
      </f7-list-input>
    </f7-list>

    <f7-block-title>¿Qué tipo de usuario eres?</f7-block-title>
    <f7-list>
      <f7-list-item radio name="userRol" :value="0" title="Candidato" @change="userRol = $event.target.value" checked></f7-list-item>
      <f7-list-item radio name="userRol" :value="1" title="Empresa" @change="userRol = $event.target.value"></f7-list-item>
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
        name: "Fredy",
        email: "cristinarosilloarenas@gmail.com", 
        password: "fredy",
        passwordConfirm: "fredy",
        userRol: '0',
        message: "",
        seen: false,
      };
    },
    methods: {
      showMsg: function(msg){
        this.message = msg;
        this.seen = true;
        return false;
      },
      signup: function() {
        if(this.password != this.passwordConfirm){
          this.showMsg("Los password no coinciden");
        }else{
          return this.axios.post('http://127.0.0.1:8080/api/auth/signup', { 
            name: this.name, 
            email: this.email, 
            password: this.password, 
            password_confirmation: this.passwordConfirm,
            rol: this.userRol },
             {headers:{
              'Content-Type':'application/json',
              'X-Requested-With': 'XMLHttpRequest'
              }
            }).then(response => { 
                //success
                alert("registro correcto");
                this.$f7ready((f7) => {
                  f7.sheet.open(".my-sheet-top");
                });
              }).catch( error => {
                //error
                alert(error.response.data['message']);
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