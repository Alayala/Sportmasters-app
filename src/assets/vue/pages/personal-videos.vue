<template>
  <f7-page >
    <f7-navbar title="Mis Videos">
      <f7-link slot="nav-left" icon-f7="arrow_left" icon-only href="/home/"></f7-link>
    </f7-navbar>
  

    <f7-block-title class="title-strong">{{ message }}</f7-block-title>
     
      <f7-list class="video" media-list v-if="listItems.length > 0">
        <f7-list-item :class="listado.state" v-for="(listado, index) in listItems"
          :link="listado.link"
          :title="listado.title"
          :after="listado.state"
          :subtitle="listado.create"
          :text="listado.description"
        >
          <iframe ref="player" style="margin-top:10px;" :src="listado.url" width="200" height="150" frameborder="0" allowfullscreen allow="autoplay; encrypted-media"></iframe>
        </f7-list-item>
      </f7-list>

      <f7-fab position="center-bottom" slot="fixed" text="Video" color="red" href="/register-video/">
        <f7-icon ios="f7:add" aurora="f7:add" md="material:add" ></f7-icon>
      </f7-fab>

  </f7-page>
</template>
<script>
  
  export default {
    data(){
      return {
        listItems: [],
        sizeList: '',
        message: '',
      }
    },
    mounted(){
      //Método que carga toda la información relativa al usurio cuando carga la página
      var data = JSON.parse(localStorage.getItem('login'));
      this.userId = data["id"];
      this.getVideos();
    },
    methods: {
      ready (event) {
        this.player = event.target;
      },
      playing (event) {
        // The player is playing a video.
      },
      stop () {
        this.player.stopVideo()
      },
      pause () {
        this.player.pauseVideo()
      },
      getVideos: function(){
        return this.axios.get('http://127.0.0.1:8080/api/user/video/list/'+this.userId,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
          //success
          this.$f7.preloader.show();
          setTimeout(() => {
            this.$f7.preloader.hide();
            this.$f7ready((f7) => { 
              this.listItems = response.data;      
              if(this.listItems.length > 0){
                this.message = "Videos"
              }else{
                this.message = 'Aún no tienes ningún video. ¡Añade uno!';
              }
             });
          }, 2000); 
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