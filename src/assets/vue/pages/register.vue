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
        placeholder="Tu Password"
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
      <f7-list-item radio name="userRol" :value="0" title="Candidato" @change="userRol = $event.target.value" checked></f7-list-item>
      <f7-list-item radio name="userRol" :value="1" title="Empresa" @change="userRol = $event.target.value"></f7-list-item>
    </f7-list>

    <f7-block strong>
        <f7-button class="col" fill @click="signup">Registrarme</f7-button>
    </f7-block>

    <v-dialog name='dialog'/>

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
                this.$modal.show('dialog', {
                  title: 'Información',
                  text: 'Registro completado. Te hemos enviado un email para activar tu cuenta',
                  buttons: [
                    {
                      title: 'CLOSE',
                      handler: () => { this.$f7router.navigate({ name: 'main' }); }
                    },
                 ]
                });
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