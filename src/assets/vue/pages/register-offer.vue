<template>
  <f7-page name="form">
   <f7-navbar title="Crear nueva demanda">
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
          maxlength="40"
          required
          validate
          clear-button
        ></f7-list-input>

        <f7-list-input
          label="Descripción"
          type="textarea"
          placeholder="Descripción de la oferta"
          @input="description = $event.target.value"
          required
          validate
          clear-button
        >
        </f7-list-input>

        <f7-list-item>
          <span>Visible</span>
          <f7-toggle name="toggleVisible" color="orange" @change="changeToggle"></f7-toggle>
        </f7-list-item>

         <f7-list-item>
          <span>Oferta cerrada</span>
          <f7-toggle name="toggleClosed" color="green" @change="changeToggle"></f7-toggle>
        </f7-list-item>

      <f7-block-title>Debes asignarla al menos a una de nuestras categorías</f7-block-title>
      
        <f7-block strong class="no-padding-horizontal">
          <div v-if="listItems.length != 0" v-for="(listado, index) in listItems">

            <f7-treeview>
              <f7-treeview-item :label="listado[0].category_name" :key="index" icon-f7="folder_fill">

                <f7-treeview-item :label="subcategorias.name" :key="sub"
                v-if="listado[0]['subcategory'].length != 0" 
                v-for="(subcategorias, sub) in listado[0]['subcategory']">
                  <f7-checkbox slot="content-start" @change="addSubcategory" :value="subcategorias.id"></f7-checkbox>
                </f7-treeview-item>

              </f7-treeview-item>
            </f7-treeview>

          </div>
        </f7-block>

        <f7-block strong>
          <f7-button class="col" fill @click="uploadOffer">Guardar</f7-button>
        </f7-block>

      </f7-list>
    </form>

    <!--Modal con información-->
    <div class="sheet-modal sheet-modal-top my-sheet-top">
      <div class="toolbar toolbar-bottom">
        <div class="toolbar-inner">
          <div class="left"></div>
          <div class="right"><a class="link sheet-close" href="/personal-offers/">Cerrar</a></div>
        </div>
      </div>
      <div class="sheet-modal-inner">
        <div class="block">
          <h4>Información</h4>
          <p>Oferta guardada correctamente</p>
        </div>
      </div>
    </div>


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
        selectedItem: [],
        userId: '',
      }
    },
    mounted(){
      //Método que carga toda la información relativa al usurio cuando carga la página
      var data = JSON.parse(localStorage.getItem('login'));
      this.userId = data["id"];
      this.loadCategoryList();
    },
    methods: {
      //Almacenamos las subctegorías asignadas al video
      addSubcategory: function(event){
        var value = event.target.value;
        if(event.target.checked){
          this.selectedItem.push(value);
        }else{
          this.selectedItem.splice(this.selectedItem.indexOf(value), 1);
        }
      },
      //Listamos las categorias y subcategorias existentes en el sistema
      loadCategoryList: function(){
        return this.axios.get('http://127.0.0.1:8080/api/administration/category/list',
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
          }else{
            this.closed = false;
          }
        }  
      },
      //Mostramos mensaje de error
      showMsg: function(msg){
        this.$f7.$('.page-content').scrollTop(0, 600);
        this.message = msg;
        this.seen = true;
        return false;
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
      uploadOffer: function() {
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

          return this.axios.post('http://127.0.0.1:8080/api/bussiness/offer/create/', fd,
            {headers:{
              'Content-Type':'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          }).then(response => { 
            //success
            this.$f7.preloader.show();
            setTimeout(() => {
              this.$f7.preloader.hide();
              this.$f7ready((f7) => { f7.sheet.open(".my-sheet-top"); });
            }, 2000);
                
          }).catch( error => {
            //error
            this.showMsg(error.response.data['message']);
          });
        }
      },
      //Función que elimina los mensjes informativos
      clearMsg: function(){
        this.seen = false;
        this.message = "";
      }
    }
  }
</script>