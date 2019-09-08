<template>
  <f7-page name="form">
    <f7-navbar title="Información">
       <f7-link slot="nav-left" icon-f7="arrow_left" icon-only href="/home/"></f7-link>
    </f7-navbar>

    <f7-list no-hairlines-md style="margin-top:0px;">
    
      <div class="messageAlert">
        <b-alert :show="seen" dismissible variant="danger" @dismissed="clearMsg">
           {{ message }}
        </b-alert>
      </div>
      
      <f7-list-item class="avatar">
        <label for="avatarInput"><img for="avatar" :src="avatar"/></label>
      </f7-list-item>

      <div class="col" v-if="userData['rol'] == 1">

        <f7-block>
          <p>{{name}}</p>
          <p>{{lastname}}</p>
          <p>{{email}}</p>
          <p>{{description}}</p>
          <p>
            <f7-link
                v-bind:class="{ 'panel-close': true,  'link external': true }" 
                :href='curriculum' 
                id="ver_curriculum"
                view='#main-view'>Curriculum
              </f7-link>     
          </p>
          <p><strong>Otros videos de éste usuario:</strong></p>
          <p>
            <f7-swiper navigation :params="{speed:500, slidesPerView: 3, spaceBetween: 20}">
              <f7-swiper-slide v-for="(listadoV, index) in listItemsCandidate">
                <f7-block class="iframe-container" style="width:100%;">
                  <iframe ref="player" :src="listadoV.url" width="1425" height="559" allowfullscreen allow="autoplay; encrypted-media"></iframe>
                </f7-block>
              </f7-swiper-slide>
            </f7-swiper>
          </p>

        </f7-block>        

        <f7-block strong>
          <f7-row tag="p">

            <f7-col tag="span">
              <select class="custom-select" @change="selected">
                <option selected disabled>Ofertas activas</option>
                <option :value="listado.id" v-for="(listado, index) in listActiveItems">{{listado.title}}</option>
              </select>
            </f7-col>

            <f7-col tag="span">
              <f7-button class="col" fill color="orange" @click="signOn">Inscribir</f7-button>
            </f7-col>

          </f7-row>
        </f7-block>

      </div>

      <!-- Si es un empresario su vista será esta-->
      <div v-else>
        <f7-block class="data">
            <p><strong>{{owner}}</strong></p>
            <p>{{owner_description}}</p>
            <p style="font-weight:bold;">¿Que buscamos?</p>
            <p>{{offer_title}} <span>Actualizada: {{update}}</span></p>
            <p style="font-weight:bold;">Perfil</p>
            <p>{{description}}</p>
        </f7-block>
      </div>

    </f7-list>

     <!--Modal con información-->
    <div class="sheet-modal sheet-modal-top my-sheet-top">
      <div class="toolbar toolbar-bottom">
        <div class="toolbar-inner">
          <div class="left"></div>
          <div class="right"><a class="link sheet-close" href="/home/">Cerrar</a></div>
        </div>
      </div>
      <div class="sheet-modal-inner">
        <div class="block">
          <h4>Información</h4>
          <p>{{ info }}</p>
        </div>
      </div>
    </div>

  </f7-page>
</template>

<script>
  export default {
    data() {
      return {
        message: "",
        seen: false,
        userId: null,
        show_user: '',
        avatar: '',
        name: '',
        lastname: '',
        description: '',
        curriculum: '',
        owner: '',
        owner_description: '',
        create: '',
        update: '',
        email: '',
        offer_title: '',
        listActiveItems: [],
        listItemsCandidate: [],
        offerselected: '',
        info: '',
        userData: '',
      }
    },
    mounted() {
      //Método que carga toda la información relativa al usurio cuando carga la página
      this.userData = JSON.parse(localStorage.getItem('login'));
      this.show_id = this.$f7route.params.id;
      this.userId = this.userData["id"];

      if(this.userData["rol"] == "1"){
         this.ofertasActivas();
         this.fetchUsersData(this.show_id);
      }else{
        this.fetchDemandData(this.show_id);
      }
   },
    methods: {
      ofertasActivas: function(){
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/bussiness/offer/list-active/'+this.userId,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
          //success
          this.listActiveItems = response.data;
        }).catch( error => {
          //error
          this.showMsg(error.response.data['message']);
        });
      },
      //Método que devuelve toda la información del usuario para mostrarla a través del formulario
      fetchUsersData: function(){
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/user/show/'+this.show_id,
        {headers:{
          'Content-Type':'application/json',
          'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
          this.avatar = 'http://sportmastersapi.hostingerapp.com/api/user/avatar/' + response.data.avatar;
          this.name = response.data.name;
          this.lastname = (response.data.lastname == "null") ? "" : response.data.lastname;
          this.email = (response.data.email == "null") ? "" : response.data.email;
          this.description = (response.data.description == "null") ? "" : response.data.description;
          this.curriculum = 'http://sportmastersapi.hostingerapp.com/api/user/curriculum/' + this.show_id;
          this.listItemsCandidate = response.data.video;
        }).catch( error => {
          this.showMsg(error.response.data['message']);
        });
      },
      //Método que devuelve toda la información del usuario para mostrarla a través del formulario
      fetchDemandData: function(){
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/bussiness/offer/show-demand/'+this.show_id,
        {headers:{
          'Content-Type':'application/json',
          'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
          this.avatar = 'http://sportmastersapi.hostingerapp.com/api/user/avatar/' + response.data.avatar;
          this.offer_title = (response.data.offer_title == "null") ? "" : response.data.title;
          this.create = (response.data.create == "null") ? "" : response.data.create;
          this.update = (response.data.update == "null") ? "" : response.data.update;
          this.description = (response.data.description == "null") ? "" : response.data.description;
          this.owner = (response.data.owner == "null") ? "" : response.data.owner;
          this.owner_description = (response.data.owner_description == "null") ? "" : response.data.owner_description;
        }).catch( error => {
          this.showMsg(error.response.data['message']);
        });
      },
      selected: function(e){
        this.offerselected = e.target.value;
      },
      //Inscribir a un candidato en la oferta
      signOn: function(){
        var fd = new FormData();

        fd.append('offer', this.offerselected);
        fd.append('user', this.show_id);

        if(this.offerselected == '' || this.offerselected == null){
          this.showMsg("Debe seleccionar una oferta para inscribir al candidato");
        }else{
          return this.axios.post('http://sportmastersapi.hostingerapp.com/api/bussiness/offer/sign-on/'+this.offerselected, fd,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
            }
          }).then(response => { 
            this.info = response.data;
            this.$f7.preloader.show();
            setTimeout(() => {
              this.$f7.preloader.hide();
              this.$f7ready((f7) => { 
                f7.sheet.open(".my-sheet-top"); 
              });
            }, 2000);
          }).catch( error => {
            this.showMsg(error.response.data['message']);
          });
        }

      },
      //Función que elimina los mensajes informativos
      clearMsg: function(){
        this.seen = false;
        this.message = "";
      },
      //Función que muestra mensajes informativos
      showMsg: function(msg){
        this.$f7.$('.page-content').scrollTop(0, 600);
        
        this.message = msg;
        this.seen = true;
        return false;
      }
    }
  }

</script>