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
                    <label class="label-disabled" v-if="from_type_event == null">{{current_date | date}}</label>
                    <label class="label-disabled" v-else>{{work_permit.date_request}}</label>
                </el-col>
                <el-col class="col-md-4 col-sm-12">
                    <label>Fecha Recepción RH: </label>
                    <label class="label-disabled" style="width: 100px;">&nbsp;</label>
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
                      <h5>PERMISO (<span class="digital-sign">{{work_permit.status}}</span>)</h5>
                  </el-col>
              </el-row>
              <el-row class="mt-1 text-center">
                  <el-col class="col-md-12 col-sm-12 ">
                      <el-divider content-position="center">
                          <label class="folio">Folio:&nbsp;</label>
                          <label class="label-disabled folio label-bold">{{work_permit.id}}</label>
                      </el-divider>
                  </el-col>
              </el-row>
              <el-row class="mt-1" >
                  <el-col class="col-md-4 col-sm-12">
                      <label>Tipo de permiso: </label>
                      <label class="label-disabled">{{work_permit.type_permit.description}}</label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12">
                      <label>Motivo: </label>
                      <label v-if="work_permit.permit_concept == null" class="label-disabled">{{work_permit.reason}}</label>
                      <label v-else class="label-disabled">{{work_permit.permit_concept.description}}</label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12">
                      <label>Días: </label>
                      <label class="label-disabled">{{work_permit.total_days}}</label>
                  </el-col>
              </el-row>
              <el-row class="mt-1">
                  <el-col class="col-md-4 col-sm-12">
                      <label>Fechas inicio: </label>
                      <label class="label-disabled">{{work_permit.start_date}}</label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12">
                      <label>Fecha final: </label>
                      <label class="label-disabled">{{work_permit.end_date}}</label>
                  </el-col>
              </el-row>
              <el-row class="mt-1">
                  <el-col class="col-md-12 col-sm-12">
                      <label>Comentarios: </label>
                      <label class="label-disabled">{{work_permit.comments}}</label>
                  </el-col>
              </el-row>

              <div v-if="work_permit.attach_document.length > 0" >
                <el-row class="mt-1 mb-5">
                  <el-col class="col-md-12 col-sm-12" >
                    <el-card class="card-info" shadow="always">
                      <h5>Soporte Adjunto</h5>
                      <div>

                      </div>
                      <a v-for="(document,index) in work_permit.attach_document" v-bind:key :href="document.api_document" class="text-body" target="_blank"><i class="fa-solid fa-file-pdf text-danger icon-document"></i> {{document.name}}<br> </a>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </md-content>

            <md-content class="m-3">
            <el-row type="flex" class="mt-2 mb-3 section-title text-center">
                <el-col lass="col-md-3 col-sm-12" >
                    <h5>AUTORIZACIONES</h5>
                </el-col>
            </el-row>
            <el-row class="mt-1" >
                <el-col class="col-md-12 col-sm-12 text-center">
                    <label class="label-bold">Nota: &nbsp; </label>
                    <label>Si es un permiso con goce de sueldo se requiere firma del Director de Unidad de Negocio</label>
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
                            <span v-if="work_permit.sign_behalf && work_permit.sign_behalf.origin_table == 'control_signatures_behalves'">Se cuenta con firma autógrafa <br> Firma por delegación<br><br> {{work_permit.sign_behalf.personal_intelisis.name}} {{work_permit.sign_behalf.personal_intelisis.last_name}}</span>
                            <span v-else-if="work_permit.sign_behalf && work_permit.sign_behalf.origin_table == 'control_plaza_substitution'">Firma por Delegación de Permisos<br><br> {{work_permit.sign_behalf.personal_intelisis.name}} {{work_permit.sign_behalf.personal_intelisis.last_name}}</span>
                            <span v-else class="handwritten-sign">{{sign_immediate_boss.personal_intelisis.name}} {{sign_immediate_boss.personal_intelisis.last_name}}</span><br>
                            <!-- <span class="handwritten-sign">{{sign_immediate_boss.personal_intelisis.name}} {{sign_immediate_boss.personal_intelisis.last_name}}</span><br> -->
                            <span class="digital-sign">Estatus - {{sign_immediate_boss.status}}</span><br>
                            <span class="digital-sign">Firma digital - {{sign_immediate_boss.signed_date | date_unix}}</span><br>
                            <span class="digital-sign">{{sign_immediate_boss.signed_date | date_time}} </span><br>
                            <!-- <span v-if="work_permit.sign_behalf">Se cuenta con firma autógrafa</span> -->
                        </div>
                        <br>
                        <span class="title-sign">{{sign_immediate_boss.personal_intelisis.name}} {{sign_immediate_boss.personal_intelisis.last_name}} </span><br>
                        <span class="title-sign">{{sign_immediate_boss.personal_intelisis.position_company_full}}</span><br>
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
                        <div v-if="sign_rrhh.status == 'pendiente' && sign_rrhh.signed_date == null">
                            <span v-if="sign_rrhh.personal_intelisis.usuario_ad == personal_intelisis_usuario_ad" class="handwritten-preview-sign">{{sign_rrhh.personal_intelisis.name}} {{sign_rrhh.personal_intelisis.last_name}} </span><br>
                        </div>
                        <div v-if="sign_rrhh.signed_date != null && sign_rrhh.status != 'cancelado' && sign_rrhh.is_automatic == 0" >
                            <span v-if="work_permit.sign_behalf_direct && work_permit.sign_behalf_direct.origin_table == 'control_signatures_behalves'">Se cuenta con firma autógrafa <br> Firma por delegación<br><br> {{work_permit.sign_behalf_direct.personal_intelisis.name}} {{work_permit.sign_behalf_direct.personal_intelisis.last_name}}</span>
                            <span v-else-if="work_permit.sign_behalf_direct && work_permit.sign_behalf_direct.origin_table == 'control_plaza_substitution'">Firma por Delegación de Permisos<br><br> {{work_permit.sign_behalf.personal_intelisis.name}} {{work_permit.sign_behalf.personal_intelisis.last_name}}</span>
                            <span v-else class="handwritten-sign">{{sign_rrhh.personal_intelisis.name}} {{sign_rrhh.personal_intelisis.last_name}}</span><br>
                            <span class="digital-sign">Estatus - {{sign_rrhh.status}}</span><br>
                            <span class="digital-sign">Firma digital - {{sign_rrhh.signed_date | date_unix}}</span><br>
                            <span class="digital-sign">{{sign_rrhh.signed_date | date_time}} </span>
                        </div>
                        <br>
                        <br>
                        <br>
                        <span class="title-sign">{{sign_rrhh.personal_intelisis.name}} {{sign_rrhh.personal_intelisis.last_name}} </span><br>
                        <span class="title-sign">{{sign_rrhh.personal_intelisis.position_company_full}}</span>
                        <hr>
                        <span>{{sign_rrhh.personal_intelisis.position_company_full}}</span>
                        <br>
                        <br>
                    </div>

                </el-col>
                <el-col class="col-md-6 col-sm-12 text-center">
                    <div v-if="sign_director != null">
                        <!-- <div v-if="sign_director.status == 'pendiente' && sign_director.signed_date == null">
                            <span v-if="sign_director.personal_intelisis.usuario_ad == personal_intelisis_usuario_ad" class="handwritten-preview-sign">{{sign_director.personal_intelisis.name}} {{sign_director.personal_intelisis.last_name}} </span><br>
                        </div>
                        <div v-if="sign_director.signed_date != null && sign_director.status != 'cancelado'">
                            <span class="handwritten-sign">{{sign_director.personal_intelisis.name}} {{sign_director.personal_intelisis.last_name}}</span><br>
                            <span class="digital-sign">Estatus - {{sign_director.status}}</span><br>
                            <span class="digital-sign">Firma digital - {{sign_director.signed_date | date_unix}}</span><br>
                            <span class="digital-sign">{{sign_director.signed_date | date_time}} </span>
                        </div> -->
                        <br>
                        <span class="title-sign">{{sign_director.personal_intelisis.name}} {{sign_director.personal_intelisis.last_name}} </span><br>
                        <span class="title-sign">{{sign_director.personal_intelisis.position_company_full}}</span><br>
                        <hr>
                        <span>{{sign_director.personal_intelisis.position_company_full}}</span>
                        <br>
                        <br>
                    </div>

                </el-col>
            </el-row>
            </md-content>
            <hr>
            <md-content class="mt-5">
                <el-row class="mt-1" type="flex" justify="end" >
                    <el-col class="col-md-3 col-sm-12" v-if="sign_pending.status == 'pendiente' && permit_to_sign_behalf == true">
                        <el-button v-if="sign_pending.status == 'pendiente' && permit_to_sign_behalf == true" type="danger" :disabled="btnDisabledSignFirmar" @click="signOnBehalfDocument(false)">Rechazar Jefe Inmediato</el-button>
                    </el-col>
                    <el-col class="col-md-3 col-sm-12" v-if="sign_pending.status == 'pendiente' && permit_to_sign_behalf == true">
                        <el-button v-if="sign_pending.status == 'pendiente' && permit_to_sign_behalf == true" type="primary" :disabled="btnDisabledSignFirmar" @click="signOnBehalfDocument(true)">Firmar Jefe Inmediato</el-button>
                    </el-col>
                    <el-col class="col-md-1 col-sm-12" v-if="sign_pending.personal_intelisis_usuario_ad == personal_intelisis_usuario_ad && sign_pending.status == 'pendiente'">
                      <el-button v-if="permission_sign && user_signed == false " type="danger" :disabled="btnDisabledSignFirmar" @click="signDocument(false)">Rechaza</el-button>
                    </el-col>
                    <el-col class="col-md-1 col-sm-12" v-if="sign_pending.personal_intelisis_usuario_ad == personal_intelisis_usuario_ad && sign_pending.status == 'pendiente'">
                        <el-button v-if="permission_sign && user_signed == false" type="primary" :disabled="btnDisabledSignFirmar" @click="signDocument(true)">Firmar</el-button>
                    </el-col>
                    <el-col class="col-md-1 col-sm-12">
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
  name: 'Paperwork_permit',
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
        from_type_event:"",
        user_personal_intelisis:{}, // Es el registro del personal intelisis al que pertenece el permiso
        work_permit:{}, // Es el registro del permiso de trabajo al que pertenece el permiso
        permission_sign: false, // Si solo es para ver el permiso o para firmarlo
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
                "work_permit":work_permit,
                "visible_modal":true | false,
                "permission_sign":true | false,
                "type_event": string :: origen de donde fue invocado  => list, save
            }
        */
        this.fullscreenLoading = true;
        this.btnDisabledSignFirmar= false;

        this.work_permit = _data.work_permit
        this.user_personal_intelisis = _data.work_permit.personal_intelisis
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
    orderSignatures(){
        this.user_signed = false;
        this.sign_employee = null;
        this.sign_immediate_boss = null;
        this.sign_rrhh = null;
        this.sign_director = null;

        this.personal_intelisis_usuario_ad = store.getters.user;
        this.work_permit.signatures.forEach(sign =>{
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

        //console.log(this.sign_pending,this.personal_intelisis_usuario_ad)
    },

    async signDocument(_status){
        this.fullscreenLoading = true;

        await Api.post("/rh/work-permits/sing-permit",{
            work_permit_id: this.work_permit.id,
            personal_intelisis_usuario_ad: this.personal_intelisis_usuario_ad,
            status:_status
        })
        .then(response =>{
            if(response.data.success == 1){

                const formAut = new FormData()
                formAut.append('name_view', this.$route.name)
                formAut.append('comentarios', "Se firmo el permiso con estatus: "+_status)
                formAut.append('id_afectado', response.data.data.id)
                formAut.append('evento', 'signDocument()')

                this.$store.dispatch('auditoria/addEventAuditoria', formAut)

                this.work_permit = response.data.data;
                this.orderSignatures();
                this.btnDisabledSignFirmar= true;
                this.$notify({
                    title:"Excelente",
                    message: `Se ha ${response.data.action} el permiso correctamente.`,
                    type:"success",
                });

                if(this.from_type_event == "list"){
                    this.$emit('listenChildComponent');
                }

            }else{
                this.btnDisabledSignFirmar= false;
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

        await Api.post("/rh/work-permits/sing-permit",{
            work_permit_id: this.work_permit.id,
            personal_intelisis_usuario_ad: this.sign_pending.personal_intelisis_usuario_ad,
            status:_status,
            sign_on_behalf:_status,
        })
        .then(response =>{
            if(response.data.success == 1){

                const formAut = new FormData()
                formAut.append('name_view', this.$route.name)
                formAut.append('comentarios', "Se firmo el permiso con estatus: "+_status)
                formAut.append('id_afectado', response.data.data.id)
                formAut.append('evento', 'signDocument()')

                this.$store.dispatch('auditoria/addEventAuditoria', formAut)

                this.work_permit = response.data.data;
                this.orderSignatures();
                this.btnDisabledSignFirmar= true;
                this.$notify({
                    title:"Excelente",
                    message: `Se ha ${response.data.action} el permiso correctamente.`,
                    type:"success",
                });

                if(this.from_type_event == "list"){
                    this.$emit('listenChildComponent');
                }

            }else{
                this.btnDisabledSignFirmar= false;
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
        await Api.get("/rh/check-sign-on-behalf/9/"+this.personal_intelisis_usuario_ad)
        .then(response =>{

            if(response.data.is_valid == 1){
              response.data.data.forEach(user => {
                if(user == this.sign_pending.personal_intelisis_usuario_ad){
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
      return _date//moment(_date).format('YYYY-MM-DD');
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
