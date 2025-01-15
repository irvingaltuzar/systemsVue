<template>
    <el-dialog title="Justificar incidencia" :visible.sync="visible_modal">
        <el-row class="mt-2">
            <el-row class="card-info">
            <el-col class="col-md-6 col-sm-12">
                <label for="">Colaborador:&nbsp;</label>
                <label for=""><strong>{{ form_justification.collaborator_name }}</strong></label>
            </el-col>
            <el-col class="col-md-3 col-sm-12">
                <label for="">Fecha:&nbsp;</label>
                <label for=""><strong>{{ form_justification.date_incident | short_date }}</strong></label>
            </el-col>
            <el-col class="col-md-3 col-sm-12">
                <label for="">Hora:&nbsp;</label>
                <label for=""><strong>{{ form_justification.entry_hour }}</strong></label>
            </el-col>
            </el-row>
        </el-row> 

        <el-form :model="form_justification" class="mt-3">
            <el-row>
              <el-col>
                <label for="">Tipo de Justificación <span class="input-error">*</span></label>
                <el-select v-model="form_justification.type_justification_id" placeholder="Selecciona el tipo">
                    <el-option
                    v-for="item in typeJustificationsActive" 
                    :label="item.description"
                    :value="item.id"
                    />
                </el-select>
              </el-col>
            </el-row>

            <el-row class="card-warning mb-3" v-if="form_justification.type_justification_id == 2">
              <el-col class="col-md-12 col-sm-12">
                  <label for="">Justificaciones en {{ form_justification.date_incident | nameMonth }} (<strong>Entrada fuera de horario</strong>):&nbsp;</label>
                  <label for=""><strong>{{ number_justification }}</strong></label>
              </el-col>
            </el-row>
            <el-row class="mt-3">
              <el-col >
                <label for="">Descripción <span class="input-error">*</span></label>
                <el-input type="textarea" v-model="form_justification.description"></el-input>
                <span class="input-error" v-if="form_validate.description">{{form_validate.description[0]}}</span>
              </el-col>
            </el-row>

            <el-row class="mt-3">
              <el-col>
                <el-upload
                      v-if="form_disable == true"
                      action="#"
                      class="upload-demo"
                      ref="file_justification"
                      accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                      :auto-upload="false"
                      :limit="1"
                      :on-change="handleChange"
                      :on-exceed="handleExceed"
                      :file-list="fileList"
                      :before-upload="beforeAvatarUpload">
                      <el-button slot="trigger" size="small" type="primary">Selecciona un archivo</el-button>
                      <div slot="tip" class="el-upload__tip">Solo archivos .PDF, .docx, .doc, .jpg, .png y menores a 10 Mb</div>
                </el-upload>
                <a v-if="form_disable == false && form_justification.file_url != ''" :href="form_justification.file_url" class="text-danger " target="_blank"><i class="fa-solid fa-file-pdf icon-document"></i> Archivo adjunto</a>
              </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible_modal = false">Cancel</el-button>
            <el-button v-if="form_disable == true" type="primary" :loading="form_justification.btn_add_justification" @click="addJustificationIncident()">Justificar {{  }}</el-button>
        </span>
    </el-dialog>
</template>
  
  <script>
  
  import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
  import { mapGetters} from 'vuex'
  import '@/styles/global_styles.css'
  import moment from 'moment'
  
  export default {
    name: 'modalJustificacion',
    components: {

    },
    data() {
      return {
        form_justification:{
          rfc:"",
          description:"",
          collaborator_name:"",
          date_incident:"",
          entry_hour:"",
          type_justification_id:null,
          incident_process_id:null,
          btn_add_justification:false,
          file_url:""
        },
        form_validate:{
          description:[],
          type_justification:[],
        },
        disabled_fields:false,
        visible_modal:false,
        number_justification:0,
        form_disable:false,
      }
    },
    beforeMount() {
    },
    created() {
      this.$store.dispatch('getTypeJustificationActive')

    },
    computed: {
      ...mapGetters([
        'typeJustificationsActive'
      ])
        
    },
    methods: {
      _tempCreated:function(_data){
            
            this.form_disable=_data.edit;
            
            this.form_justification.collaborator_name = _data.incident.name;
            this.form_justification.date_incident = _data.incident.date_incident;
            this.form_justification.entry_hour = _data.incident.entry_hour;
            this.form_justification.incident_process_id = _data.incident.id;
            this.form_justification.rfc = _data.incident.rfc;
            this.form_justification.file_justification = null;
            

            if(_data.edit == true){
              this.form_justification.description = "";
              this.form_justification.type_justification_id = null;
              this.form_justification.file_url = "";
            }else{
              this.form_justification.description = _data.incident.personal_justification.description;
              this.form_justification.type_justification_id = _data.incident.personal_justification.type_id;
              this.form_justification.file_url = _data.incident.personal_justification.file_url;
            }
            
          this.getNumberJustifications();
          this.clearModal();

        this.visible_modal=true;
      },
      async addJustificationIncident(){

        if(this.form_justification.type_justification_id > 0){
          let ths = this;
          let formRequest = new FormData();
          const config = { headers: { 'Content-Type': 'multipart/form-data' } };
          
          let file_justification = this.$refs.file_justification.uploadFiles.length > 0 ? this.$refs.file_justification.uploadFiles[0].raw : null;
          
          formRequest.append('rfc',this.form_justification.rfc);
          formRequest.append('description',this.form_justification.description);
          formRequest.append('date_incident',this.form_justification.date_incident);
          formRequest.append('type_justification_id',this.form_justification.type_justification_id);
          formRequest.append('incident_process_id',this.form_justification.incident_process_id);
          formRequest.append('file_justification',file_justification);
        
          this.form_justification.btn_add_justification = true
          await Api.post('/rh/incident-process/validate-incident/add-justification',formRequest,config).then(response => {
                  if(response.data.success == 1){

                    ths.$notify({
                      title:"Excelente",
                      message: "Se ha justificado la incidencia correctamente.",
                      type:"success",
                    });
                    ths.visible_modal=false;
                    ths.$emit('listenChildComponent');

                  }else{
                    ths.$notify({
                      title:"Aviso",
                      message: response.data.message,
                      type:"warning",
                    });
                  }
                  
                  const formAut = new FormData()
                  formAut.append('name_view', ths.$route.name)
                  formAut.append('comentarios', "Justificacion de incidencia")
                  formAut.append('id_afectado',ths.form_justification.incident_process_id)
                  formAut.append('evento', 'Se justifico una incidencia -> processIncident()')

                  ths.$store.dispatch('auditoria/addEventAuditoria', formAut)

                  ths.form_justification.btn_add_justification = false
                  
                }).catch(function(error) {

                  console.log(error)
                  ths.form_justification.btn_add_justification = false

                  if(error.response.status && error.response.status == 422){
                    ths.form_validate = error.response.data.errors

                    ths.$notify({
                      title:"Aviso",
                      message: "Los datos proporcionados no son válidos.",
                      type:"error",
                    });

                  }else{
                      ths.$notify({
                        title:"Aviso",
                        message: "Ha ocurrido un error, intente de nuevo",
                        type:"error",
                      });
                  }
                  
                })
        }else{
          this.$notify({
                        title:"Aviso",
                        message: "Seleccione un tipo de justificación.",
                        type:"warning",
                      });

        }
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

        let extension = ['pdf','docx','doc','png','jpg','jpeg'];
        let nameFile = file.name.split('.');
        // Se valida el peso
        if(((file.size/1024)/1024) < 10){
            // Se valida el tipo de archivo
            if(extension.indexOf(nameFile[1]) != -1){
            }else{
                this.$notify({
                  title: 'Aviso',
                  message:"Solo archivos PDF, docx, doc, jpg, png.",
                  type: 'warning'
                });
                fileList.pop()
            }
        }else{
            this.$notify({
                  title: 'Aviso',
                  message:"El archivo supera el limite de 10 MB.",
                  type: 'warning'
                });
                fileList.pop()
        }


      },

      async getNumberJustifications(){
        // Se obtiene la cantidad de justificaciones del tipo de "Entrada fuera de Horario"
        
        await Api.get(`/rh/incident-process/get-number-justification`,{
          params:{
            "rfc":this.form_justification.rfc,
            "date_incident":this.form_justification.date_incident,
          }
        })
        .then(response =>{
          this.number_justification = response.data.number_justifications;
        })
        .catch(error =>{
          console.log(error);

        });
      },

      clearModal(){
        this.form_validate={
          description:[],
          type_justification:[],
        };
        this.form_justification.btn_add_justification=false;
      }

    },
    filters:{  
      short_date(_date){      
        return (moment(_date).format('DD-MM-YYYY')).toLocaleUpperCase();
      },
      nameMonth(_date){
        return (moment(_date).format('MMMM'))
      }
    },
  }
  </script>
  
  <style lang="scss" scoped>
    .circle-vacaciones{
      display: block;
      background: #ff00c8;
      text-align: center;
      border-radius: 20px;
      color: white;
      text-transform: capitalize;
    }
    .circle-permiso{
      display: block;
      background: #7d00eb;
      text-align: center;
      border-radius: 10px;
      color: white;
      text-transform: capitalize;
    }
    .circle-justificacion{
      display: block;
      background: #ffa500;
      text-align: center;
      border-radius: 10px;
      color: white;
      text-transform: capitalize;
    }
    .circle-requisicion{
      display: block;
      background: #a96b48;
      text-align: center;
      border-radius: 10px;
      color: white;
      text-transform: capitalize;
    }
  </style>
  