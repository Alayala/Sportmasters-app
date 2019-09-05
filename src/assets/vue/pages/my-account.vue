<template>
  <f7-page>
    <f7-navbar title="Mi cuenta">
      <f7-link slot="nav-left" icon-f7="arrow_left" icon-only href="/home/"></f7-link>
    </f7-navbar>
    <f7-block-title>Ajustes avanzados de cuenta</f7-block-title>
    
    <f7-list>

       <f7-list-item swipeout title="Eliminar perfil">
          <f7-swipeout-actions right>
            <f7-swipeout-button color="red" class="open-confirm" @click="confirmDeleteAccount" >Eliminar</f7-swipeout-button>
          </f7-swipeout-actions>
        </f7-list-item>
      
    </f7-list>

    <v-dialog />

  </f7-page>
</template>

<script>
  export default {
    data() {
      return {
        userId: null,
      }
    },
    mounted() {
      //Método que carga toda la información relativa al usurio cuando carga la página
      var data = JSON.parse(localStorage.getItem('login'));
      this.userId = data["id"];
      this.rol = data["rol"];
    },
    methods: {
       confirmDeleteAccount: function(event){
        this.$modal.show('dialog', {
          title: 'Confirmación!',
          text: '¿Desea eliminar su cuenta? Toda su información y recursos serán eliminados',
          buttons: [
            {
              title: 'Borrar',
              handler: () => { this.deleteAccount(); }
            },
            {
              title: 'Cancelar'
            }
         ]
        });
      },
      //Método que elimina la cuenta del cliente y todos los ficheros asociados
      deleteAccount: function (){
        this.$modal.hide('dialog');

        return this.axios.delete('http://127.0.0.1:8080/api/user/delete/'+this.userId,
             {headers:{
              'Content-Type':'application/json',
              'X-Requested-With': 'XMLHttpRequest'
              }
            }).then(response => { 
              console.log(response.data);
              this.$session.clear();
              localStorage.removeItem('user-token');
              localStorage.removeItem('login');

              this.$f7router.navigate({ name: 'main' });
            }).catch( error => {
              console.log(error.data);
        });
      }
    }
  }

</script>