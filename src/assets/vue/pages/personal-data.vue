<template>
  <f7-page name="form">
    <f7-navbar title="Datos personales">
        <f7-link slot="nav-left" icon-f7="arrow_left" icon-only href="/home/"></f7-link>
    </f7-navbar>

    <f7-list no-hairlines-md style="margin-top:0px;">
    
      <div class="messageAlert">
        <b-alert :show="seen" dismissible variant="danger" @dismissed="clearMsg">
           {{ message }}
        </b-alert>
      </div>
      
      <f7-list-item class="avatar">
        <label for="avatarInput"><img for="avatar" :src="avatar" title="Cambiar foto"/></label>
        <input type="file" id="avatarInput" ref="avatarFile" accept="image/*;capture=camera" @change="changeAvatar" hidden>
      </f7-list-item>

      <f7-list-input
        label="Nombre"
        type="text"
        placeholder="Tu nombre"
        :value="name"
        @input="name = $event.target.value"
        validate
        required
        clear-button
      ></f7-list-input>

      <f7-list-input v-if="rol == 0"
        label="Apellidos"
        type="text"
        placeholder="Tus apellidos"
        :value="lastname"
        @input="lastname = $event.target.value"
        validate
        required
        clear-button
      ></f7-list-input>

      <f7-list-input v-if="rol == 0"
        label="Algo sobre ti"
        type="textarea"
        placeholder="Bio"
        :value="description"
        @input="description = $event.target.value"
      >
      </f7-list-input>

      <f7-list-input v-if="rol == 1"
        label="¿A que se dedica tu empresa?"
        type="textarea"
        placeholder="Bio"
        :value="description"
        @input="description = $event.target.value"
      >
      </f7-list-input>

      <f7-list-input
        label="Dirección"
        type="text"
        placeholder="Tu dirección"
        :value="address"
        @input="address = $event.target.value"
        validate
        required
        clear-button
      ></f7-list-input>

      <f7-list-input
        label="Teléfono"
        type="tel"
        placeholder="Teléfono de contacto"
        :value="phone"
        @input="phone = $event.target.value"
        validate
        clear-button
      ></f7-list-input>
          
      <f7-list-input v-if="rol == 0"
        label="Insertar Curriculum"
        type="file"
        placeholder="URL"
        accept="application/pdf"
        @change="changeCurriculum"
        required
      ></f7-list-input>

      <f7-block strong>
        <f7-button class="col" raised fill  @click="saveChanges" >Guardar</f7-button>
      </f7-block>

      <!--Modal con información-->
      <div class="sheet-modal sheet-modal-top my-sheet-top">
        <div class="toolbar toolbar-bottom">
          <div class="toolbar-inner">
            <div class="left"></div>
            <div class="right"><a class="link sheet-close" href="#">Cerrar</a></div>
          </div>
        </div>
        <div class="sheet-modal-inner">
          <div class="block">
            <h4>Información</h4>
            <p>{{ information }}</p>
          </div>
        </div>
      </div>

      <v-dialog/>

    </f7-list>
  </f7-page>
</template>

<script>
  export default {
    data() {
      return {
        message: "",
        seen: false,
        userId: null,
        avatar: '',
        name: '',
        lastname: '',
        address: '',
        description: '',
        phone: '',
        curriculum: '',
        information: '',
        curriculum_name: '',
        existCurriculum: false,
        rol: '',
      }
    },
    mounted() {
      //Método que carga toda la información relativa al usurio cuando carga la página
      var data = JSON.parse(localStorage.getItem('login'));
      this.userId = data["id"];
      this.rol = data["rol"];
      this.fetchUsersData(this.userId);
    },
    methods: {
      //Método que modifica la el archivo curriculum
      changeCurriculum: function (event){
        var file = event.target.value;
        this.curriculum_name = file.replace(/^.*[\\\/]/, '')

        const pdf = event.target.files[0];
        this.curriculum = pdf;
      },
      //Método que modifica la imagen de perfil, almacenando la nueva en el servidor
      changeAvatar: function (event){
        const file = event.target.files[0];       
        var fd = new FormData();
        fd.append('avatar', file);

        return this.axios.post('http://sportmastersapi.hostingerapp.com/api/user/update/avatar/'+this.userId, fd,
             {headers:{
              'Content-Type':'multipart/form-data',
              'X-Requested-With': 'XMLHttpRequest'
              }
            }).then(response => { 
              this.openModalRefresh('Imagen de perfil cambiada correctamente');
            }).catch( error => {
              console.log(error);
            });
      },
      //Método que devuelve toda la información del usuario para mostrarla a través del formulario
      fetchUsersData: function(){
        return this.axios.get('http://sportmastersapi.hostingerapp.com/api/user/show/'+this.userId,
        {headers:{
          'Content-Type':'application/json',
          'X-Requested-With': 'XMLHttpRequest'
          }
        }).then(response => { 
          this.avatar = 'http://sportmastersapi.hostingerapp.com/api/user/avatar/' + response.data.avatar;
          this.name = response.data.name;
          this.lastname = (response.data.lastname == "null") ? "" : response.data.lastname;
          this.address = (response.data.address == "null") ? "" : response.data.address;
          this.phone = (response.data.phone == "null") ? "" : response.data.phone;
          this.description = (response.data.description == "null") ? "" : response.data.description;

          if(response.data.curriculum_pdf != "null" && response.data.curriculum_pdf != ""){
            this.existCurriculum = true;

          }
        }).catch( error => {
          this.showMsg(error.response.data['message']);
        });
      },
      //Método que guarda los cambios en el formulario
      saveChanges: function() {
        var fd = new FormData();
        var error = false;
        fd.append('name', this.name);
        fd.append('lastname', this.lastname);
        fd.append('description', this.description);
        fd.append('address', this.address);
        fd.append('phone', this.phone);
        fd.append('avatar', this.avatar);

        //Si es un candidato
        if(this.rol == 0){
          if(this.existCurriculum && this.curriculum != ""){
            if(!this.isPdf(this.curriculum_name)){
              this.showMsg("Sólo se permiten ficheros en formato PDF");
              error = true;
            }else{
              fd.append('curriculum', this.curriculum);
            }
          }else if(!this.existCurriculum){
            if(this.curriculum == ""){
              this.showMsg("Debe incluir su curriculum en pdf");
              error = true;
            }else if(!this.isPdf(this.curriculum_name)){
              this.showMsg("Sólo se permiten ficheros en formato PDF");
              error = true;
            }else{
              fd.append('curriculum', this.curriculum);
            }
          }
        }

        if(!error){
          return this.axios.post('http://sportmastersapi.hostingerapp.com/api/user/update/'+this.userId, fd,
             {headers:{
              'Content-Type':'multipart/form-data',
              'X-Requested-With': 'XMLHttpRequest'
              }
            }).then(response => { 
              this.information = 'Datos modificados correctamente';
              this.$f7ready((f7) => {
                f7.sheet.open(".my-sheet-top");
              });
            }).catch( error => {
              console.log(error);
              this.showMsg(error.response.data['message']);
            });
        }
      },
      isPdf: function(filename) {
        return /\.pdf$/i.test(filename);
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
      },
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
    }
  }

</script>