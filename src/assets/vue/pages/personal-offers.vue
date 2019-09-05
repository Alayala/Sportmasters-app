<template>
  <f7-page >
    <f7-navbar title="Demandas publicadas">
      <f7-link slot="nav-left" icon-f7="arrow_left" icon-only href="/home/"></f7-link>
    </f7-navbar>
  
    <f7-block-title class="title-strong">{{ message }}</f7-block-title>

    <f7-list media-list v-if="listActiveItems.length != 0">
      <f7-list-item :class="listado.state" v-for="(listado, index) in listActiveItems"
        :link="listado.link"
        :title="listado.title"
        :after="listado.state"
        :subtitle="listado.create"
        :text="listado.description"
      >
        <f7-badge color="orange">{{listado.candidates}} candidatos seleccionados</f7-badge>
        <img slot="media" :src="listado.image" width="80" />
      </f7-list-item>
    </f7-list>

    <f7-block-title class="title-strong">{{ message_closed }}</f7-block-title>
   
    <f7-list media-list v-if="listInactiveItems.length != 0">
      <f7-list-item style="background-color: lightgrey; color: grey;" v-for="(listadoI, index) in listInactiveItems"
        :link="listadoI.link"
        :title="listadoI.title"
        :after="listadoI.state"
        :subtitle="listadoI.create"
        :text="listadoI.description"
      >
        <!--<f7-badge color="green">5</f7-badge>-->
        <img slot="media" :src="listadoI.image" width="80" />
      </f7-list-item>
    </f7-list>

    <f7-fab position="center-bottom" slot="fixed" text="Oferta" color="red" href="/register-offer/">
      <f7-icon ios="f7:add" aurora="f7:add" md="material:add" ></f7-icon>
    </f7-fab>

  </f7-page>
</template>
<script>
  
  export default {
    data(){
      return {
        listActiveItems: [],
        listInactiveItems: [],
        message: '',
        message_closed: '',
      }
    },
    mounted(){
      //Método que carga toda la información relativa al usurio cuando carga la página
      var data = JSON.parse(localStorage.getItem('login'));
      this.userId = data["id"];
      this.ofertasActivas();
      this.ofertasInactivas();
    },
    methods: {
      ofertasActivas: function(){
        return this.axios.get('http://127.0.0.1:8080/api/bussiness/offer/list-active/'+this.userId,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
          //success
          this.listActiveItems = response.data;
          if(this.listActiveItems.length > 0){
            this.message = "Demandas activas";
          }else{
            this.message = "Aún no tiene ninguna demanda publicada"
          }
        }).catch( error => {
          //error
          this.showMsg(error.response.data['message']);
        });
      },
      ofertasInactivas: function(){
        return this.axios.get('http://127.0.0.1:8080/api/bussiness/offer/list-inactive/'+this.userId,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
          //success
          this.listInactiveItems = response.data;
          if(this.listInactiveItems.length > 0){
            this.message_closed = "Demandas finalizadas";
          }else if(this.listActiveItems.length > 0){
            this.message_closed = "Ninguna demanda finalizada"
          }else{
            this.message_closed = ""
          }
        }).catch( error => {
          //error
          this.showMsg(error.response.data['message']);
        });
      },
      //Mostramos mensaje de error
      showMsg: function(msg){
        this.$f7.$('.page-content').scrollTop(0, 600);
        this.message = msg;
        this.seen = true;
        return false;
      },
      //Función que elimina los mensjes informativos
      clearMsg: function(){
        this.seen = false;
        this.message = "";
      }
    }
  };
</script>