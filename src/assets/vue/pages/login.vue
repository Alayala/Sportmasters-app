<template>
  <f7-page no-toolbar no-navbar no-swipeback login-screen>
    <f7-login-screen-title>Inicio de sesión</f7-login-screen-title>

      <div class="messageAlert">
        <b-alert :show="seen" dismissible variant="danger" @dismissed="clearMsg">
           {{ message }}
        </b-alert>
      </div>

    <f7-list form>
      <f7-list-input
        label="Email"
        type="email"
        placeholder="Your Email"
        :value="email"
        @input="email = $event.target.value"
        required
        validate
        clear-button
      ></f7-list-input>
      <f7-list-input
        label="Password"
        type="password"
        placeholder="Your password"
        :value="password"
        @input="password = $event.target.value"
        required
        validate
        clear-button
      ></f7-list-input>
    </f7-list>
    <f7-list>
      <f7-list-button @click="login">Entrar</f7-list-button>
      <f7-block-footer><f7-link class="link-secundary" @click="remember">¿Has olvidado la contraseña?</f7-link></f7-block-footer>
      <f7-block-footer>Pincha <f7-link back>aquí</f7-link> para volver</f7-block-footer>
    </f7-list>

    <v-dialog name='dialog'/>

  </f7-page>
</template>

<script>
  export default {
    data() {
      return {
        loginScreenOpened: false,
        email: "cristy.blk@gmail.com", 
        password: "cristina",
        message: "",
        seen: false
      };
    },
    methods: {
      showMsg: function(msg){
        this.message = msg;
        this.seen = true;
        return false;
      },
      login() {
        if (this.email.trim().length === 0 || this.password.trim().length === 0) {
            return false;
        }else{
          return this.axios.post('http://127.0.0.1:8080/api/auth/login', { email: this.email, password: this.password },
             {headers:{
              'Content-Type':'application/json',
              'X-Requested-With': 'XMLHttpRequest'
              }
            }).then(response => { 
                //success
                var email = this.email;
                var password = this.password;
                const id = response.data.id;
                const token = response.data.access_token;

                var login = {'email': email, 'id': id};
                localStorage.setItem('login', JSON.stringify(login));
                localStorage.setItem('user-token', token);
                this.$session.set('email', email);
                this.$session.set('password', password);

                this.axios.defaults.headers.common['Authorization'] = "Bearer " + token;

                this.$f7router.navigate({ name: 'home' });
              }).catch(error => {
                //error
                if(error.request.status == '404'){
                  this.showMsg('Ups! ha ocurrido un error pongase en contacto con el administrador');
                }else{
                  this.showMsg(error.response.data['message']);
                }
              });
        }
      },
      //Función que nos permite cambiar la contraseña en el cas de que no la recordemos
      remember(){
        if (this.email.trim().length === 0) {
          this.showMsg("Debe introducir un email");
        }else{
          localStorage.setItem('email', this.email);
          return this.axios.post('http://127.0.0.1:8080/api/password/create', { email: this.email},
            {headers:{
              'Content-Type':'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
            }).then(response => { 
              //success
              this.$modal.show('dialog', {
                title: 'Información',
                text: 'Te hemos enviado un email para cambiar tu contraseña',
                buttons: [
                  {
                    title: 'CLOSE',
                    handler: () => { this.$f7router.navigate({ name: 'main' }); }
                  },
                ]
              });
            }).catch(error => {
              //error
              console.log(error);
              this.showMsg(error.response.data['message']);
            });
        }
      },
      //Función que elimina los mensajes informativos
      clearMsg: function(){
        this.seen = false;
        this.message = "";
      }
    }
  }
</script>