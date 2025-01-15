<template>
  <div>
    <el-dialog
        title="Firma Digital - Pre-vista"
        :visible.sync="visible_modal"
        width="80%">

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
                      <h5>DATOS GENERALES</h5>
                  </el-col>
              </el-row>
              <el-row class="mt-1" >
                  <el-col class="col-md-4 col-sm-12">
                      <label>No. Empleado: </label>
                      <label class="label-disabled">{{user_personal_intelisis.personal_id}}</label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12">
                      <label>Fecha de solicitud: </label>
                      <label class="label-disabled">{{record_data.date_request | date}}</label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12">
                      <label>Jefe inmediato: </label>
                      <label class="label-disabled">{{user_personal_intelisis.immediate_boss | immediate_boss}}</label>
                  </el-col>

              </el-row>
              <el-row class="mt-1">
                  <el-col class="col-md-4 col-sm-12">
                      <label>Nombre: </label>
                      <label class="label-disabled">{{user_personal_intelisis.name}} {{user_personal_intelisis.last_name}}</label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12">
                      <label>Puesto: </label>
                      <label class="label-disabled">{{user_personal_intelisis.position_company_full}}</label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12">
                      <label>Jornada: </label>
                      <label class="label-disabled">{{user_personal_intelisis.dmirh_personal_time | working_day }}</label>
                  </el-col>

              </el-row>
              <el-row class="mt-1">
                  <el-col class="col-md-4 col-sm-12">
                      <label>Razón social: </label>
                      <label class="label-disabled">{{user_personal_intelisis.company_name}}</label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12">
                      <label>Ubicación: </label>
                      <label class="label-disabled">{{user_personal_intelisis.location}}</label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12">
                      <label>Departamento: </label>
                      <label class="label-disabled">{{user_personal_intelisis.deparment}}</label>
                  </el-col>
              </el-row>

            </md-content>

            <md-content class="m-3">
              <el-row type="flex" class="mt-2 mb-3 section-title text-center">
                  <el-col lass="col-md-12 col-sm-12" >
                      <h5>VACACIONES (<span class="digital-sign">{{record_data.status}}</span>)</h5>
                  </el-col>
              </el-row>
              <el-row class="mt-1 text-center">
                  <el-col class="col-md-12 col-sm-12 ">
                      <el-divider content-position="center">
                          <label class="folio">Folio:&nbsp;</label>
                          <label class="label-disabled folio label-bold">{{record_data.id}}</label>
                      </el-divider>
                  </el-col>
              </el-row>
              <el-row  class="mt-1 " >
                  <el-col class="col-md-12 col-sm-12 text-center">
                      <label>
                          Por medio de la presente, solicito se me autorice tomar <label class="label-bold">{{record_data.total_days}}</label>  {{ record_data.total_days == 1 ? 'día' : 'días' }} de mi periodo vacacional, el cual laboré<br>
                          del <label class="label-bold">{{record_data | filter_period_date}}</label> y que pretendo disfrutar del <label class="label-bold">{{record_data.start_date}} al {{record_data.end_date}}</label>, presentándome a
                          laborar el día <label class="label-bold">{{record_data.return_date}}</label>.
                      </label>
                  </el-col>
              </el-row>
              <el-row type="flex" class="mt-1 text-center">
                  <el-col class="col-md-6 col-sm-12">
                      <label>Periodo correspondiente: </label>
                      <label class="label-disabled">{{record_data.period}}</label>
                      <label v-if="record_data.type_period != 'actual'" class="label-disabled label-bold status-cancelado">({{record_data.type_period}})</label>

                  </el-col>
                  <el-col class="col-md-6 col-sm-12">
                      <label>Días otorgados al año: </label>
                      <label class="label-disabled">{{period_selected.vacation_days_law.days}}</label>
                  </el-col>
              </el-row>
              <el-row class="mt-1">
                  <el-col class="col-md-4 col-sm-12 text-right">
                      <label>Saldo inicial: </label>
                      <label class="label-disabled">{{(period_selected.available_days)}}</label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12 text-center">
                      <label>Solicitados: </label>
                      <label class="label-disabled">{{record_data.total_days}}</label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12 text-left">
                      <label>Saldo final: </label>
                      <label class="label-disabled">{{(period_selected.available_days)-record_data.total_days}}</label>
                  </el-col>
              </el-row>
            </md-content>

            <md-content class="m-3">
              <el-row type="flex" class="mt-2 mb-3 section-title text-center">
                  <el-col lass="col-md-3 col-sm-12" >
                      <h5>AUTORIZACIONES</h5>
                  </el-col>
              </el-row>
              <br>
              <el-row class="mt-1">
                  <el-col class="col-md-6 col-sm-12 text-center">
                      <div v-if="sign_employee != null">
                          <div v-if="sign_employee.status == 'pendiente' && sign_employee.signed_date == null">
                              <span v-if="sign_employee.personal_intelisis.usuario_ad == personal_intelisis_usuario_ad" class="handwritten-preview-sign">{{sign_employee.personal_intelisis.name}} {{sign_employee.personal_intelisis.last_name}} </span><br>
                          </div>
                          <div v-if="sign_employee.signed_date != null && sign_employee.status != 'cancelado' ">
                              <span class="handwritten-sign">{{sign_employee.personal_intelisis.name}} {{sign_employee.personal_intelisis.last_name}}</span><br>
                              <span class="digital-sign">Estatus - {{sign_employee.status}}</span><br>
                              <span class="digital-sign">Firma digital - {{sign_employee.signed_date | date_unix}}</span><br>
                              <span class="digital-sign">{{sign_employee.signed_date | date_time}} </span>
                          </div>
                          <br>
                          <span class="title-sign">{{sign_employee.personal_intelisis.name}} {{sign_employee.personal_intelisis.last_name}} </span><br>
                          <span class="title-sign">{{sign_employee.personal_intelisis.position_company_full}}</span><br>
                          <hr>
                          <span>FIRMA DEL EMPLEADO</span>
                          <br>
                          <br>
                      </div>

                  </el-col>

                  <el-col class="col-md-6 col-sm-12 text-center">
                      <div v-if="sign_immediate_boss != null">
                          <div v-if="sign_immediate_boss.status == 'pendiente' && sign_immediate_boss.signed_date == null">
                              <span v-if="sign_immediate_boss.personal_intelisis.usuario_ad == personal_intelisis_usuario_ad" class="handwritten-preview-sign">{{sign_immediate_boss.personal_intelisis.name}} {{sign_immediate_boss.personal_intelisis.last_name}} </span><br>
                          </div>
                          <div v-if="sign_immediate_boss.signed_date != null && sign_immediate_boss.status != 'cancelado'">
                              <span v-if="record_data.sign_behalf && record_data.sign_behalf.origin_table == 'control_signatures_behalves'">Se cuenta con firma autógrafa <br> Firma por delegación<br><br> {{record_data.sign_behalf.personal_intelisis.name}} {{record_data.sign_behalf.personal_intelisis.last_name}}</span>
                              <span v-else-if="record_data.sign_behalf && record_data.sign_behalf.origin_table == 'control_plaza_substitution'">Firma por Delegación de Permisos<br><br> {{record_data.sign_behalf.personal_intelisis.name}} {{record_data.sign_behalf.personal_intelisis.last_name}}</span>
                              <span v-else class="handwritten-sign">{{sign_immediate_boss.personal_intelisis.name}} {{sign_immediate_boss.personal_intelisis.last_name}}</span><br>
                              <span class="digital-sign">Estatus - {{sign_immediate_boss.status}}</span><br>
                              <span class="digital-sign">Firma digital - {{sign_immediate_boss.signed_date | date_unix}}</span><br>
                              <span class="digital-sign">{{sign_immediate_boss.signed_date | date_time}} </span><br>

                          </div>
                          <br>
                          <span class="title-sign">{{sign_immediate_boss.personal_intelisis.name}} {{sign_immediate_boss.personal_intelisis.last_name}} </span><br>
                          <span class="title-sign">{{sign_immediate_boss.personal_intelisis.position_company_full}}</span>
                          <hr>
                          <span>JEFE INMEDIATO</span>
                          <br>
                          <br>
                      </div>
                  </el-col>
              </el-row>

              <el-divider></el-divider>

              <el-row class="mt-1">
                  <el-col class="col-md-6 col-sm-12 text-center">
                      <div v-if="sign_rrhh != null">
                          <!-- <div v-if="sign_rrhh.status == 'pendiente' && sign_rrhh.signed_date == null">
                              <span v-if="sign_rrhh.personal_intelisis.usuario_ad == personal_intelisis_usuario_ad" class="handwritten-preview-sign">{{sign_rrhh.personal_intelisis.name}} {{sign_rrhh.personal_intelisis.last_name}} </span><br>
                          </div>
                          <div v-if="sign_rrhh.signed_date != null && sign_rrhh.status != 'cancelado'">
                              <span class="handwritten-sign">{{sign_rrhh.personal_intelisis.name}} {{sign_rrhh.personal_intelisis.last_name}}</span><br>
                              <span class="digital-sign">Estatus - {{sign_rrhh.status}}</span><br>
                              <span class="digital-sign">Firma digital - {{sign_rrhh.signed_date | date_unix}}</span><br>
                              <span class="digital-sign">{{sign_rrhh.signed_date | date_time}} </span>
                          </div> -->
                          <br>
                          <br>
                          <br>
                          <span class="title-sign">{{sign_rrhh.personal_intelisis.name}} {{sign_rrhh.personal_intelisis.last_name}} </span><br>
                          <span class="title-sign">{{sign_rrhh.personal_intelisis.position_company_full}}</span>
                          <hr>
                          <span>RRHH</span>
                          <br>
                          <br>
                      </div>

                  </el-col>
              </el-row>
            </md-content>
            <hr>
            <md-content class="mt-5">
                <el-row class="mt-1" type="flex" justify="end">
                  <el-col class="col-md-3 col-sm-12" v-if="sign_immediate_boss.status == 'pendiente' && permit_to_sign_behalf == true">
                        <el-button v-if="sign_immediate_boss.status == 'pendiente' && permit_to_sign_behalf == true" type="danger" @click="signOnBehalfDocument(false)">Rechazar Jefe Inmediato</el-button>
                  </el-col>
                  <el-col class="col-md-3 col-sm-12" v-if="sign_immediate_boss.status == 'pendiente' && permit_to_sign_behalf == true">
                        <el-button v-if="sign_immediate_boss.status == 'pendiente' && permit_to_sign_behalf == true" type="primary"  @click="signOnBehalfDocument(true)">Firmar Jefe Inmediato</el-button>
                  </el-col>
                  <el-col v-if="sign_pending.personal_intelisis_usuario_ad == personal_intelisis_usuario_ad && sign_pending.status == 'pendiente'" class="col-md-2 col-sm-12">
                      <el-button v-if="permission_sign && user_signed == false" type="danger" :disabled="btnDisabledSignFirmar" @click="signDocument(false)">Rechaza</el-button>
                  </el-col>
                  <el-col class="col-md-2 col-sm-12" v-if="sign_pending.personal_intelisis_usuario_ad == personal_intelisis_usuario_ad && sign_pending.status == 'pendiente'">
                      <el-button v-if="permission_sign && user_signed == false" type="primary" :disabled="btnDisabledSignFirmar" @click="signDocument(true)">Firmar</el-button>
                  </el-col>
                  <el-col class="col-md-2 col-sm-12">
                      <el-button  @click="visible_modal = false">Cerrar</el-button>
                  </el-col>
                </el-row>
            </md-content>
        </div>


    </el-dialog>
  </div>
</template>

<script>

import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import store from '@/store' // Clase Api donde se declara Axios y la ruta al servidor
import moment from 'moment'
import '@/styles/global_styles.css'


export default {
  name: 'Paperrecord_data',
  components: {

  },
  data() {
    return {
        sign_employee:null,
        sign_immediate_boss:null,
        sign_rrhh:null,
        sign_director:null,
        personal_intelisis_usuario_ad:null, // Usuario que se encuentra actualmente logeado
        fullscreenLoading:false,
        btnDisabledSignFirmar:false,
        user_signed:false,
        visible_modal: false,
        from_type_event:"", // El origen de donde viene si es desde listado o desde un registro nuevo creado
        user_personal_intelisis:{}, // Es el registro del personal intelisis al que pertenece el registro
        record_data:{}, // Es la data del registro
        permission_sign: false, // Si solo es para ver el permiso o para firmarlo
        period_selected:null,
        sign_pending:{},   // Es para revisar el permisos que esta pendiente y hacer la comprobacion con el usuario que esta logeado y saber si activar el boton o no
        permit_to_sign_behalf:false, // Bandera que se utiliza para saber si el usuario puede firmar por alguien más


    }
  },
  beforeMount() {

  },
  created() {

  },

  methods: {

    _tempCreated:function(_data){
        /* Parametros del _data ={
                "data":record,
                "visible_modal":true | false,
                "permission_sign":true | false,
                "type_event": string :: origen de donde fue invocado  => list, save
            }
        */

        this.fullscreenLoading = true;
        this.btnDisabledSignFirmar= false;

        this.record_data = _data.record_data
        this.user_personal_intelisis = _data.record_data.personal_intelisis
        this.setDataPeriodSelected();
        this.orderSignatures();
        this.checkHaveSignOnBehalf();
        this.visible_modal = _data.visible_modal
        this.permission_sign = _data.permission_sign
        if(_data.authorize_staff == true){
            this.user_signed = false;
        }
        this.from_type_event = _data.type_event

        this.fullscreenLoading = false;
    },
    setDataPeriodSelected(){
      var ths = this;

      if(this.record_data.data_vacation_days != null){

        /* this.record_data.data_vacation_days.available_periods.forEach(period => {
          if(ths.record_data.type_period == period.type_period && ths.record_data.period == period.current_period_year){
              ths.period_selected = period;
          }
        }); */

        if(this.record_data.data_vacation_days.available_periods.length > 0){
            ths.period_selected = this.record_data.data_vacation_days.available_periods[0];
        }

      }else{
        console.log("Error en data_vacation_days");
      }

    },
    orderSignatures(){
        this.user_signed = false;
        this.sign_employee = null;
        this.sign_immediate_boss = null;
        this.sign_rrhh = null;
        this.sign_director = null;

        this.personal_intelisis_usuario_ad = store.getters.user;
        this.record_data.signatures.forEach(sign =>{
            if(sign.order == 1){
                this.sign_employee = sign;
            }else if(sign.order == 2){
                this.sign_immediate_boss = sign;
            }else if(sign.order == 3){
                this.sign_rrhh = sign;
            }else if(sign.order == 4){
                this.sign_director = sign;
            }

            if(sign.status == 'pendiente'){
              this.sign_pending = sign;
            }

            if((sign.personal_intelisis_usuario_ad == this.personal_intelisis_usuario_ad) && (sign.signed_date != null)){
                this.user_signed = true;
            }

        })
    },

    async signDocument(_status){
        this.fullscreenLoading = true;
        this.btnDisabledSignFirmar= true;

        await Api.post("/rh/vacation/sing-document",{
            record_id: this.record_data.id,
            personal_intelisis_usuario_ad: this.personal_intelisis_usuario_ad,
            status:_status
        })
        .then(response =>{
            if(response.data.success == 1){

                const formAut = new FormData()
                formAut.append('name_view', this.$route.name)
                formAut.append('comentarios', "Se firmo las vacaciones con estatus: "+_status)
                formAut.append('id_afectado',this.record_data.id)
                formAut.append('evento', 'Vacaciones -> signDocument()')

                this.$store.dispatch('auditoria/addEventAuditoria', formAut)

                this.record_data = response.data.data;
                this.orderSignatures();
                this.$notify({
                    title:"Excelente",
                    message: `Se ha ${response.data.action} el documento correctamente.`,
                    type:"success",
                });

                if(this.from_type_event == "list"){
                    this.$emit('listenChildComponent');
                }

            }else{

                this.$notify({
                    title:"Aviso",
                    message: response.data.message,
                    type:"error",
                });
            }
            this.btnDisabledSignFirmar= false;
            this.fullscreenLoading = false;

        })
        .catch(error =>{
          console.log('error => /rh/vacation/sing-document  =>',error);
          this.fullscreenLoading = false;
          this.btnDisabledSignFirmar= false;
          this.$notify({
                title:"Aviso",
                message: "A ocurrido un error, intente de nuevo",
                type:"error",
              });
        });
    },

    async signOnBehalfDocument(_status){
        this.fullscreenLoading = true;
        this.btnDisabledSignFirmar= true;

        await Api.post("/rh/vacation/sing-document",{
            record_id: this.record_data.id,
            personal_intelisis_usuario_ad: this.sign_immediate_boss.personal_intelisis_usuario_ad,
            status:_status,
            sign_on_behalf:_status,
        })
        .then(response =>{
            if(response.data.success == 1){

                const formAut = new FormData()
                formAut.append('name_view', this.$route.name)
                formAut.append('comentarios', "Se firmo las vacaciones con estatus: "+_status)
                formAut.append('id_afectado',this.record_data.id)
                formAut.append('evento', 'Vacaciones -> signDocument()')

                this.$store.dispatch('auditoria/addEventAuditoria', formAut)

                this.record_data = response.data.data;
                this.orderSignatures();
                this.$notify({
                    title:"Excelente",
                    message: `Se ha ${response.data.action} el documento correctamente.`,
                    type:"success",
                });

                if(this.from_type_event == "list"){
                    this.$emit('listenChildComponent');
                }

            }else{
                this.$notify({
                    title:"Aviso",
                    message: response.data.message,
                    type:"error",
                });
            }

          this.fullscreenLoading = false;
          this.btnDisabledSignFirmar= false;

        })
        .catch(error =>{
          console.log('error => /rh/vacation/sing-document  =>',error);
          this.fullscreenLoading = false;
          this.btnDisabledSignFirmar= false;
          this.$notify({
                title:"Aviso",
                message: "A ocurrido un error, intente de nuevo",
                type:"error",
              });
        });
    },

    async checkHaveSignOnBehalf(){
        this.fullscreenLoading = true;

        this.permit_to_sign_behalf = false;
        await Api.get("/rh/check-sign-on-behalf/11/"+this.personal_intelisis_usuario_ad)
        .then(response =>{

            if(response.data.is_valid == 1){
              response.data.data.forEach(user => {
                if(user == this.sign_immediate_boss.personal_intelisis_usuario_ad){
                  this.permit_to_sign_behalf = true;
                }

              })

            }

          this.fullscreenLoading = false;

        })
        .catch(error =>{
          this.fullscreenLoading = false;
          this.$notify({
                title:"Aviso",
                message: "A ocurrido un error, intente de nuevo",
                type:"error",
              });
        });
    },

  },
  filters:{
    date(_date){
      return _date; //moment(_date).format('YYYY-MM-DD');
    },
    date_unix(_date){
      return Math.floor(new Date(_date).getTime() / 1000)
    },
    date_time(_date){
        return moment(_date).format('DD-MM-YYYY H:m:s');
    },
    working_day(_personal_time){
        if(_personal_time != null){
            if(_personal_time.dmirh_personal_time_details){
                let week_day = ['D','L','M','M','J','V','S',,'D'];
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
    remaining_balance(_record){
      if(_record.data_vacation_days){

      }else{
        return ""
      }
    },
    immediate_boss(_immediate_boss){
        if(_immediate_boss != null){
          return _immediate_boss.name+" "+_immediate_boss.last_name;
        }else{
          return "Sin Jefe inmediato asignado.";
        }
    },
    filter_period_date(_record){
      let years= _record.period.split('-');
      let anti_month_day = moment(_record.personal_intelisis.antiquity_date).format('DD-MM');
      return `${anti_month_day}-${years[0]} al ${anti_month_day}-${years[1]}`;

    }
  },
}
</script>

<style lang="scss" scoped>

</style>
