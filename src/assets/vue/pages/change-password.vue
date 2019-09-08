<template>
  <f7-page name="change-password" no-toolbar no-navbar no-swipeback login-screen>
    <f7-login-screen-title>Cambiar contraseña</f7-login-screen-title>

    <div class="messageAlert">
      <b-alert :show="seen" dismissible variant="danger" @dismissed="clearMsg">
        {{ message }}
      </b-alert>
    </div>

    <f7-list form>
      <f7-list-input
        label="Password"
        type="password"
        placeholder="Introduce un nuevo password"
        :value="password"
        @input="password = $event.target.value"
        required
        validate
        clear-button
      ></f7-list-input>
      <f7-list-input
        label="Confirmación Password"
        type="password"
        placeholder="Confirma el password"
        :value="passwordConfirm"
        @input="passwordConfirm = $event.target.value"
        required
        validate
        clear-button
      ></f7-list-input>
    </f7-list>
    <f7-list>
      <f7-list-button @click="changePassword" v-if="confirm" href="/confirmation/0/0/">Guardar</f7-list-button>
      <f7-list-button @click="changePassword" v-else href="/confirmation/0/1/">Guardar</f7-list-button>
    </f7-list>

    <v-dialog name='dialog'/>
      
    </div>
    
  </f7-page>
</template>

<script>
  export default {
    data() {
      return {
        password: "",
        passwordConfirm: "",
        message: "",
        seen: false,
        token: null,
        email: null,
        confirm: true,
      };
    }, 
    methods: {
      showMsg(msg){
        this.$f7.$('.page-content').scrollTop(0, 600);
        this.message = msg;
        this.seen = true;
        return false;
      },
      changePassword(){
        //this.token = this.$f7router.params;
        if (this.password.trim().length === 0 || this.passwordConfirm.trim().length === 0) {
          this.showMsg("Debe introducir un password");
        }else if (this.password != this.passwordConfirm) {
          this.showMsg("Los password no coinciden");
        }else{
          this.token = this.$f7route.params.token;
          this.email = localStorage.getItem('email');
          
          //return this.axios.post('http://sportmastersapi.hostingerapp.com/api/password/reset', { email: this.email, password: this.password, password_confirmation: this.passwordConfirm, token: this.token},
          return this.axios.post('http://sportmasters.com:8080/api/password/reset', { email: this.email, password: this.password, password_confirmation: this.passwordConfirm, token: this.token},
            {headers:{
              'Content-Type':'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
            }).then(response => { 
              //success
              this.confirm = true;
            }).catch(error => {
              //error
              this.confirm = false;
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