<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <h3>Solicitar Vacaciones</h3>
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
        <div v-if="has_requests == false">
          <md-content class="m-3">
            <el-row type="flex" class="mt-2 mb-3 section-title text-center">
                <el-col class="col-md-3 col-sm-12" >
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
                  <label>Jefe inmediato: </label>
                  <label class="label-disabled">{{general_data.immediate_boss | immediate_boss}}</label>
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
                  <h4>VACACIONES</h4>
              </el-col>
            </el-row>

            <el-row class="mt-2">
              <el-col class="col-md-4 col-sm-12">
                  <label>Fecha de ingreso: </label>
                  <label class="label-disabled">{{general_data.antiquity_date | date}}</label>
              </el-col>
              <el-col v-if="aviabled_periods.length > 1" class="col-md-4 col-sm-12">
                  <label>Periodos disponibles: </label>
                  <label class="label-disabled">{{form_request.period_selectd.current_period_year}}</label>
              </el-col>
              <el-col v-else class="col-md-4 col-sm-12">
                  <label>Periodo disponible: </label>
                  <label class="label-disabled">{{form_request.period_selectd.current_period_year}}</label>
              </el-col>
              <el-col class="col-md-4 col-sm-12">
                  <label>Días otorgados al año: </label>
                  <label class="label-disabled">{{form_request.period_selectd.vacation_days_law.days}} días</label>
              </el-col>
            </el-row>

            <el-row class="mt-2">
              <el-col class="col-md-4 col-sm-12">
                  <label>Dias disponibles <span class="input-required">*</span></label>
                  <el-input v-model="form_request.period_selectd.available_days" placeholder="Días disponibles" disabled></el-input>
              </el-col>
              <el-col class="col-sm-12 col-md-4">
                <label>Vacaciones <span class="input-required">*</span></label><br>
                <el-date-picker
                  v-model="form_request.date_range"
                  type="daterange"
                  align="right"
                  start-placeholder="Fecha inicio"
                  end-placeholder="Fecha término"
                  :default-value="current_date"
                  @change="setDates()"
                  :pickerOptions="valid_start_date">
                </el-date-picker>
                <span class="input-error" v-if="form_validate.date_range">{{form_validate.date_range[0]}}</span>
              </el-col>
              <el-col class="col-sm-12 col-md-4">
                <label>Dias otorgados <span class="input-required">*</span></label>
                <el-input v-model="form_request.total_days" placeholder="Días otorgados" disabled></el-input>
                <span class="input-error" v-if="form_validate.total_days">{{form_validate.total_days[0]}}</span>
              </el-col>
            </el-row>

            <br>
            <el-row class="mt-3" type="flex" justify="end">
              <el-col class="col-md-3 col-sm-12 text-center">

                  <el-button type="success" @click="saveRecord()">Solicitar</el-button>
              </el-col>
            </el-row>

          </md-content>
        </div>
        <div v-else>
          <md-content class="m-3">
            <el-row>
              <el-col class="col-md-12 col-sm-12" >
                <md-empty-state
                  md-rounded
                  md-icon="pan_tool"
                  md-label="Aviso"
                  md-description="Actualmente cuenta con un registro de vacaciones en proceso de autorización, espere a que termine o cancele la solicitud."
                />
              </el-col>
            </el-row>
          </md-content>
        </div>

      </div>


      <view_record ref="viewVacationComponent" @listenChildComponent="getList"></view_record>

    </el-card>


  </div>

</template>

<script>

import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import moment from 'moment'
import view_record from './viewRecord.vue'
import '@/styles/global_styles.css'

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
      fullscreenLoading:true,
      current_date: new Date(),
      form_request:{
        personal_id:null,
        personal_intelisis_usuario_ad:null,
        start_date:null,
        end_date:null,
        return_date:null,
        total_days:null,
        date_range:null,
        days_available: null,
        period_selectd:null,
      },
      list_holiday:[],
      form_validate:[],
      valid_start_date:null,
      working_day:[],
      has_requests:false,
      aviabled_periods:[],
      aux_return_date:""

    }
  },
  beforeMount() {
  },

  created() {

  },
  mounted(){
    this.checkRequestedVacation();
    this.getUser()
    this.getHolidays()
    this.getDataVacationDays()
    this.setValidStartDate();

  },

  methods: {
    async checkRequestedVacation(){
      this.fullscreenLoading= true;

      await Api.get('/rh/vacation/check-requested-vacation')
      .then(response =>{
        if(response.data.success == 1){
          this.has_requests = response.data.has_requests
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
        console.log('request error => /rh/vacation/check-requested-vacation',error);

      });
    },

    async getUser(){
      this.fullscreenLoading= true;

      await Api.get('/rh/personal-intelisis/profile')
      .then(response =>{
        if(response.data.success == 1){
          this.general_data = response.data.data;
          this.form_request.personal_intelisis_usuario_ad = this.general_data.usuario_ad;
          this.form_request.personal_id = this.general_data.personal_id;
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

    async getHolidays(){
      this.fullscreenLoading= true;

      await Api.get('/intelisis/get-holidays')
      .then(response =>{
        if(response.data.success == 1){

          response.data.data.forEach(date =>{
            this.list_holiday.push(moment(date.Fecha).format("YYYY-MM-DD"));
          })

          this.fullscreenLoading = false;

        }else{
          this.$notify({
            title: 'Aviso',
            message: response.data.message,
            type: 'warning'
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
        console.log('request error => /intelisis/get-holidays',error);

      });

    },

    async getDataVacationDays(){
      this.fullscreenLoading= true;

      await Api.get('/rh/vacation/get-data-vacation-days')
      .then(response =>{
        if(response.data.success == 1){
          this.aviabled_periods = response.data.data.available_periods;
          if(this.aviabled_periods.length > 1){
            //Dos periodos activos
          }else{
            //Solo un periodo activo
            this.form_request.period_selectd = this.aviabled_periods[0];

          }

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
        console.log('request error => /intelisis/get-holidays',error);

      });

    },

    setValidStartDate(){
      let temp_date = moment(moment(new Date()).subtract(6,'days'));

      this.valid_start_date = {disabledDate(time) {
            return time.getTime() < temp_date;
          },
        }
    },

    setDates(){
      if(this.working_day.length > 0){
        let days_granted = this.calculateDaysGranted();

        if(days_granted <= this.form_request.period_selectd.available_days){
          this.form_request.total_days = days_granted;
          this.form_request.return_date = this.getReturnDate(this.form_request.date_range[1]);
        }else{
          this.form_request.date_range = null;
          this.form_request.total_days = null;
          this.$notify({
              title: 'Error',
              message: 'Los días solicitados superan los días disponibles.',
              type: 'warning'
            });
        }
      }else{
        this.form_request.date_range = null;
        this.form_request.total_days = null;
        this.$notify({
            title: 'Error',
            message: 'No cuentas con una jornada laboral registrada.',
            type: 'warning'
          });
      }


    },
    workingDayAvailable(_personal_time){
      let ths = this;

      if(_personal_time != null){
        _personal_time.dmirh_personal_time_details.forEach(time =>{
            ths.working_day.push(time.week_day);
        })
      }

    },

    calculateDaysGranted(){
      let start_date = moment(this.form_request.date_range[0]).format('YYYY-MM-DD');
      let end_date = moment(this.form_request.date_range[1]).format('YYYY-MM-DD');

      let total_day=0;

      let temp_point_date = start_date;

      while(temp_point_date <= end_date){
        if(this.working_day.indexOf(moment(temp_point_date).day()) != -1 && this.list_holiday.indexOf(temp_point_date) == -1){
          total_day++;
        }

        temp_point_date = moment(temp_point_date).add(1,'days');
        temp_point_date = moment(temp_point_date).format('YYYY-MM-DD')
      }

      return total_day;
    },

    getReturnDate(_end_date){
      let total_days = 0;
      let isverificarListHoliday = false;

      let temp_point_date = _end_date;
      // Se calcula la fecha de regreso en base a su jornada
      do{
          temp_point_date = moment(temp_point_date).add(1,'days');
          if(this.working_day.indexOf(moment(temp_point_date).day()) != -1){
            total_days++;
          }

          temp_point_date = moment(temp_point_date).format('YYYY-MM-DD')
        }while(total_days < 1)

        isverificarListHoliday = this.verificarListHoliday(temp_point_date);
        if(isverificarListHoliday == false){
          this.aux_return_date = temp_point_date;
        }else{
          this.getReturnDate(temp_point_date);
        }
        return this.aux_return_date;

    },

    verificarListHoliday(_date){
      if(this.list_holiday.indexOf(_date) == -1){
        //No es dia festivo
        return false;
      }else{
        return true;
      }

    },

    async saveRecord(){
      this.fullscreenLoading = true;

      let isValid = this.validateForm();



      if(isValid == true){
        this.form_request.start_date = this.form_request.date_range[0];
        this.form_request.end_date = this.form_request.date_range[1];

        await Api.post("/rh/vacation/add",this.form_request)
        .then(response =>{
          if(response.data.success == 1){
            this.$notify({
              title:"Excelente",
              message: "Registro realizado exitosamente.",
              type:"success",
            });
            this.$refs.viewVacationComponent._tempCreated({
              "record_data":response.data.data,
              "visible_modal":true,
              "permission_sign":true,
              "type_event":"save"
            });
            this.clearFormRequest();

            const formAut = new FormData()
            formAut.append('name_view', this.$route.name)
            formAut.append('comentarios', "Se creo nuevo registro")
            formAut.append('id_afectado',response.data.data.id)
            formAut.append('evento', 'Vacaciones -> saveRecord()')

            this.$store.dispatch('auditoria/addEventAuditoria', formAut)

          }else if(response.data.success == 2){

            this.$notify({
              title:"Aviso",
              message: response.data.message,
              type:"warning",
            });

            this.has_requests = true;

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
          if(error.response.status && error.response.status == 422){
            this.form_validate = error.response.data.errors

            this.$notify({
              title:"Aviso",
              message: "Los datos proporcionados no son válidos.",
              type:"error",
            });

          }else{
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

    clearFormRequest(){

      this.form_request_permit={
        personal_id:null,
        personal_intelisis_id:null,
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

    validateForm(){
      let cont=0;

      if(this.form_request.date_range != null && this.form_request.date_range[0] != null){
          delete this.form_validate.date_range;
      }else{
        cont++;
        this.form_validate.date_range =["Complete las fechas de inicio y término."]
      }

      if(this.form_request.date_range != null && this.form_request.date_range[1]  != null){
          delete this.form_validate.date_range;
      }else{
        cont++;
        this.form_validate.date_range =["Complete las fechas de inicio y término."]
      }


      if(cont > 0){
        return false;
      }else{
        return true
      }

    },


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
    },
    immediate_boss(_immediate_boss){
        if(_immediate_boss != null){
          return _immediate_boss.name+" "+_immediate_boss.last_name;
        }else{
          return "Sin Jefe inmediato asignado.";
        }
    }

  },
}
</script>

<style lang="scss" scoped>

</style>
