<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <i style="font-size:38px" class="fa-brands fa-whatsapp text-success"></i> <span style="font-size:30px">Panel Whatsapp</span>
      </div>

      <el-row class="m-2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h5 class="text-success">Número de teléfono</h5>
          </div>
          <el-row type="flex" justify="center">
            <el-col class="col-md-3 col-sm-12">
              <el-input placeholder="Teléfono" v-model="phone_number"></el-input>
            </el-col>
          </el-row>
        </el-card>
      </el-row>

      <el-row class="m-2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h5 class="text-success">Enviar Templete de bienvenida</h5>
          </div>
          <el-row type="flex" justify="center">
            <el-col class="col-md-2 col-sm-12">
              <h5 for="">Primer mensaje</h5><br>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col class=" col-md-1 col-sm-12">
              <el-button type="success" @click="sendTemplateStartConversation()">Enviar</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-row>

      <el-row class="m-2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h5 class="text-success">Enviar mensaje de texto</h5>
          </div>
          <el-row class="mb-2">
            <el-col>
              <el-input type="textarea" placeholder="Texto" v-model="form.type_text.text"></el-input>
            </el-col>
          </el-row>
          <el-row type="flex" justify="end">
            <el-col class=" col-md-1 col-sm-12">
              <el-button type="success" @click="sendTextMessage()">Enviar</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-row>

      <el-row class="m-2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h5 class="text-success">Enviar documento</h5>
          </div>
          <el-row class="mb-2">
            <el-col class="col-md-6 col-sm-12">
              <el-input type="textarea" placeholder="Texto" v-model="form.type_document.text"></el-input>
            </el-col>
            <el-col class="col-md-6 col-sm-12">
              <el-upload
                action="#"
                class="upload-demo"
                ref="file_document"
                accept=".pdf"
                :auto-upload="false"
                :limit="1"
                :on-change="handleChange"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button slot="trigger" size="small" type="primary">Selecciona un archivo</el-button>
                <div slot="tip" class="el-upload__tip">Solo archivos PDF con un tamaño menor de 25Mb</div>
              </el-upload>
            </el-col>
          </el-row>
          <el-row type="flex" justify="end">
            <el-col class=" col-md-1 col-sm-12">
              <el-button type="success" @click="sendDocumentMessage()">Enviar</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-row>

      <el-row class="m-2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h5 class="text-success">Enviar documento por URL</h5>
          </div>
          <el-row class="mb-2">
            <el-col>
              <label for="">Agrega el URL del documento</label>
              <el-input placeholder="URL" v-model="form.type_document_url.url"></el-input>
            </el-col>
          </el-row>
          <el-row type="flex" justify="end">
            <el-col class=" col-md-1 col-sm-12">
              <el-button type="success" @click="sendDocumentURLMessage()">Enviar</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-row>

      <el-row class="m-2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <h5 class="text-success">Enviar imagen</h5>
          </div>
          <el-row class="mb-2">
            <el-col class="col-md-6 col-sm-12">
              <el-upload
                action="#"
                class="upload-demo"
                ref="file_image"
                accept=".jpg,.png"
                :auto-upload="false"
                :limit="1"
                :on-change="handleChange_image"
                :on-exceed="handleExceed_image"
                :file-list="fileList">
                <el-button slot="trigger" size="small" type="primary">Selecciona una imagen JPG o PNG</el-button>
                <div slot="tip" class="el-upload__tip">Solo archivos JPG o PNG con un tamaño menor de 25Mb</div>
              </el-upload>
            </el-col>
          </el-row>
          <el-row type="flex" justify="end">
            <el-col class=" col-md-1 col-sm-12">
              <el-button type="success" @click="sendImageMessage()">Enviar</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-row>

      <br>
      <br>
    </el-card>

  </div>

</template>

<script>

import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import Swal from 'sweetalert2'
import '@/styles/global_styles.css'
import moment from 'moment'

export default {
  name: 'TableSearch',
  components: {
  },
  data() {
    return {
      form:{
        type_text:{
          text:"",
          recipient_phone_number:"524371037356",
        },
        type_document:{
          text:"",
          file:"",
          recipient_phone_number:"524371037356",
        },
        type_document_url:{
          url:"",
          recipient_phone_number:"524371037356",
        },
        type_image:{
          file:"",
          recipient_phone_number:"524371037356",
        },
        type_template:{
          recipient_phone_number:"524371037356",
        },
      },
      fileList: [],
      phone_number:"",
    }
  },
  beforeMount() {

  },
  created() {

  },

  methods: {

    async sendTextMessage(){

      this.form.type_text.recipient_phone_number = this.phone_number;

      await Api.post("/whatsapp-api/message/send-text-message",this.form.type_text)
        .then(response =>{
            console.log(response);
        })
        .catch(error =>{
          console.log(error);
        });
    },
    
    async sendDocumentMessage(){
      let formRequest = new FormData();
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      this.form.type_document.file = this.$refs.file_document.uploadFiles.length > 0 ? this.$refs.file_document.uploadFiles[0].raw : null;

      formRequest.append("text",this.form.type_document.text);
      formRequest.append("file",this.form.type_document.file);
      formRequest.append("recipient_phone_number",this.phone_number);

      await Api.post("/whatsapp-api/message/send-document-message",formRequest,config)
        .then(response =>{
            console.log(response);
        })
        .catch(error =>{
          console.log(error);
        });
    },

    handleExceed(){
      this.$notify({
                title: 'Aviso',
                message:"Seleccione solo un archivo.",
                type: 'warning'
              });
    },

    handleChange(file,fileList) {
      this.beforeAvatarUpload(file,fileList);

    },

    beforeAvatarUpload(file,fileList){

      let extension = ['pdf'];
      let nameFile = file.name.split('.');
      // Se valida el peso
      if(((file.size/1024)/1024) < 25){
          // Se valida el tipo de archivo
          if(extension.indexOf(nameFile[1]) != -1){
          }else{
              this.$notify({
                title: 'Aviso',
                message:"Seleccione solamente archivos PDF.",
                type: 'warning'
              });
              fileList.pop()
          }
      }else{
          this.$notify({
                title: 'Aviso',
                message:"El archivo supera el limite de 25 MB.",
                type: 'warning'
              });
              fileList.pop()
      }


    },

    handleExceed_image(){
      this.$notify({
                title: 'Aviso',
                message:"Seleccione solo una imagen.",
                type: 'warning'
              });
    },

    handleChange_image(file,fileList) {
      this.beforeAvatarUpload_image(file,fileList);

    },

    beforeAvatarUpload_image(file,fileList){

      let extension = ['jpg','png'];
      let nameFile = file.name.split('.');
      // Se valida el peso
      if(((file.size/1024)/1024) < 25){
          // Se valida el tipo de archivo
          if(extension.indexOf(nameFile[1]) != -1){
          }else{
              this.$notify({
                title: 'Aviso',
                message:"Seleccione solamente archivos de imagen JPG o PNG.",
                type: 'warning'
              });
              fileList.pop()
          }
      }else{
          this.$notify({
                title: 'Aviso',
                message:"El archivo supera el limite de 25 MB.",
                type: 'warning'
              });
              fileList.pop()
      }


    },

    async sendDocumentURLMessage(){

      this.form.type_document_url.recipient_phone_number = this.phone_number;

      await Api.post("/whatsapp-api/message/send-document-url-message",this.form.type_document_url)
        .then(response =>{
            console.log(response);
        })
        .catch(error =>{
          console.log(error);
        });
    },

    async sendImageMessage(){
      let formRequest = new FormData();
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      this.form.type_image.file = this.$refs.file_image.uploadFiles.length > 0 ? this.$refs.file_image.uploadFiles[0].raw : null;

      formRequest.append("file",this.form.type_image.file);
      formRequest.append("recipient_phone_number",this.phone_number);

      await Api.post("/whatsapp-api/message/send-image-message",formRequest,config)
        .then(response =>{
            console.log(response);
        })
        .catch(error =>{
          console.log(error);
        });
    },

    async sendTemplateStartConversation(){

      this.form.type_template.recipient_phone_number = this.phone_number;

      await Api.post("/whatsapp-api/message/send-template-message",this.form.type_template)
        .then(response =>{
            console.log(response);
        })
        .catch(error =>{
          console.log(error);
        });
    },


  },
  filters:{


  },
}
</script>

<style lang="scss" scoped>

</style>
