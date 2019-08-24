<template>
  <f7-page name="home">

    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">Home</b-navbar-brand>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="right" style="color:white;"></f7-link>
          </b-nav-form>       
        </b-navbar-nav>
      </b-navbar>
    </div>

    <f7-panel right reveal theme-dark>
      <f7-view>
        <f7-page class="menu_lateral">
          <f7-navbar title="Mi cuenta" >
            <img id="avatar-miniature" :src="avatar">
          </f7-navbar>
          <f7-block><f7-link class="panel-close" href='/personal-data/' view='#main-view'>Datos personales</f7-link></f7-block>
          <f7-block><f7-link class="panel-close" href='/personal-videos/' view='#main-view'>Mis videos</f7-link></f7-block>
          <f7-block><f7-link v-bind:class="{ 'panel-close': true,  'link external': true, disabled: showDisabled }" :href='curriculum' id="ver_curriculum "view='#main-view'>Ver curriculum</f7-link></f7-block>
          <f7-block><a href="#" class="link">Cuenta</a></f7-block>
          <f7-block><f7-link @click="logout" class="panel-close">Cerrar Sesión</f7-link></f7-block>
        </f7-page>
      </f7-view>
    </f7-panel>

    {{ user_data }}


  </f7-page>
</template>

<script>
  export default {
    data() {
      return {
        user_data: null,
        avatar: '',
        curriculum: null,
        showDisabled: false,
      } 
    },
    mounted: function() {
      this.getData();
    },
    methods: {
      getCurriculum: function(id) {
        return this.axios.get('http://127.0.0.1:8080/api/user/curriculum/'+id,
          {headers:{
            'Content-Type':'multipart/form-data',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
          this.showDisabled = false;
          //console.log(response);
        }).catch( error => {
          if(error.response.status === 404){
            this.showDisabled = true;
          }
          //console.log(error.response);
        });
      },
      getData: function(){
        this.user_data = JSON.parse(localStorage.getItem('login'));
        this.avatar = 'http://127.0.0.1:8080/api/user/avatar/' + this.user_data["avatar"];
        this.getCurriculum(this.user_data["id"]);
        this.curriculum = 'http://127.0.0.1:8080/api/user/curriculum/' + this.user_data["id"];
      },
      logout: function(){
        this.$session.clear();
        localStorage.removeItem('user-token');
        localStorage.removeItem('login');

        this.$f7router.navigate({ name: 'main' });
      }
    }
  }

</script>