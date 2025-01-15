<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <h3>Solicitar cambio de horario</h3>
      </div>

      <div v-if="fullscreenLoading == false">
        <div v-if="number_cancellations > 1">
          <md-content class="m-3">
            <el-row>
              <el-col class="col-md-12 col-sm-12" >
                <md-empty-state
                  md-rounded
                  md-icon="pan_tool"
                  md-label="Aviso"
                  md-description="Actualmente cuentas con solicitudes rechazadas en el mismo período, contacta a tu Coordinadora de RRHH para revisar el caso y establecer una jornada laboral."
                />
              </el-col>
            </el-row>
          </md-content>
        </div>
        <div v-else>
          <md-content v-if="Object.keys(work_schedule_pending).length > 0 && flag_update == false" class="m-3">
            <el-row class="card-info m-1 pt-2 pb-2">
                <el-col class="col-md-9 col-sm-12" >
                    <h4>Cambio solicitado</h4>
                </el-col>
                <el-col class="col-md-3 col-sm-12 text-center">
                  <el-button type="danger" @click="alertCancelWorkSchedule()"><i class="el-icon-close"></i> Cancelar</el-button>
                  <el-button v-if="work_schedule_pending.edit == 1" type="primary" @click="updateWorkSchedule()"><i class="el-icon-edit"></i> Editar</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="col-md-3 col-sm-12">
                    <label>Fecha de solicitud: </label>
                    <label class="label-disabled">{{work_schedule_pending.created_at | date_large}}</label>
                </el-col>
                <el-col class="col-md-3 col-sm-12">
                    <label>Estatus: </label>
                    <label class="label-disabled">{{work_schedule_pending.dmirh_cat_time_status.description}}</label>
                </el-col>
                <el-col class="col-md-3 col-sm-12">
                    <label>Número de rechazos: </label>
                    <label class="label-disabled">{{work_schedule_pending.number_cancellations}}</label>
                </el-col>
            </el-row>
            <el-row class="mb-3">
                <el-col class="col-md-12 col-sm-12">
                    <label>Situación especial: </label>
                    <label class="label-disabled">{{work_schedule_pending.special_situation}}</label>
                </el-col>
            </el-row>
            <el-row>
                <el-col class="col-md-12 col-sm-12">
                  <el-col v-for="day in work_schedule_pending.dmirh_personal_time_details" :sm="24" :md="3" style="margin-right:10px;">
                    <el-card class="box-card">
                      <div slot="header" class="clearfix text-center">
                        <span><strong>{{days[day.week_day]}}</strong></span>
                      </div>
                      <div class="m-1">
                        <el-row>
                          <label>Entrada</label><br>
                          <label class="label-disabled">{{day.entry_hour | formatDoceHours}}</label>
                        </el-row>
                        <el-row>
                          <label for="">Salida a comida</label><br>
                          <label class="label-disabled">{{day.exit_food_hour | formatDoceHours}}</label>
                        </el-row>
                        <el-row>
                          <label for="">Entrada de comida</label><br>
                          <label class="label-disabled">{{day.entry_food_hour | formatDoceHours}}</label>
                        </el-row>
                        <el-row>
                          <label for="">Salida</label><br>
                          <label class="label-disabled">{{day.exit_hour | formatDoceHours}}</label>
                        </el-row> 
                      </div>
                    </el-card>
                  </el-col>
                </el-col>
            </el-row>
          </md-content>

          <div v-else>
            <md-content class="m-3">
              <el-row type="flex" class="mt-2 mb-3 section-title text-start">
                  <el-col class="col-md-8 col-sm-12" >
                      <h4>Jornada</h4>
                  </el-col>
              </el-row>
              <el-row type="flex" class="mt-2 mb-3">
                <el-col class="col-md-3 col-sm-12"><label>Seleccione los días a laborar: </label></el-col>
                <el-col class="col-md-7 col-sm-12">
                  <el-checkbox-group v-model="selected_day">
                    <el-checkbox-button v-for="(day,key) in days_week" :label="key" :key="title">{{day.title}}</el-checkbox-button>
                  </el-checkbox-group>
                  <label v-if="validate_work_schedule.selected_day != null" class="small text-danger">{{ validate_work_schedule.selected_day }}</label>
                </el-col>
                
              </el-row>
              <el-row type="flex" class="mt-2 mb-3">
                <el-col class="col-md-3 col-sm-12"><label>Situación especial <span class="text-primary small">(opcional)</span>: </label></el-col>
                <el-col class="col-md-9 col-sm-12">
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="En caso de contar con una situación especial en el horarioa soliciar"
                    v-model="special_situation">
                  </el-input>

                </el-col>
                
              </el-row>
            </md-content>

            <md-content class="m-3">
              <el-row type="flex" class="mt-2 mb-3 section-title text-start">
                  <el-col class="col-md-3 col-sm-12" >
                      <h4>Horarios </h4>
                  </el-col>
              </el-row>

              <el-row type="flex" class="justify-content-center">
                  <el-col class="col-md-6 col-sm-12 text-center" >
                    <label v-if="validate_work_schedule.timetables_day != null" class="text-danger">{{ validate_work_schedule.timetables_day }}</label>
                  </el-col>
              </el-row>

              <el-row type="flex" class="justify-content-center">
                
                <el-col v-for="day in selected_day" class="text-center" :sm="24" :md="3" style="margin-right:10px;">
                  <el-card class="box-card">
                    <div slot="header" class="clearfix text-center">
                      <span><strong>{{ days_week[day].title }}</strong></span>
                    </div>
                    <div class="m-1">
                      <el-row>
                        <label for="">Entrada</label>
                      </el-row>
                      <el-row>
                        <el-select v-model="days_week[day].work_schedule.entry_work" placeholder="Hora" @change="validateSelectHours(day)">
                          <el-option v-for="item in HoursEntrance" :key="item.id" :label="item.description" :value="item.hour">
                          </el-option>
                        </el-select>
                        <label v-if="days_week[day].validate.entry_work != null" class="small text-danger">{{ days_week[day].validate.entry_work }}</label>
                      </el-row>

                      <el-row class="mt-2">
                        <label for="">Salida a Comida</label>
                      </el-row>
                      <el-row>
                        <el-select v-model="days_week[day].work_schedule.exit_lunchtime" @change="validateSelectHours(day,'exit')" placeholder="Hora">
                          <el-option v-for="item in HoursFood" :key="item.id" :label="item.description" :value="item.hour">
                          </el-option>
                        </el-select>
                        <label v-if="days_week[day].validate.exit_lunchtime != null" class="small text-danger">{{ days_week[day].validate.exit_lunchtime }}</label>
                      </el-row>

                      <el-row class="mt-2">
                        <label for="">Entrada a Comida</label>
                      </el-row>
                      <el-row>
                        <el-select v-model="days_week[day].work_schedule.entry_lunchtime" @change="validateSelectHours(day,'entry')" placeholder="Hora">
                          <el-option v-for="item in HoursEntryFood" :key="item.id" :label="item.description" :value="item.hour">
                          </el-option>
                        </el-select>
                        <label v-if="days_week[day].validate.entry_lunchtime != null" class="small text-danger">{{ days_week[day].validate.entry_lunchtime }}</label>
                      </el-row>

                      <el-row class="mt-2">
                        <label for="">Salida</label>
                      </el-row>
                      <el-row >
                        <label placeholder="Hora" class="el-input__inner text-left" style="background:#F5F7FA!important;font-size: 14px;">{{ days_week[day].work_schedule.exit_work | formatDoceHours}}</label>
                      </el-row>               
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              
            </md-content>
            <hr>
            <md-content>
              <el-row class="m-3">
                <el-col class="offset-md-9 col-md-3 col-sm-12 text-center">
                  <el-button v-if="flag_update == false" type="success" @click="saveWorkSchedule()">Guardar</el-button>
                  <el-button v-if="flag_update == true" type="success" @click="saveWorkSchedulePending()"><el-icon class="el-icon-refresh"></el-icon> Actualizar</el-button>
                </el-col>
              </el-row>
            </md-content>
            
          </div>
        </div>
        
      </div>

      <div v-else class="text-center">
        <br>
        <br>
        <br>
        <md-progress-spinner :md-stroke="2" :md-diameter="40" md-mode="indeterminate"></md-progress-spinner>
        <br>
        <br>
        <br>
      </div>
      


    </el-card>

  </div>

</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import moment from 'moment'
import '@/styles/global_styles.css'
import Swal from 'sweetalert2'

export default {
  components: {
  },
  data() {
    return {
      vLunes: false,
      vMartes: false,
      vMiércoles: false,
      vJueves: false,
      vViernes: false,
      vSabado: false,
      vDomingo: false,
      btnloading: false,
      days:["",'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabádo', 'Domingo'],
      days_week:[
        {personal_time_details_id:null, day_id:1, title:'Lunes',    work_schedule:{},hours_day:0,validate:{},action:null},
        {personal_time_details_id:null, day_id:2, title:'Martes',   work_schedule:{},hours_day:0,validate:{},action:null},
        {personal_time_details_id:null, day_id:3, title:'Miércoles',work_schedule:{},hours_day:0,validate:{},action:null},
        {personal_time_details_id:null, day_id:4, title:'Jueves',   work_schedule:{},hours_day:0,validate:{},action:null},
        {personal_time_details_id:null, day_id:5, title:'Viernes',  work_schedule:{},hours_day:0,validate:{},action:null},
        {personal_time_details_id:null, day_id:6, title:'Sábado',   work_schedule:{},hours_day:0,validate:{},action:null},
        {personal_time_details_id:null, day_id:7, title:'Domingo',  work_schedule:{},hours_day:0,validate:{},action:null},
      ],
      special_situation:"",
      selected_day:[],
      validate_work_schedule:{
        selected_day:null,
        timetables_day:null,
      },
      work_schedule_pending:[],
      flag_update:false,
      fullscreenLoading:false,
      number_cancellations:0,
      
      

    }
  },
  computed: {
    HoursEntrance() {
      return this.$store.getters.HoursEntrance
    },
    HoursFood() {
      return this.$store.getters.HoursFood
    },
    HoursEntryFood() {
      return this.$store.getters.HoursEntryFood
    },
  },  
  async beforeMount() {

  },
  async created() {
    this.fullscreenLoading= true;
    this.checkValidateRejectedQuantity();
    try {
      this.$store.dispatch('getHourEntrance')
      this.$store.dispatch('getHourFood')
      this.$store.dispatch('getHourEntryFood')
      this.$store.dispatch('getHorarioPendiente')
                  .then(response =>{
                    if(response.success == 1){
                      this.displaySchedulePending(response.data);
                    }
                    this.fullscreenLoading= false;
                    
                  });
    } catch (error) {
      console.error(error)
      this.fullscreenLoading= false;
    }

    
  },

  methods: {

    // Se validan las hora seleccionadas, para que no queden vacias
    validateSelectHours(_day,_input = null){
      if(this.days_week[_day].work_schedule.entry_work){
        this.days_week[_day].validate.entry_work = null;

        if(this.days_week[_day].work_schedule.exit_lunchtime){
          this.days_week[_day].validate.exit_lunchtime = null;

          if(this.days_week[_day].work_schedule.entry_lunchtime){
            
            if(this.days_week[_day].work_schedule.exit_lunchtime != this.days_week[_day].work_schedule.entry_lunchtime){
              let exit_lunchtime = moment(this.days_week[_day].work_schedule.exit_lunchtime, 'HH:mm');
              let entry_lunchtime = moment(this.days_week[_day].work_schedule.entry_lunchtime, 'HH:mm');

              // Se comparan que la hora de salir a comer, sea menor que la hora de entrada
              if(entry_lunchtime.isAfter(exit_lunchtime)){
                this.days_week[_day].validate.entry_lunchtime = null;

                // Calcular que sea una 1 o 2 horas
                if(this.calculateNumberHoursLunchtime(exit_lunchtime,entry_lunchtime)){
                  // Se calcula la hora de salida de la jornada
                  this.calculateWorkingHours(_day);
                  return true;
                }else{
                  if(_input == 'exit'){
                    this.days_week[_day].validate.exit_lunchtime="Solo puede ser 1 o 2 horas de comida";
                    return false;
                  }else{
                    this.days_week[_day].validate.entry_lunchtime="Solo puede ser 1 o 2 horas de comida";
                    return false;
                  }
                }

              }else{
                if(_input != null){
                  if(_input == 'exit'){
                    this.days_week[_day].validate.exit_lunchtime="Debe ser menor que la entrada a comer";
                    return false;
                  }else{
                    this.days_week[_day].validate.entry_lunchtime="Debe ser mayor que la salida a comer";
                    return false;
                  }
                }
                
              }
              
            }else{
              this.days_week[_day].validate.entry_lunchtime="Seleccione horario diferente";
              return false;
            }

          }else{
            this.days_week[_day].validate.entry_lunchtime="Seleccione una hora";
            return false;
          }

        }else{
          this.days_week[_day].validate.exit_lunchtime="Seleccione una hora";
          return false;
        }
      }else{
        this.validate_work_schedule.timetables_day = "Complete los horarios de los días seleccionados";
        return false;
      }
      
    },

    calculateNumberHoursLunchtime(_exit_lunchtime,_entry_lunchtime){
      // Define las dos horas

      // Calcula la diferencia y crea un objeto duration
      let duracion = moment.duration((moment(_entry_lunchtime, 'HH:mm')).diff(moment(_exit_lunchtime, 'HH:mm')));

      // Obtiene la diferencia en horas y minutos
      let horas = Math.floor(duracion.asHours());
      let minutos = duracion.minutes();

      if((horas == 1 || horas == 2) && (minutos == 0 )){
        return true;
      }else{
        return false;
      }
      
    },

    calculateWorkingHours(_day){
      // Se termina de calcular la hora de salida de una jornada normal
  
      let timetables_day = this.days_week[_day].work_schedule;

      let entry_work = moment(timetables_day.entry_work, 'HH:mm');
      let exit_lunchtime = moment(timetables_day.exit_lunchtime, 'HH:mm');

      let duracion = moment.duration(exit_lunchtime.diff(entry_work)).asHours();
      
      let complete_hour = 8;
      let hours_left = complete_hour - duracion;
      let exit_work = moment(timetables_day.entry_lunchtime,'HH:mm').add(hours_left,'hours').format('HH:mm');
      this.days_week[_day].work_schedule.exit_work = exit_work; 
    },

    validateWorkSchedule(){
      // Se valida que tenga jornada seleccionada
      if(this.selected_day.length > 0){
        let flag_correct_day = 0;
        this.validate_work_schedule.selected_day = null;

        this.selected_day.forEach(day =>{
          this.validateSelectHours(day) == false ? flag_correct_day++ : null;
        });
        return flag_correct_day == 0;

      }else{
        this.validate_work_schedule.selected_day = "Seleccione uno o más días";
      }

    },

    async saveWorkSchedule(){
      if(this.validateWorkSchedule()){

        this.fullscreenLoading= true;
        this.calculateHoursPerWeek();

        await Api.post("/controlAsistencia/addCambioHorarioPersonal",{
          selected_day:this.selected_day,
          days_week:this.days_week,
          special_situation:this.special_situation,
        })
        .then(response =>{

          if(response.data.success == 1){
            this.$notify({
              title:"Excelente",
              message: "Registro realizado exitosamente.",
              type:"success",
            });
          
            const formAut = new FormData()
            formAut.append('name_view', this.$route.name)
            formAut.append('comentarios', "Solicitud de cambio de horario con Detalle: "+JSON.stringify({"selected_day":this.selected_day,"days_week":this.days_week,"special_situation":this.special_situation}))
            formAut.append('id_afectado',response.data.data.id)
            formAut.append('evento', 'Solicitud Cambio de Horario -> saveWorkSchedule()')

            this.$store.dispatch('auditoria/addEventAuditoria', formAut)

            this.reloadPage();

          }else{
            this.$notify({
              title:"Aviso",
              message: "Ha ocurrido un error, intente de nuevo",
              type:"error",
            });
          }

          this.fullscreenLoading = false;

        })
        .catch(error =>{
          this.fullscreenLoading = false;
          this.$notify({
                title:"Aviso",
                message: "Ha ocurrido un error, intente de nuevo",
                type:"error",
              });
        });

      }else{
        console.log("No guardar datos");
      }
    },

    updateWorkSchedule(){
      this.flag_update = true;
      let ths = this;

      this.resetVariables();

      this.work_schedule_pending.dmirh_personal_time_details.forEach(registered_day =>{

        ths.days_week.forEach((set_day,key) =>{

          if(set_day.day_id == registered_day.week_day){
            set_day.work_schedule = {
              entry_work: registered_day.entry_hour,
              exit_lunchtime: registered_day.exit_food_hour,
              entry_lunchtime: registered_day.entry_food_hour,
              exit_work: registered_day.exit_hour,
            };
            set_day.validate = {};
            set_day.personal_time_details_id = registered_day.id;
            ths.selected_day.push(key);
          }
        });
      });

      this.special_situation = this.work_schedule_pending.special_situation;

    },

    async saveWorkSchedulePending(){
      if(this.validateWorkSchedule()){
        
        this.fullscreenLoading= true;
        
        this.actionUpdate();
        this.calculateHoursPerWeek();

        await Api.post("/controlAsistencia/updateCambioHorarioPersonal",{
          personal_time_id: this.work_schedule_pending.id,
          days_week:this.days_week,
          special_situation:this.special_situation,
        })
        .then(response =>{
          if(response.data.success == 1){
            this.$notify({
              title:"Excelente",
              message: "Registro actualizado exitosamente.",
              type:"success",
            });
          
            const formAut = new FormData()
            formAut.append('name_view', this.$route.name)
            formAut.append('comentarios', "Solicitud de cambio de horario con Detalle: "+JSON.stringify({"selected_day":this.selected_day,"days_week":this.days_week,"special_situation":this.special_situation}))
            formAut.append('id_afectado',response.data.data.id)
            formAut.append('evento', 'Actualización Cambio de Horario -> saveWorkSchedulePending()')

            this.$store.dispatch('auditoria/addEventAuditoria', formAut)

            this.reloadPage();

          }else{
            this.$notify({
              title:"Aviso",
              message: "Ha ocurrido un error, intente de nuevo",
              type:"error",
            });
          }

          this.fullscreenLoading = false;

        })
        .catch(error =>{
          this.fullscreenLoading = false;
          this.$notify({
                title:"Aviso",
                message: "Ha ocurrido un error, intente de nuevo",
                type:"error",
              });
        });

      }else{
      }
    },

    alertCancelWorkSchedule(){

      Swal.fire({
        title: 'Estas seguro que desea cancelar el registro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cancelar!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.cancelWorkSchedule();
        }
      })

      
    },
    async cancelWorkSchedule(){

      await Api.post("/controlAsistencia/cancelCambioHorarioPersonal",{
        personal_time_id: this.work_schedule_pending.id,
      })
      .then(response =>{
        if(response.data.success == 1){
          this.$notify({
            title:"Excelente",
            message: "Registro cancelado exitosamente.",
            type:"success",
          });
        
          const formAut = new FormData()
          formAut.append('name_view', this.$route.name)
          formAut.append('comentarios', "Solicitud de cambio de horario con Detalle: "+JSON.stringify({"selected_day":this.selected_day,"days_week":this.days_week,"special_situation":this.special_situation}))
          formAut.append('id_afectado',this.work_schedule_pending.id)
          formAut.append('evento', 'Cancaleción Cambio de Horario -> cancelWorkSchedule()')

          this.$store.dispatch('auditoria/addEventAuditoria', formAut)

          this.reloadPage();

        }else{
          this.$notify({
            title:"Aviso",
            message: "Ha ocurrido un error, intente de nuevo",
            type:"error",
          });
        }

        this.fullscreenLoading = false;

      })
      .catch(error =>{
        this.fullscreenLoading = false;
        this.$notify({
              title:"Aviso",
              message: "Ha ocurrido un error, intente de nuevo",
              type:"error",
            });
      });

      
    },

    displaySchedulePending(_schedule_pending){

      if(_schedule_pending != null){
        this.work_schedule_pending = _schedule_pending;
      }
    },

    actionUpdate(){
      let ths = this;
      this.days_week.forEach(day =>{
        
        let cont = 0
        ths.selected_day.forEach(selected =>{
          if(day.day_id == (selected+1)){
            cont++;
          }
        })

        if(cont > 0){
          if(day.personal_time_details_id == null){
            if(Object.keys(day.work_schedule).length === 0 && day.work_schedule.constructor === Object){
              day.action = null;
            }else{
              day.action = 'new';
            }
          }else{
            day.action = "update";
          }

        }else{

          if(Object.keys(day.work_schedule).length === 0 && day.work_schedule.constructor === Object){
            day.action = null
          }else{
            if(day.personal_time_details_id == null){
              day.action = null;
            }else{
              day.action = "delete";
            }
            
          }
          ;
        }
      })

    },

    resetVariables(){
      this.days_week= [
        {personal_time_details_id:null, day_id:1, title:'Lunes',work_schedule:{},validate:{},action:null},
        {personal_time_details_id:null, day_id:2, title:'Martes',work_schedule:{},validate:{},action:null},
        {personal_time_details_id:null, day_id:3, title:'Miércoles',work_schedule:{},validate:{},action:null},
        {personal_time_details_id:null, day_id:4, title:'Jueves',work_schedule:{},validate:{},action:null},
        {personal_time_details_id:null, day_id:5, title:'Viernes',work_schedule:{},validate:{},action:null},
        {personal_time_details_id:null, day_id:6, title:'Sábado',work_schedule:{},validate:{},action:null},
        {personal_time_details_id:null, day_id:7, title:'Domingo',work_schedule:{},validate:{},action:null},
      ];

      this.selected_day=[];
      this.special_situation="";
    },

    reloadPage(){
      let view = this.$route;
      this.$store.dispatch('tagsView/delCachedView', view).then(() => {
          const {
              fullPath
          } = view
          this.$nextTick(() => {
              this.$router.replace({
                  path: '/redirect' + fullPath
              })
          })
      })
    },

    async checkValidateRejectedQuantity(){
      this.fullscreenLoading= true;

      await Api.get('/controlAsistencia/validate-rejected-quantity')
      .then(response =>{
        if(response.data.success == 1){
          this.number_cancellations = response.data.number_cancellations
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
        console.log('request error => /controlAsistencia/validate-rejected-quantity',error);

      });
    },

    calculateHoursPerWeek(){
      // Se valida que tenga jornada seleccionada
      if(this.selected_day.length > 0){
        this.validate_work_schedule.selected_day = null;

        this.selected_day.forEach(day =>{
          let work_schedule = this.days_week[day].work_schedule;

          let entry_work = moment(work_schedule.entry_work, 'HH:mm');
          let exit_lunchtime = moment(work_schedule.exit_lunchtime, 'HH:mm');
          let first_hours = moment.duration(exit_lunchtime.diff(entry_work)).asHours();

          let entry_lunchtime = moment(work_schedule.entry_lunchtime, 'HH:mm');
          let exit_work = moment(work_schedule.exit_work, 'HH:mm');
          let last_hours = moment.duration(exit_work.diff(entry_lunchtime)).asHours();
          
          this.days_week[day].hours_day = first_hours+last_hours;
        });

      }
    }
    
  },
  filters:{
    formatDoceHours(_time){
      return _time != null ? moment(_time,'HH:mm').format('hh:mm a') : 'Hora';
    },
    date_large(_date){
        //let date = (moment(_date).format('YYYY-MM-DD'));
        return (moment(_date).format('DD-MMM-YYYY')).toLocaleUpperCase();
    },
  }
}
</script>

<style scoped>
</style>
