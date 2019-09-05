<template>
  <f7-page name="form">
    <f7-navbar title="Editar video">
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
          :value="title"
          required
          validate
          clear-button
        ></f7-list-input>

        <f7-list-input
          label="Url"
          type="url"
          placeholder="Formato http://www.example.com"
          @input="url = $event.target.value"
          :value="url"
          required
          validate
          clear-button
          disabled
        ></f7-list-input>

        <f7-list-input
          label="Descripción"
          type="textarea"
          placeholder="Puedes introducir una breve descripción del video"
          @input="description = $event.target.value"
          :value="description"
          required
          validate
          clear-button
        >
        </f7-list-input>

        <f7-list-item>
          <span>Visible</span>
          <f7-toggle :checked='visible' color="orange" @change="changeToggle"></f7-toggle>
        </f7-list-item>

      <f7-block-title>Asignalo a una de nuestras categorias</f7-block-title>
      
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

        <f7-block strong>
          <f7-row tag="p">
            <f7-col tag="span">
              <f7-button class="col" fill @click="editVideo">Guardar</f7-button>
            </f7-col>
            <f7-col tag="span">
              <f7-button class="col open-confirm" color="red" fill @click="deleteVideo">Eliminar</f7-button>
            </f7-col>
          </f7-row>
        </f7-block>

      </f7-list>
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

    <v-dialog/>


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
        visible: '',
        message: '',
        seen: false,
        listItems: [],
        selectedItem: [],
        selectedChk: [],
        userId: '',
        videoId: '',
        info: '',
      }
    },
    mounted(){
      //Método que carga toda la información relativa al usurio cuando carga la página
      var data = JSON.parse(localStorage.getItem('login'));
      this.userId = data["id"];
      this.videoId = this.$f7route.params.id;

      this.$f7.preloader.show();
      setTimeout(() => {
        this.$f7.preloader.hide();
        this.$f7ready((f7) => { 
          this.loadCategoryList(); 
          this.loadVideo();
        });
      }, 1000);
    },
    methods: {
      //Nos lleva a la página principal
      goBack: function(){
        this.$f7router.navigate({ name: 'personal-videos' });
      },
      loadVideo: function(){
        return this.axios.get('http://127.0.0.1:8080/api/user/video/show/'+this.videoId,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
            //success
            var list = [];
            this.title = response.data.title;
            this.url = response.data.url;
            this.description = response.data.description;
            this.visible = response.data.visible ? true : false;
            this.selectedItem = this.selectedItem.concat(response.data.subcategory);
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
        if(event.target.checked){
          this.visible = true;
        }else{
          this.visible = false;
        }
      },
      //Listamos las categorias y subcategorias existentes en el sistema
      loadCategoryList: function(){
        return this.axios.get('http://127.0.0.1:8080/api/user/video/selected/'+this.videoId,
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
      deleteVideo: function(){
        this.$modal.show('dialog', {
          title: 'Confirmación!',
          text: '¿Desea eliminar el video?',
          buttons: [
            {
              title: 'Borrar',
              handler: () => { this.delete();}
            },
            {
              title: 'Cancelar'
            }
         ]
        });
      },
      delete: function(){
        this.$modal.hide('dialog');
        return this.axios.delete('http://127.0.0.1:8080/api/user/video/delete/'+this.videoId,
          {headers:{
            'Content-Type':'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
          }).then(response => { 
            //success
            this.info = "Video eliminado correctamente";
            
            this.$f7.preloader.show();
            setTimeout(() => {
              this.$f7.preloader.hide();
              this.$f7ready((f7) => { f7.sheet.open(".my-sheet-top"); });
            }, 2000);
            return true;
          }).catch( error => {
            //error
            console.log(error)
          });

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
      editVideo: function() {
        if(this.validate()){
          var fd = new FormData();

          var checked = this.visible ? 1 : 0;

          fd.append('title', this.title);
          fd.append('url', this.url);
          fd.append('description', this.description);
          fd.append('visible', checked);
          fd.append('subcategory', this.selectedItem);
          fd.append('user', this.userId);

          return this.axios.post('http://127.0.0.1:8080/api/user/video/update/'+this.videoId, fd,
            {headers:{
              'Content-Type':'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          }).then(response => { 
            //success
            this.info = "Video editado correctamente";
            
            this.$f7.preloader.show();
            setTimeout(() => {
              this.$f7.preloader.hide();
              this.$f7ready((f7) => { f7.sheet.open(".my-sheet-top"); });
            }, 2000);
                
          }).catch( error => {
            //error
            this.showMsg(error.response);
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