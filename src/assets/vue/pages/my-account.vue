<template>
  <f7-page>
    <f7-navbar large title="Ajustes avanzados" title-large="Mi cuenta" back-link="home"></f7-navbar>
    <f7-block-title>Ajustes avanzados de cuenta</f7-block-title>
    
    <f7-list>
      <f7-list-item
        swipeout
        title="Eliminar cuenta"
        text="Al eliminar la cuenta se cancelará la suscripción y se procederá a la eliminación de todo el contenido de su cuenta"
      >
        <f7-swipeout-actions right>
          <f7-swipeout-button 
            @click="" 
            color="red" 
            confirm-text="¿Estás seguro que quieres eliminar tu cuenta?">
            Eliminar
          </f7-swipeout-button>
        </f7-swipeout-actions>

      </f7-list-item>
      
      <!--<f7-list-item
        swipeout
        title="Twitter"
        after="20:00"
        subtitle="New messages from John Doe"
        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."
      >
        <f7-swipeout-actions left>
          <f7-swipeout-button overswipe color="green" @click="$f7router.back()">Reply</f7-swipeout-button>
          <f7-swipeout-button color="blue" @click="$f7router.back()">Forward</f7-swipeout-button>
        </f7-swipeout-actions>
        <f7-swipeout-actions right>
          <f7-swipeout-button @click="$f7router.back()">More</f7-swipeout-button>
          <f7-swipeout-button color="orange" @click="$f7router.back()">Mark</f7-swipeout-button>
          <f7-swipeout-button
            delete
            overswipe
            confirm-text="Are you sure you want to delete this item?"
          >Delete</f7-swipeout-button>
        </f7-swipeout-actions>
      </f7-list-item>-->
    </f7-list>
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
    },
    methods: {
      //Método que elimina la cuenta del cliente y todos los ficheros asociados
      deleteAccount: function (){
        return this.axios.delete('http://127.0.0.1:8080/api/user/delete/'+this.userId,
             {headers:{
              'Content-Type':'application/json',
              'X-Requested-With': 'XMLHttpRequest'
              }
            }).then(response => { 
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