<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <h3>Solicitar Permiso</h3>
      </div>

        <div v-if="fullscreenLoading" class="text-center">
          <br>
          <br>
          <br>
          <md-progress-spinner :md-stroke="2" :md-diameter="40" md-mode="indeterminate"></md-progress-spinner>
          <br>
          <br>
          <br>

        </div>

      <div v-else class="m-2">

        <md-content class="m-3">
          <el-row type="flex" class="mt-2 mb-3 section-title text-center">
              <el-col lass="col-md-3 col-sm-12" >
                  <h4>DATOS GENERALES</h4>
              </el-col>
          </el-row>
          <el-row class="mt-1" >
            <el-col class="col-md-4 col-sm-12">
                <label>No. Empleado: </label>
                <label class="label-disabled">{{general_data.personal_id}}</label>
            </el-col>
            <el-col class="col-md-4 col-sm-12">
                <label>Fecha de solicitud: </label>
                <label class="label-disabled">{{current_date | date}}</label>
            </el-col>
            <el-col class="col-md-4 col-sm-12">
                <label>Fecha Recepción RH: </label>
                <label class="label-disabled" style="width: 100px;">&nbsp;</label>
            </el-col>
          </el-row>
          <el-row class="mt-1">
            <el-col class="col-md-4 col-sm-12">
                <label>Nombre: </label>
                <label class="label-disabled">{{general_data.name}} {{general_data.last_name}}</label>
            </el-col>
            <el-col class="col-md-4 col-sm-12">
                <label>Puesto: </label>
                <label class="label-disabled">{{general_data.position_company_full}}</label>
            </el-col>
            <el-col class="col-md-4 col-sm-12">
                <label>Jornada: </label>
                <label class="label-disabled">{{general_data.dmirh_personal_time | working_day}}</label>
            </el-col>
          </el-row>
          <el-row class="mt-1">
            <el-col class="col-md-4 col-sm-12">
                <label>Razón social: </label>
                <label class="label-disabled">{{general_data.company_name}}</label>
            </el-col>
            <el-col class="col-md-4 col-sm-12">
                <label>Ubicación: </label>
                <label class="label-disabled">{{general_data.location}}</label>
            </el-col>
            <el-col class="col-md-4 col-sm-12">
                <label>Departamento: </label>
                <label class="label-disabled">{{general_data.deparment}}</label>
            </el-col>
          </el-row>
        </md-content>

        <md-content class="m-3">
          <el-row type="flex" class="mt-2 mb-3 section-title text-center">
            <el-col  >
                <h4>PERMISO</h4>
            </el-col>
          </el-row>

          <el-row class="mt-2">
            <el-col class="col-md-4 col-sm-12">
              <label>Tipo de permiso <span class="input-required">*</span></label>
              <el-select v-model="form_request_permit.type_permit_id" placeholder="Selecciona una opción" @change="getPermitConcepts(form_request_permit.type_permit_id)" id="type_permit" required>
                <el-option
                  v-for="item in type_permit_list"
                  :key="item.id"
                  :label="item.description"
                  :value="item.id">
                </el-option>
              </el-select>
              <span class="input-error" v-if="form_validate.type_permit_id">{{form_validate.type_permit_id[0]}}</span>
            </el-col>
            <el-col class="col-md-4 col-sm-12">
              <label>Motivo <span class="input-required">*</span></label>
              <div v-if="permit_concept_list.length == 0">
                <el-input  placeholder="Motivo" v-model="form_request_permit.reason"></el-input>
                <span class="input-error" v-if="form_request_permit.type_permit_id == 1 && form_validate.reason">{{form_validate.reason[0]}}</span>
              </div>
              <div v-else>
                <el-select  v-model="form_request_permit.permit_concept_id" placeholder="Selecciona una opción" @change="setReason(form_request_permit.permit_concept_id)">
                  <el-option
                    v-for="item in permit_concept_list"
                    :key="item.id"
                    :value="item.id"
                    :label="item.description">
                  </el-option>
                </el-select>
                <span class="input-error" v-if="form_request_permit.type_permit_id > 1 && form_validate.permit_concept_id">{{form_validate.permit_concept_id[0]}}</span>
              </div>

            </el-col>
            <el-col class="col-md-4 col-sm-12">
              <label>Días <span class="input-required">*</span></label>
              <el-input placeholder="Días" v-model="form_request_permit.total_days" disabled></el-input>
              <span class="input-error" v-if="form_validate.total_days">{{form_validate.total_days[0]}}</span>
            </el-col>
          </el-row>

          <el-row class="mt-2">
            <el-col class="col-md-4 col-sm-12">
              <label>Fecha inicio <span class="input-required">*</span></label>
              <div class="block">
                <el-date-picker
                  v-model="form_request_permit.start_date"
                  type="date"
                  placeholder="Seleccione una fecha"
                  min="2022-09-01"
                  required
                  :pickerOptions="valid_start_date"
                  @change="setStartDate()"
                  >
                </el-date-picker>
              </div>
              <span class="input-error" v-if="form_validate.start_date">{{form_validate.start_date[0]}}</span>
            </el-col>
            <el-col class="col-md-4 col-sm-12">
              <label>Fecha final <span class="input-required">*</span></label>
              <div class="block">
                <el-date-picker
                  v-model="form_request_permit.end_date"
                  type="date"
                  placeholder="Seleccione una fecha"
                  :pickerOptions="valid_end_date"
                  @change="setEndDate()">
                </el-date-picker>
              </div>
              <span class="input-error" v-if="form_validate.end_date">{{form_validate.end_date[0]}}</span>
            </el-col>
          </el-row>

          <el-row class="mt-2">
            <el-col class="col-md-12 col-sm-12">
              <label>Comentarios <span class="input-required">*</span></label>
              <el-input type="textarea" v-model="form_request_permit.comments"></el-input>
              <span class="input-error" v-if="form_validate.comments">{{form_validate.comments[0]}}</span>
            </el-col>
          </el-row>

          <div v-if="attach_support_doc.minimun_documents > 0">
            <el-row class="mt-4">
              <el-col class="col-md-12 col-sm-12" >
                <el-card class="card-info" shadow="always">
                  <h5>Adjuntar Soporte <span class="input-required">*</span></h5>
                  <span class="input-error">Documentos minimos a cargar {{attach_support_doc.minimun_documents}}</span>
                </el-card>
              </el-col>
            </el-row>

            <el-row class="mt-3">
              <el-col class="col-md-12 col-sm-12">
                <el-upload
                  action="#"
                  class="upload-demo"
                  ref="files_attach_support"
                  accept=".pdf"
                  :auto-upload="false"
                  :on-change="handleChange"
                  :file-list="fileList"
                  :before-upload="beforeAvatarUpload">
                  <el-button slot="trigger" size="small" type="primary">Selecciona un archivo</el-button>
                  <div slot="tip" class="el-upload__tip">Solo archivos PDF con un tamaño menor de 5Mb</div>
                </el-upload>
                <span class="input-error" v-if="form_validate.minimun_documents">{{form_validate.minimun_documents[0]}}</span>
              </el-col>
            </el-row>
          </div>


          <br>
          <el-row class="mt-3" type="flex" justify="end">
            <el-col class="col-md-3 col-sm-12 text-center">
                <el-button type="success" @click="saveRecord()">Solicitar</el-button>
            </el-col>
          </el-row>

        </md-content>


      </div>

      <!-- <view_record ref="viewWorkPermitComponent" :visible="modal_view_save_record" :headers="general_data" :content="record_preview" :permission_sign="true"></view_record>   -->
      <view_record ref="viewWorkPermitComponent"></view_record>

    </el-card>


  </div>

</template>

<script>

import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import '@/styles/global_styles.css'
import moment from 'moment'
import view_record from './viewRecord'

export default {
  name: 'PaperContent',
  components: {
    view_record
  },
  data() {
    return {
      general_data:{},
      headers:{
        limit:20,
        page:1,
        order_by:'asc',
        search:{
            isSearch:false,
            text:""
        }
      },
      fullscreenLoading:false,
      current_date: new Date(),
      form_request_permit:{
        personal_id:null,
        personal_intelisis_usuario_ad:null,
        type_permit_id:null,
        permit_concept_id:null,
        reason:"",
        start_date:null,
        end_date:null,
        total_days:null,
        comments:"",
      },
      form_validate:[],
      valid_start_date:null,
      valid_end_date:null,
      type_permit_list:[],
      permit_concept_list:[],
      modal_view_save_record:false,
      working_day:[],
      attach_support_doc:{}

    }
  },
  beforeMount() {
    this.getUser()
    this.setValidStartDate();

  },
  created() {
    this.getTypePermit();
  },

  methods: {
    async getUser(){
      this.fullscreenLoading= true;

      await Api.get('/rh/personal-intelisis/profile')
      .then(response =>{
        if(response.data.success == 1){
          this.general_data = response.data.data;
          this.form_request_permit.personal_intelisis_usuario_ad = this.general_data.usuario_ad;
          this.form_request_permit.personal_id = this.general_data.personal_id;
          this.workingDayAvailable(this.general_data.dmirh_personal_time);
          this.fullscreenLoading = false;

        }else{
          this.$notify({
            title: 'Error',
            message: response.data.message,
            type: 'error'
          });
        }

      })
      .catch(error =>{
        this.fullscreenLoading = false;
        this.$notify({
            title: 'Error',
            message: 'Error al conectarse con el servidor, vuelva a intentarlo de nuevo',
            type: 'error'
          });
        console.log('request error => /rh/personal-intelisis/profile',error);

      });

    },

    setValidStartDate(){
      let temp_date = moment(moment(new Date()).subtract(10,'days'));

      this.valid_start_date = {disabledDate(time) {
            return time.getTime() < temp_date;
          },
        }
    },

    async getTypePermit(){
      this.fullscreenLoading= true;

      await Api.get('/rh/work-permits/type-permit-list')
      .then(response =>{

        if(response.data.success == 1){
          this.type_permit_list = response.data.data;


        }else{
          this.$notify({
            title: 'Error',
            message: response.data.message,
            type: 'error'
          });
        }

        this.fullscreenLoading = false;

      })
      .catch(error =>{
        this.fullscreenLoading = false;
        this.$notify({
            title: 'Error',
            message: 'Error al conectarse con el servidor, vuelva a intentarlo de nuevo',
            type: 'error'
          });
        console.log('request error => /rh/work-permits/type-permit-list',error);

      });

    },

    async getPermitConcepts(_id_type_permit){

      this.form_request_permit.permit_concept_id = null;
      this.form_request_permit.reason = "";
      this.form_request_permit.total_days = null;
      this.form_request_permit.start_date = null;
      this.form_request_permit.end_date = null;

      let temp_url='/rh/work-permits/permit-concept-list/'+_id_type_permit;
      await Api.get(temp_url)
      .then(response =>{
        let {data} = response;
        if(data.success == 1){
          this.permit_concept_list = data.data;
          this.attach_support_doc = [];

        }else{
          this.$notify({
            title: 'Error',
            message: response.data.message,
            type: 'error'
          });
        }

      })
      .catch(error =>{
        this.$notify({
            title: 'Error',
            message: 'Error al conectarse con el servidor, vuelva a intentarlo de nuevo',
            type: 'error'
          });
        console.log(`request error => ${temp_url}`,error);

      });

    },

    setReason(_permit_concept_id){

      let permit_concept = this.permit_concept_list.filter(concept =>{
        return concept.id == _permit_concept_id;
      })[0]

      console.log(permit_concept);

      this.attach_support_doc = permit_concept;

      this.form_request_permit.total_days = permit_concept.days;
      this.form_request_permit.end_date = moment(moment(this.form_request_permit.start_date).add(permit_concept.days,"days")).subtract(1,"days");
    },

    setStartDate(){
      let verify_day = new Date(this.form_request_permit.start_date);

      // Se verifica que sea un día habil de su jornada
      if(this.working_day.indexOf(verify_day.getDay()) != -1){

        // Día hábil de su jornada
        if(this.form_request_permit.permit_concept_id > 0){

          if(this.form_request_permit.permit_concept_id > 0){
            let permit_concept = this.permit_concept_list.filter(concept =>{
              return concept.id == this.form_request_permit.permit_concept_id;
            })[0];

            //this.form_request_permit.end_date = moment(moment(this.form_request_permit.start_date).add(permit_concept.days,"days")).subtract("1","days")
            this.generate_end_date();

          }else{
            this.form_request_permit.total_days = 0;
            this.form_request_permit.end_date = this.current_date;
          }

        }else{
          // Sin motivo seleccionado con dias establecidos
          this.form_request_permit.total_days = 0;
          this.form_request_permit.end_date = null;
        }

        let ths = this;
        this.valid_end_date = {disabledDate(time) {
              return time.getTime() < ths.form_request_permit.start_date;
            },
          }
      }else{
        // Día no hábil de su jornada
        this.form_request_permit.start_date = null;
        this.form_request_permit.end_date = null;
        this.$notify({
            title: 'Aviso',
            message: "Seleccione un día hábil de su horario de trabajo aprobado.",
            type: 'warning'
          });

      }

    },

    setEndDate(){

      let verify_day = new Date(this.form_request_permit.end_date);

      // Se verifica que sea un día habil de su jornada
      if(this.working_day.indexOf(verify_day.getDay()) != -1){
        if(this.form_request_permit.start_date <= this.form_request_permit.end_date){
          // Si las fechas son iguales, significa que solo es un día
            this.calculateDayAvailable();

        }else{
          this.form_request_permit.end_date = null;
          this.$notify({
              title: 'Aviso',
              message: "La Fecha final debe ser mayor que la Fecha inicial.",
              type: 'warning'
            });
        }
      }else{
        // Día no hábil de su jornada
        this.form_request_permit.end_date = null;
        this.$notify({
            title: 'Aviso',
            message: "Seleccione un día hábil de su horario de trabajo aprobado.",
            type: 'warning'
          });
      }


    },

    generate_end_date(){
      let total_day = this.form_request_permit.total_days;
      let temp_date = this.form_request_permit.start_date;

      if(total_day > 0 && this.form_request_permit.start_date != null){
        total_day = total_day-1;

        while(total_day > 0){
          temp_date = moment(temp_date).add(1,'days');
          if(this.working_day.indexOf(moment(temp_date).day()) != -1){
            total_day--;
          }

        }
        this.form_request_permit.end_date = temp_date;
      }

    },

    calculateDayAvailable(){
      let start_date = this.form_request_permit.start_date;
      let end_date = this.form_request_permit.end_date;
      let total_day=0;

      let temp_point_date = start_date;

      while(temp_point_date <= end_date){
        if(this.working_day.indexOf(moment(temp_point_date).day()) != -1){
          total_day++;
        }

        temp_point_date = moment(temp_point_date).add(1,'days');
      }

      // Se revisa si los dias calculados son menores o iguales a los días asignados para ese concepto
      if(this.form_request_permit.type_permit_id == 2){
          let ths = this;
          let permit_concept = this.permit_concept_list.filter(concept =>{
                                  return concept.id == ths.form_request_permit.permit_concept_id;
                                })[0]

        if(total_day <= permit_concept.days){
          this.form_request_permit.total_days = total_day;
          delete this.form_validate.end_date;
        }else{
          this.form_request_permit.total_days = null;
          this.form_request_permit.end_date = null
          this.form_validate.end_date =["La cantidad máxima para este motivo es de: "+permit_concept.days];
          this.$notify({
            title: 'Aviso',
            message: "Excediste la cantidad días permitidos para este motivo, selecciona otra fecha.",
            type: 'warning'
          });
          
        }
      }else{
        this.form_request_permit.total_days = total_day;
        delete this.form_validate.end_date;
      }

      
    },

    async saveRecord(){
      this.fullscreenLoading = true;

      let isValid = this.validateForm();

      if(isValid == true){
        let form_request = new FormData();
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };

        form_request.append('personal_id',this.form_request_permit.personal_id);
        form_request.append('personal_intelisis_usuario_ad',this.form_request_permit.personal_intelisis_usuario_ad);
        form_request.append('type_permit_id',this.form_request_permit.type_permit_id);
        if(this.form_request_permit.permit_concept_id != null){
          form_request.append('permit_concept_id',this.form_request_permit.permit_concept_id);
        }
        form_request.append('reason',this.form_request_permit.reason);
        form_request.append('start_date',moment(this.form_request_permit.start_date).format('YYYY-MM-DD'));
        form_request.append('end_date',moment(this.form_request_permit.end_date).format('YYYY-MM-DD'));
        form_request.append('total_days',this.form_request_permit.total_days);
        form_request.append('comments',this.form_request_permit.comments);

        if(this.attach_support_doc.minimun_documents > 0){
          this.$refs.files_attach_support.uploadFiles.forEach((doc,key) =>{
            form_request.append('attach_doc_'+key,doc.raw);
          })
          form_request.append('total_document_uploaded',this.$refs.files_attach_support.uploadFiles.length);
        }

        await Api.post("/rh/work-permits/work-permits-add",form_request,config)
        .then(response =>{
          if(response.data.success == 1){

            const formAut = new FormData()
            formAut.append('name_view', this.$route.name)
            formAut.append('comentarios', "Se creo nuevo permiso")
            formAut.append('id_afectado', response.data.data.id)
            formAut.append('evento', 'saveRecord()')

            this.$store.dispatch('auditoria/addEventAuditoria', formAut)

            this.$notify({
              title:"Excelente",
              message: "Registro realizado exitosamente.",
              type:"success",
            });
            this.$refs.viewWorkPermitComponent._tempCreated({
              "work_permit":response.data.data,
              "visible_modal":true,
              "permission_sign":true,
            });
            this.clearFormRequest();

          }else if(response.data.success == 2){
            this.$notify({
              title:"Aviso",
              message: response.data.message,
              type:"warning",
            });
          }else{
            this.$notify({
              title:"Aviso",
              message: response.data.message,
              type:"error",
            });
          }

          this.fullscreenLoading = false;

        })
        .catch(error =>{
          this.fullscreenLoading = false;
          console.log(error);
          if(error.response.status && error.response.status == 422){
            this.form_validate = error.response.data.errors

            this.$notify({
              title:"Aviso",
              message: "Los datos proporcionados no son válidos.",
              type:"error",
            });
          }else{
              //ths.alert('Error', 'A ocurrido un error, intente de nuevo', 'error');
              this.$notify({
                title:"Aviso",
                message: "A ocurrido un error, intente de nuevo",
                type:"error",
              });
          }
        });


      }else{
        this.fullscreenLoading = false;
        this.$notify({
              title:"Aviso",
              message: "Los datos proporcionados no son válidos.",
              type:"error",
            });
      }
    },

    validateForm(){
      let cont=0;

      if(this.form_request_permit.type_permit_id == 1){
        if(this.form_request_permit.reason.length == 0){
          cont++
          this.form_validate.reason = ["El campo motivo es obligatorio."]
        }else{
          delete this.form_validate.reason;
        }
        delete this.form_validate.type_permit_id;

      }else if(this.form_request_permit.type_permit_id > 1){
        if(this.form_request_permit.permit_concept_id > 0){
          delete this.form_validate.permit_concept_id;

        }else{
          cont++;
          this.form_validate.permit_concept_id =["El campo motivo es obligatorio."]
        }
        delete this.form_validate.type_permit_id;

      }else{
        cont++;
        this.form_validate.type_permit_id =["El campo tipo de permiso es obligatorio."]

      }

      if(this.form_request_permit.end_date >= this.form_request_permit.start_date){
         delete this.form_validate.end_date;
      }else{
        cont++;
        this.form_validate.end_date =["El campo fecha final es obligatorio."]
      }

      if(this.attach_support_doc.minimun_documents > 0){
        if(this.$refs.files_attach_support){
          if(this.$refs.files_attach_support.uploadFiles.length == this.attach_support_doc.minimun_documents){
            delete this.form_validate.minimun_documents;
          }else{
            cont++;
            this.form_validate.minimun_documents = ["Seleccione la cantidad mínima de documentos, es obligatorio."]
          }
        }else{
          cont++;
          this.form_validate.minimun_documents = ["Seleccione la cantidad mínima de documentos, es obligatorio."]
        }
      }

      if(cont > 0){
        return false;
      }else{
        return true
      }

    },

    headerSearch(_text){

      if(_text.length > 0){
          this.headers.isSearch = true;
          this.headers.text = _text;
      }else{
          this.headers.isSearch = false;
          this.headers.text = _text;
      }
      this.getList();
    },

    clearFormRequest(){

      this.form_request_permit={
        personal_id:null,
        personal_intelisis_usuario_ad:null,
        type_permit_id:null,
        permit_concept_id:null,
        reason:"",
        start_date:null,
        end_date:null,
        total_days:null,
        comments:"",
      };

      this.getUser();
    },
    workingDayAvailable(_personal_time){
      let ths = this;

      if(_personal_time != null){
        _personal_time.dmirh_personal_time_details.forEach(time =>{
            ths.working_day.push(time.week_day);
        })
      }

    },

    /* Archivos */
    handleChange(file,fileList) {
      this.beforeAvatarUpload(file,fileList);

    },
    beforeAvatarUpload(file,fileList){

        let extension = ['pdf'];
        let nameFile = file.name.split('.');
        // Se valida el peso
        if(((file.size/1024)/1024) < 5){
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
                  message:"El archivo supera el limite de 5 MB.",
                  type: 'warning'
                });
                fileList.pop()
        }
    },

    /* handleExceed(){
      this.$notify({
                title: 'Aviso',
                message:"Solo puede cargar "+this.attach_support_doc.minimun_documents+,
                type: 'warning'
              });
    }, */


  },
  filters:{
    date(_date){
      return moment(_date).format('DD-MM-YYYY');
    },
    working_day(_personal_time){
        if(_personal_time != null){
            if(_personal_time.dmirh_personal_time_details){
                let week_day = ['D','L','M','M','J','V','S','D'];
                let working_day_complete = "";

                _personal_time.dmirh_personal_time_details.forEach((time,key) =>{
                    working_day_complete += week_day[time.week_day];
                    if(_personal_time.dmirh_personal_time_details.length-1 != key ){
                        working_day_complete +=" - ";
                    }

                })

                return working_day_complete;
            }else{
                return "No se encontro jornada disponible";
            }

        }else{
            return "No se encontro jornada disponible";
        }
    }

  },
}
</script>

<style lang="scss" scoped>

</style>
