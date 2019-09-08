<template>
  <f7-page name="form">
    <f7-navbar title="Nuevo video">
      <f7-link slot="nav-left" icon-f7="arrow_left" icon-only href="/personal-videos/"></f7-link>
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
          label="Titulo"
          type="text"
          maxlenght="40"
          placeholder="Titulo del video"
          @input="title = $event.target.value"
          required
          validate
          clear-button
        ></f7-list-input>

        <f7-list-input
          label="Url"
          type="url"
          placeholder="Formato http://www.example.com"
          @input="url = $event.target.value"
          required
          validate
          clear-button
        ></f7-list-input>

        <f7-list-input
          label="Descripción"
          type="textarea"
          placeholder="Puedes introducir una breve descripción del video"
          @input="description = $event.target.value"
          required
          validate
          clear-button
        >
        </f7-list-input>

        <f7-list-item>
          <span>Visible</span>
          <f7-toggle id="toggle" color="orange" @change="changeToggle"></f7-toggle>
        </f7-list-item>

      <f7-block-title>Asignalo a una de nuestras categorias</f7-block-title>
      
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
          <f7-button class="col" fill @click="uploadVideo">Guardar</f7-button>
        </f7-block>

      </f7-list>
    </form>

    <!--Modal con información-->
    <div class="sheet-modal sheet-modal-top my-sheet-top">
      <div class="toolbar toolbar-bottom">
        <div class="toolbar-inner">
          <div class="left"></div>
          <div class="right"><a class="link sheet-close" href="/personal-videos/">Cerrar</a></div>
        </div>
      </div>
      <div class="sheet-modal-inner">
        <div class="block">
          <h4>Información</h4>
          <p>Video guardado correctamente</p>
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
        url: '', 
        description: '',
        visible: false,
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
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/administration/category/list',
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
        if(event.target.checked){
          this.visible = true;
        }else{
          this.visible = false;
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

        if (!this.title || !this.url || !this.description){
          this.showMsg('Debe rellenar todos los campos');
          validate = false;
        }

        if(this.selectedItem.length == 0){
          this.showMsg('Debe seleccionar al menos una categoría');
          validate = false;
        }

        return validate;
      },
      uploadVideo: function() {
        if(this.validate()){
          var fd = new FormData();

          var checked = this.visible ? 1 : 0;

          fd.append('title', this.title);
          fd.append('url', this.url);
          fd.append('description', this.description);
          fd.append('visible', checked);
          fd.append('subcategory', this.selectedItem);
          fd.append('user', this.userId);

          return this.axios.post('http://sportmastersapi.hostingerapp.com/api/user/video/create', fd,
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