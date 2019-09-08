<template>
  <f7-page name="form">
    <f7-navbar title="Editar Oferta">
      <f7-link slot="nav-left" icon-f7="arrow_left" icon-only href="/personal-offers/"></f7-link>
    </f7-navbar>
    
    <f7-block-title>Debes rellenar todos los campos</f7-block-title>

    <div class="messageAlert">
      <b-alert :show="seen" dismissible variant="danger" @dismissed="clearMsg">
        {{ message }}
      </b-alert>
    </div>

    <form>
      <f7-list no-hairlines-md>
        <f7-list-input
          label="Título"
          type="text"
          placeholder="Nombre de la oferta"
          @input="title = $event.target.value"
          :value="title"
          required
          validate
          clear-button
        ></f7-list-input>

        <f7-list-input
          label="Descripción"
          type="textarea"
          placeholder="Descripción de la oferta"
          @input="description = $event.target.value"
          :value="description"
          required
          validate
          clear-button
        >
        </f7-list-input>

        <f7-list-item>
          <span>Visible</span>
          <f7-toggle name="toggleVisible" color="orange" :checked="visible" @change="changeToggle"></f7-toggle>
        </f7-list-item>

         <f7-list-item>
          <span>Oferta cerrada</span>
          <f7-toggle name="toggleClosed" color="green" :checked="closed" @change="changeToggle"></f7-toggle>
        </f7-list-item>

      </f7-list>

      <f7-block-title>Debes asignarla al menos a una de nuestras categorías</f7-block-title>
        <f7-block strong class="no-padding-horizontal">
          <div v-if="listItems.length != 0" v-for="(listado, index) in listItems">

            <f7-treeview>
              <f7-treeview-item :label="listado[0].category_name" :key="index" icon-f7="folder_fill">

                <f7-treeview-item :label="subcategorias.name" :key="sub"
                v-if="listado[0]['subcategory'].length != 0" 
                v-for="(subcategorias, sub) in listado[0]['subcategory']">
                  <f7-checkbox slot="content-start" @change="addSubcategory" :value="subcategorias.id" :checked="subcategorias.checked"></f7-checkbox>
                </f7-treeview-item>

              </f7-treeview-item>
            </f7-treeview>
          </div>
        </f7-block>

        <f7-block-title><strong>{{ candidate }}</strong></f7-block-title>
        <f7-list>  
          <div v-if="listCandidates.length != 0" v-for="(listSelected, index) in listCandidates">
            <f7-list-item
              swipeout
              :title="listSelected.name"
              >
              <f7-swipeout-actions right>
                <f7-swipeout-button color="orange" :href="listSelected.link">Ver perfil</f7-swipeout-button>
                <f7-swipeout-button color="red" class="open-confirm" @click="confirmDeleteCandidate" :name="listSelected.id">Eliminar</f7-swipeout-button>
              </f7-swipeout-actions>
            </f7-list-item>
          </div>
        </f7-list>

        <f7-block strong>
          <f7-row tag="p">
            <f7-col tag="span">
              <f7-button class="col" fill @click="editOffer">Guardar</f7-button>
            </f7-col>
            <f7-col tag="span">
              <f7-button class="col open-confirm" color="red" fill @click="confirmDeleteOffer">Eliminar</f7-button>
            </f7-col>
          </f7-row>
        </f7-block>

    </form>

    <!--Modal con información-->
    <div class="sheet-modal sheet-modal-top my-sheet-top">
      <div class="toolbar toolbar-bottom">
        <div class="toolbar-inner">
          <div class="left"></div>
          <div class="right"><a class="link sheet-close" @click="goBack()">Cerrar</a></div>
        </div>
      </div>
      <div class="sheet-modal-inner">
        <div class="block">
          <h4>Información</h4>
          <p>{{ info }}</p>
        </div>
      </div>
    </div>

    <v-dialog />

  </f7-page>
</template>

<script>
  import { f7Page, f7Navbar, f7BlockTitle, f7Block, f7Treeview, f7TreeviewItem, f7Checkbox } from 'framework7-vue';

  export default {
    components: {
      f7Page, f7Navbar, f7BlockTitle, f7Block, f7Treeview, f7TreeviewItem, f7Checkbox
    },
    data() {
      return {
        title: '',
        description: '',
        visible: false,
        closed: false,
        message: '',
        seen: false,
        listItems: [],
        listCandidates: [],
        selectedItem: [],
        userId: '',
        candidate: '',
        info: '',
      }
    },
    mounted(){
      //Método que carga toda la información relativa al usurio cuando carga la página
      var data = JSON.parse(localStorage.getItem('login'));
      this.userId = data["id"];
      this.offerId = this.$f7route.params.id;

      this.$f7.preloader.show();
      setTimeout(() => {
        this.$f7.preloader.hide();
        this.$f7ready((f7) => { 
          this.loadCategoryList(); 
          this.loadOffer();
        });
      }, 1000);
    },
    methods: {
      confirmDeleteCandidate: function(event){
        this.$modal.show('dialog', {
          title: 'Confirmación!',
          text: '¿Desea eliminar el al candidato de la oferta?',
          buttons: [
            {
              title: 'Borrar',
              handler: () => { this.deleteCandidate(event); }
            },
            {
              title: 'Cancelar'
            }
         ]
        });
      },
      loadOffer: function(){
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/bussiness/offer/show/'+this.offerId,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
            //success
            var list = [];
            this.title = response.data.title;
            this.description = response.data.description;
            this.visible = response.data.visible ? true : false;
            this.closed = response.data.assigned ? true : false;
            this.selectedItem = this.selectedItem.concat(response.data.subcategory);
            this.listCandidates = response.data.candidates;

            if(this.listCandidates.length > 0){
              this.candidate = "Candidatos inscritos"
            }else{
              this.candidate = "No se ha inscrito a ningún candidato";
            }
        }).catch( error => {
            //error
            console.log(error)
        });
      },
      deleteCandidate: function(event){
        this.$modal.hide('dialog');
        var id = event.target.name;
        var fd = new FormData();

        fd.append('user', id);
        
        return this.axios.post('http://sportmastersapi.hostingerapp.com/api/bussiness/offer/delete-inscription/'+this.offerId, fd,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
          }).then(response => { 
            //success
            this.info = "Se ha eliminado al candidato de la oferta";
            
            this.$f7.preloader.show();
            setTimeout(() => {
              this.$f7.preloader.hide();
              this.$f7ready((f7) => { f7.sheet.open(".my-sheet-top"); });
            }, 2000);
          }).catch( error => {
            //error
            console.log(error)
          });
      },
      //Almacenamos las subctegorías asignadas al video
      addSubcategory: function(event){
        var value = event.target.value;
        if(event.target.checked){
          this.selectedItem.push(value);
        }else{
          this.selectedItem.splice(this.selectedItem.indexOf(value), 1);
        }
      },
      changeToggle: function(event){
        //console.log(event);
        if(event.target.name == "toggleVisible"){
          if(event.target.checked){
            this.visible = true;
          }else{
            this.visible = false;
          }
        }else if(event.target.name == "toggleClosed"){
          if(event.target.checked){
            this.closed = true;
            this.visible = false;
          }else{
            this.closed = false;
            this.visible = true;
          }
        }
      },
      //Listamos las categorias y subcategorias existentes en el sistema
      loadCategoryList: function(){
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/bussiness/offer/selected/'+this.offerId,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
            //success
            this.listItems = response.data;
          }).catch( error => {
            //error
            console.log(error)
          });
      },
      confirmDeleteOffer: function(){
        this.$modal.show('dialog', {
          title: 'Confirmación!',
          text: '¿Desea eliminar la demanda?',
          buttons: [
            {
              title: 'Borrar',
              handler: () => { this.deleteOffer();}
            },
            {
              title: 'Cancelar'
            }
         ]
        });
      },
      deleteOffer: function(){
        this.$modal.hide('dialog');

        return this.axios.delete('http://sportmastersapi.hostingerapp.com/api/bussiness/offer/delete/'+this.offerId,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
          }).then(response => { 
            //success
            this.info = "Demanda eliminada correctamente";
            
            this.$f7.preloader.show();
            setTimeout(() => {
              this.$f7.preloader.hide();
              this.$f7ready((f7) => { f7.sheet.open(".my-sheet-top"); });
            }, 2000);
          }).catch( error => {
            //error
            console.log(error)
          });
      },
      validate: function(){
        var validate = true;    

        if (!this.title || !this.description){
          this.showMsg('Debe rellenar todos los campos');
          validate = false;
        }

        if(this.selectedItem.length == 0){
          this.showMsg('Debe seleccionar al menos una categoría');
          validate = false;
        }

        return validate;
      },
      editOffer: function() {
        if(this.validate()){
          var fd = new FormData();

          var checkedV = this.visible ? 1 : 0;
          var checkedC = this.closed ? 1 : 0;

          fd.append('title', this.title);
          fd.append('assigned', checkedC);
          fd.append('description', this.description);
          fd.append('visible', checkedV);
          fd.append('subcategory', this.selectedItem);
          fd.append('user', this.userId);


          return this.axios.post('http://sportmastersapi.hostingerapp.com/api/bussiness/offer/update/'+this.offerId, fd,
            {headers:{
              'Content-Type':'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          }).then(response => { 
            //success
            this.info = "Oferta editada correctamente";

            this.$f7.preloader.show();
            setTimeout(() => {
              this.$f7.preloader.hide();
              this.$f7ready((f7) => { 
                f7.sheet.open(".my-sheet-top"); 
              });
            }, 2000);
          }).catch( error => {
            //error
            this.showMsg(error.response);
          });
        }
      },
      //Nos lleva a la página principal
      goBack: function(){
        this.$f7router.navigate({ name: 'personal-offers' });
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
  }
</script>