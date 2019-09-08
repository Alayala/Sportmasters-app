<template>
  <f7-page name="home">

    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#" v-if="rol != 2">Sportmasters - Bienvenid@ {{ userName }}</b-navbar-brand>
         <b-navbar-brand href="#" v-else>Sportmasters - Administración</b-navbar-brand>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" v-if="rol != 2">
          <b-nav-form>
            <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="right" style="color:white;"></f7-link>
          </b-nav-form>       
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto" v-else>
          <b-nav-form>
            <f7-link icon-f7="exit" color="white" icon-only href="/" view='#main-view'></f7-link>
          </b-nav-form>       
        </b-navbar-nav>

      </b-navbar>
    </div>

    <div class="panel panel-right panel-reveal theme-dark" v-if="rol != 2">
      <f7-view>
        <!--Panel para usuarios-->
        <f7-page class="menu_lateral" >
          <!--Panel para usuarios-->
            <f7-navbar title="Mi cuenta" >
              <img id="avatar-miniature" :src="avatar">
            </f7-navbar>
            <f7-block><f7-link class="panel-close" href='/personal-data/' view='#main-view' icon-f7="person">Datos personales</f7-link></f7-block>

            <f7-block>
              <f7-link v-if="rol == 0" class="panel-close" href='/personal-videos/' view='#main-view' icon-f7="videocam">Mis videos</f7-link>
              <f7-link v-else class="panel-close" href='/personal-offers/' view='#main-view' icon-f7="tabss">Ofertas</f7-link>
            </f7-block>

            <f7-block>
              <f7-link v-if="rol == 0 && !showDisabled" 
                v-bind:class="{ 'panel-close': true,  'link external': true }" 
                :href='curriculum' 
                id="ver_curriculum"
                icon-f7="document_person"
                view='#main-view'>Ver curriculum
              </f7-link>
            </f7-block>

            <f7-block>
              <f7-link class="panel-close" href='/my-account/' view='#main-view' icon-f7="gear">Mi cuenta</f7-link>
            </f7-block>

            <f7-block>
              <f7-link class="panel-close" href="/" view='#main-view' icon-f7="exit">Cerrar Sesión</f7-link>
            </f7-block>

        </f7-page>
      </f7-view>
    </div>

    <!--Logotipos de empresas que trabajan con nosotros-->
    <f7-swiper style="height:18%">
      <f7-swiper-slide>
        <img src="../../images/banner1.png" width="100%">
      </f7-swiper-slide>
      <f7-swiper-slide>
        <img src="../../images/banner2.png" width="100%">
      </f7-swiper-slide>
      <f7-swiper-slide>
        <img src="../../images/banner3.png" width="100%">
      </f7-swiper-slide>
    </f7-swiper>

    <div v-if="rol != 2">
      <f7-appbar>
        <div class="left">
          <label>Filtrar:</label>
          <select class="custom-select" @change="filterPrimary" >
              <option selected disabled>Seleccionar</option>
              <option value="category">Categoría</option>
              <option value="subcategory">Subcategoría</option>
              <option value="all">Mostrar todo</option>
          </select>

          <select class="custom-select" @change="filterSecundary">
            <option selected disabled id="selectDefault"> ------------- </option>
            <option :value="listadoF.id" v-for="(listadoF, index) in listItemFilter">{{listadoF.name}}</option>
          </select>
        </div>

      </f7-appbar>
      <f7-block-title class="title-strong" v-if="rol == 0">Demandas Activas</f7-block-title>
      <f7-block-title class="title-strong" v-else>Videos activos</f7-block-title>

      <div class="infinite-scroll-content infinite-scroll-top">
        <!-- Cards que se mostrarán para el usuario candidato-->
        <div v-if="rol == 0">
          <f7-block strong class="offer_list">
            <f7-row v-if="listItemOffers.length > 0">
              <f7-col width="100" tablet-width="30" v-for="(listadoO, index) in listItemOffers">

                <f7-card class="card_offer" >
                  <f7-card-header class="no-border" valign="bottom" style="background-color:lightorange;">{{listadoO.title}}</f7-card-header>
                  <f7-card-content style="padding-top:10px;">
                    <p class="date">
                      <label>{{listadoO.create}}</label>
                      <label class="name">{{listadoO.name}}</label>
                      <img :src="listadoO.avatar"/>
                    </p>
                    <p>{{listadoO.description}}</p>
                  </f7-card-content>
                  <f7-card-footer>
                    <f7-link :href="listadoO.link">Ver demanda</f7-link>
                  </f7-card-footer>
                </f7-card>
            
              </f7-col>
            </f7-row>
            <f7-block-title v-else>No existen demandas activas actualmente</f7-block-title>
          </f7-block>
        </div>

        <div v-else>
          <f7-block strong class="offer_list">
            <f7-row v-if="listItemVideos.length > 0">
                <f7-col width="100" tablet-width="30" v-for="(listadoV, index) in listItemVideos">

                  <f7-card class="card_videos">
                    <f7-card-header class="no-border" valign="bottom" style="background-color:lightorange;">{{listadoV.title}}</f7-card-header>
                    <f7-card-content style="padding-top:10px;">
                      <p class="date">{{listadoV.create}}</p>
                      <f7-block class="iframe-container">
                        <iframe ref="player" :src="listadoV.url" width="1425" height="559" allowfullscreen allow="autoplay; encrypted-media"></iframe>
                      </f7-block>
                    </f7-card-content>
                    <f7-card-footer>
                      <f7-link :href="listadoV.link">Ver perfil</f7-link>
                    </f7-card-footer>
                  </f7-card>

                </f7-col>
            </f7-row>
            <f7-block-title v-else>No existen videos actualmente</f7-block-title>
          </f7-block>
        </div>

      </div>
    </div>

    <!-- PANEL ADMINISTRACION-->
    <div v-else>
      <f7-toolbar tabbar bottom>
        <f7-link tab-link="#tab-1" tab-link-active>Gestión de categorías</f7-link>
        <f7-link tab-link="#tab-2">Moderar Videos</f7-link>
      </f7-toolbar>

      <f7-tabs>
        <f7-tab id="tab-1" class="page-content" tab-active>
          <f7-block>
            <f7-row>
                <f7-block>

                  <f7-menu v-if="!selectedElem">
                    <f7-menu-item text="Nueva categoría" title="Añadir una categoría" sheet-open=".popover-create-category"></f7-menu-item>
                  </f7-menu>

                  <f7-menu v-else-if="isCategory">
                    <f7-menu-item text="Editar" sheet-open=".popover-edit-category"></f7-menu-item>
                    <f7-menu-item text="Nueva subcategoría" sheet-open=".popover-create-subcategory"></f7-menu-item>
                    <f7-menu-item text="Eliminar" @click="deleteCategory"></f7-menu-item>
                  </f7-menu>

                  <f7-menu v-else="!isCategory">
                    <f7-menu-item text="Editar" sheet-open=".popover-edit-subcategory"></f7-menu-item>
                    <f7-menu-item text="Eliminar" @click="deleteSubcategory"></f7-menu-item>
                  </f7-menu>

                </f7-block>
              </f7-row>


            <f7-row>
              <f7-navbar class="span" title="Seleccione uno de los elementos"></f7-navbar>
                <f7-block strong tablet-inset class="no-padding-horizontal" v-if="listItemsCategory.length > 0">
                  <div v-for="(listado, index) in listItemsCategory">

                    <f7-treeview>
                      <f7-treeview-item :label="listado[0].category_name" :key="index" icon-f7="folder_fill">
                        <f7-radio slot="content-start" @change="selectCategory" :value="listado[0].category_id" name="category" style="padding-top: 7px;"></f7-radio>

                          <f7-treeview-item :label="subcategorias.name" :key="sub"
                          v-if="listado.length != 0" 
                          v-for="(subcategorias, sub) in listado[0].subcategory">
                            <f7-radio slot="content-start" name="category" @change="selectSubcategory" :value="subcategorias.id" :checked="subcategorias.checked"></f7-radio>
                          </f7-treeview-item>

                        </f7-treeview-item>
                      </f7-treeview>
                  </div>
                </f7-block>
                  
                <f7-block strong tablet-inset class="no-padding-horizontal" v-else style="text-align:center">
                  {{ load }}
                </f7-block>
              </f7-row>

            </f7-block>
          </f7-tab>

          <f7-tab id="tab-2" class="page-content">
            <f7-block>
              <p>Funcionalidad a implementar en la siguiente fase</p>
            </f7-block>
          </f7-tab>
        </f7-tabs>
      </div>

    <!-- Popover crear categoria-->
    <f7-sheet class="popover-create-category" backdrop>

      <f7-toolbar>
        <div class="left"><span>Rellene todos los campos</span></div>
        <div class="right">
          <f7-link sheet-close>Cerrar</f7-link>
        </div>
      </f7-toolbar>
      <!-- Scrollable sheet content -->
      <f7-page-content>
        <f7-list no-hairlines-md>
          <f7-list-input
            outline
            label="Categoría"
            floating-label
            type="text"
            maxlength="40"
            @input="nameCategory = $event.target.value"
            placeholder="Nombre de la categoría"
            clear-button
            required
            validate
          />
          
         </f7-list>
         <f7-button fill raised @click="createCategory">Guardar</f7-button>
      </f7-page-content>
    </f7-sheet>

    <f7-sheet class="popover-edit-category" backdrop>

      <f7-toolbar>
        <div class="left"><span>Rellene todos los campos</span></div>
        <div class="right">
          <f7-link sheet-close>Cerrar</f7-link>
        </div>
      </f7-toolbar>
      <!-- Scrollable sheet content -->
      <f7-page-content>
        <f7-list no-hairlines-md>
          <f7-list-input
            outline
            label="Categoría"
            maxlength="40"
            floating-label
            type="text"
            @input="nameCategory = $event.target.value"
            placeholder="Nombre de la categoría"
            clear-button
            required
            validate
          />
          
         </f7-list>
         <f7-button fill raised @click="updateCategory">Guardar</f7-button>
      </f7-page-content>
    </f7-sheet>

    <f7-sheet class="popover-create-subcategory" backdrop>
        <f7-toolbar>
          <div class="left"><span>Rellene todos los campos</span></div>
          <div class="right">
            <f7-link sheet-close>Cerrar</f7-link>
          </div>
        </f7-toolbar>

        <f7-page-content>
          <f7-list no-hairlines-md>
            <f7-list-input
              outline
              label="Subcategoría"
              floating-label
              maxlength="40"
              type="text"
              @input="nameSubcategory = $event.target.value"
              placeholder="Nombre de la subcategoría"
              clear-button
              required
              validate
            />

            <f7-list-input
              label="Resizable"
              floating-label
              type="textarea"
              resizable
              placeholder="Descripción"
              maxlength="120"
              @input="descriptionSubcategory = $event.target.value"
              required
              validate
            />
          
          </f7-list>
          <f7-button fill raised @click="createSubcategory">Guardar</f7-button>
        </f7-page-content>
    </f7-sheet>

    <f7-sheet class="popover-edit-subcategory" backdrop>

      <f7-toolbar>
        <div class="left"><span>Rellene todos los campos</span></div>
        <div class="right">
          <f7-link sheet-close>Cerrar</f7-link>
        </div>
      </f7-toolbar>
      <!-- Scrollable sheet content -->
      <f7-page-content>
        <f7-list no-hairlines-md>
          <f7-list-input
            outline
            label="Subcategoría"
            floating-label
            maxlength="40"
            type="text"
            @input="nameSubcategory = $event.target.value"
            placeholder="Nombre de la subcategoría"
            clear-button
            required
            validate
          />

          <f7-list-input
            label="Resizable"
            floating-label
            type="textarea"
            resizable
            placeholder="Descripción"
            maxlength="120"
            required
            @input="descriptionSubcategory = $event.target.value"
            validate
          />
          
         </f7-list>
         <f7-button fill raised @click="updateSubcategory">Guardar</f7-button>
      </f7-page-content>
    </f7-sheet>

    <v-dialog />

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
        rol: '',
        listItemVideos: [],
        listItemOffers:[],
        listItemsCategory: [],
        nameCategory: '',
        selectedElem: false,
        idSelectedElem: '',
        descriptionSubcategory: '',
        load: 'Cargando...',
        isCategory: true,
        userName:'',
        listItemFilter: [],
        filterType: '',
      } 
    },
    mounted: function() {
      this.user_data = JSON.parse(localStorage.getItem('login'));
      this.rol = this.user_data["rol"]; 
      this.userName = this.user_data["name"];

      this.getData();
      this.loadCategoryList();
    },
    methods: {
      loadAllSubcategory: function(){
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/administration/subcategory/all',
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
            //success
            this.filterType="subcategory";
            if(response.data != undefined){
              if(response.data.length === undefined){
                this.listItemFilter.length = 0;
              }else{
                this.listItemFilter = response.data;
              }
            }
          }).catch( error => {
            console.log(error)
          });
      },
      loadAllCategory: function(){
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/administration/category/all',
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
            //success
            this.filterType="category";
            if(response.data != undefined){
              if(response.data.length === undefined){
                this.listItemFilter.length = 0;
              }else{
                this.listItemFilter = response.data;
              }
            }
          }).catch( error => {
            console.log(error)
          });
      },
      filterPrimary: function(event){
        var selected = event.target.value;

        if(selected == "all"){
          this.getData();
        }else if(selected == "category"){
          this.$f7.$('#selectDefault').prop('selected', true); 
          this.loadAllCategory();
        }else if(selected == "subcategory"){
          this.$f7.$('#selectDefault').prop('selected', true); 
          this.loadAllSubcategory();
        }
      },
      filterSecundary: function(event){
        var option = event.target.value;

        var fd = new FormData();
        fd.append('type', this.filterType);
        fd.append('option', option);
        fd.append('rol', this.rol);

        return this.axios.post('http://sportmastersapi.hostingerapp.com/api/user/filter/list',fd,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
            //success
            if(response.data != undefined){
              if(response.data.length === undefined){
                if(this.rol == "0"){
                  this.listItemOffers.length = 0;
                }else if(this.rol == "1"){
                  this.listItemVideos.length = 0;
                }
              }else{
                if(this.rol == "0"){
                  this.listItemOffers = response.data;
                }else if(this.rol == "1"){
                  this.listItemVideos = response.data;
                }
              }
            }
          }).catch( error => {
            console.log(error)
          });
      },
      //creamos una nueva categoria
      createCategory: function(event){
        this.$f7.sheet.close();
        var fd = new FormData();
        fd.append('name', this.nameCategory);

        return this.axios.post('http://sportmastersapi.hostingerapp.com/api/administration/category/create',fd,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
            //success
            this.openModalRefresh('Se ha creado la categoría correctamente')
          }).catch( error => {
            //error
            this.openModalSimple('Error, vuelva a intentarlo de nuevo');
            console.log(error);
          });
      },
      //actualizamos la categoría seleccionada
      updateCategory: function(event){
        this.$f7.sheet.close();
        var fd = new FormData();
        fd.append('name', this.nameCategory);

        return this.axios.post('http://sportmastersapi.hostingerapp.com/api/administration/category/update/'+this.idSelectedElem,fd,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
            //success
            this.openModalRefresh('Categoría editada correctamente')
          }).catch( error => {
            //error
            this.openModalSimple('Error, vuelva a intentarlo de nuevo');
            console.log(error);
          });
      },
      //Listamos las categorias y subcategorias existentes en el sistema
      loadCategoryList: function(){
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/administration/category/list',
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
            //success
            if(response.data != undefined){
              if(response.data.length === undefined){
                this.listItemsCategory.length = 0;
              }else{
                this.listItemsCategory = response.data;
              }
            }

            if(this.listItemsCategory.length == 0)
              this.load = "No existen categorías";
          }).catch( error => {
            //error
            console.log(error)
          });
      },
      getCurriculum: function(id) {
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/user/curriculum/'+id,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
          this.showDisabled = false;
        }).catch( error => {
          if(error.response.status === 404){
            this.showDisabled = true;
          }
        });
      },
      getAvatar: function(id) {
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/user/avatar/name/'+id,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
          this.avatar = 'http://sportmastersapi.hostingerapp.com/api/user/avatar/' + response.data.name;
        }).catch( error => {
          console.log(error);
        });
      },
      getData: function(){
        this.getAvatar(this.user_data["id"]);

        if(this.rol == "0"){//Si es un candidato consultamos el curriculum
          if(this.getCurriculum(this.user_data["id"])){
            this.curriculum = 'http://sportmastersapi.hostingerapp.com/api/user/curriculum/' + this.user_data["id"];
          }
          this.getOffers();
        }else if(this.rol == "1"){
          this.getVideos();
        }        
      },
      //Listamos todas las ofertas activas disponibles
      getOffers: function(){
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/user/offer/list-all/',
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
          //success
          this.listItemOffers = response.data;

          if(this.listItemOffers.length === undefined){
            this.listItemOffers.length = 0;
          }

          this.$f7.preloader.show();
            setTimeout(() => {
              this.$f7.preloader.hide();
              this.$f7ready((f7) => {  });
            }, 2000);
        }).catch( error => {
          //error
          this.showMsg(error.response.data['message']);
        });
      },
      //Listamos todos los videos activos disponibles
      getVideos: function(){
         return this.axios.get('http://sportmastersapi.hostingerapp.com/api/bussiness/video/list-all/',
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
          //success
          this.listItemVideos = response.data;
          if(this.listItemVideos.length === undefined){
              this.listItemVideos.length = 0;
          }

          this.$f7.preloader.show();
            setTimeout(() => {
              this.$f7.preloader.hide();
              this.$f7ready((f7) => {  });
            }, 2000);
        }).catch( error => {
          //error
          this.showMsg(error.response.data['message']);
        });
      },
      //Seleccionamos una categoria para gestionarla
      selectCategory: function(event){
        var valor = event.target.value;
        this.isCategory = true;

        if(event.target.checked){
          this.selectedElem = true;
          this.idSelectedElem = valor;
        }else{
          //alert("Categoria "+valor+" deseleccionada");
          this.selectedElem = false;
        }
      },
      //Seleccionamos una subcategoría para gestionarla
      selectSubcategory: function(event){
        var valor = event.target.value;
        this.isCategory = false;

        if(event.target.checked){
          this.selectedElem = true;
          this.idSelectedElem = valor;
        }else{
          this.selectedElem = false;
        }
      },
      deleteCategory: function(){
        this.$f7.sheet.close();

        return this.axios.delete('http://sportmastersapi.hostingerapp.com/api/administration/category/delete/'+this.idSelectedElem,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
            //success
            this.openModalRefresh('Se ha eliminado la categoría')
          }).catch( error => {
            this.openModalSimple('Error, inténtelo de nuevo')
            console.log(error);
          });
      },
      deleteSubcategory: function(){
        this.$f7.sheet.close();

        return this.axios.delete('http://sportmastersapi.hostingerapp.com/api/administration/subcategory/delete/'+this.idSelectedElem,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
            //success
            this.openModalRefresh('Se ha eliminado la subcategoría')
          }).catch( error => {
            this.openModalSimple('Error, inténtelo de nuevo')
            console.log(error);
          });
      },
      createSubcategory: function(event){
        this.$f7.sheet.close();
        var fd = new FormData();
        fd.append('name', this.nameSubcategory);
        fd.append('description', this.descriptionSubcategory);
        fd.append('category', this.idSelectedElem);

        return this.axios.post('http://sportmastersapi.hostingerapp.com/api/administration/subcategory/create',fd,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
          }).then(response => { 
            //success
            this.openModalRefresh('Se ha creado la subcategoría')
          }).catch( error => {
            this.openModalSimple('Error, inténtelo de nuevo')
            console.log(error);
          });
      },
      //actualizamos la categoría seleccionada
      updateSubcategory: function(event){
        this.$f7.sheet.close();

        var fd = new FormData();
        fd.append('name', this.nameSubcategory);
        fd.append('description', this.descriptionSubcategory);

        return this.axios.post('http://sportmastersapi.hostingerapp.com/api/administration/subcategory/update/'+this.idSelectedElem,fd,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
            //success
            this.openModalRefresh('Subcategoría editada correctamente')
          }).catch( error => {
            //error
            this.openModalSimple('Error, vuelva a intentarlo de nuevo');
            console.log(error);
          });
      },
      /*logout: function(){
        this.$f7router.navigate({ name: 'main' });
        this.$session.clear();
        localStorage.removeItem('user-token');
        localStorage.removeItem('login');
      },*/
      openModalRefresh: function(message){
        this.$modal.show('dialog', {
          title: 'Información!',
          text: message,
            buttons: [
              {
                title: 'Aceptar',
                handler: () => { this.$modal.hide(); this.$f7router.refreshPage();}
              }
            ]
        });
      },
      openModalSimple: function(type, message){
        this.$modal.show('dialog', {
          title: type,
          text: message,
            buttons: [
              {
                title: 'Aceptar'
              }
            ]
          });
      },
    }
  }

</script>