<template>
    <div class="app-container">
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <h3>Autorizaciones</h3>
        </div>
  
        <el-row class="m-1" type="flex" justify="end">
          <el-col class="m-1 col-md-4 col-sm-12">
            <el-input placeholder="Buscar..." v-model="headers.search" @input="getList()"></el-input>
          </el-col>
          <el-col class="m-1 col-md-2 col-sm-12">
            <el-select v-model="headers.subject" placeholder="Asunto" @change="getList()">
              <el-option label="Todos" value="all"></el-option>
              <el-option label="Justificaciones" value="justificaciones"></el-option>
              <el-option label="Permisos" value="permisos"></el-option>
              <el-option label="Requisisciones" value="requisiciones"></el-option>
              <el-option label="Vacaciones" value="vacaciones"></el-option>
            </el-select>
          </el-col>
          <el-col class="m-1 col-md-2 col-sm-12" >
            <el-select v-model="headers.order_by" placeholder="Ordenar" @change="getList()">
              <el-option label="Ascendente" value="desc"></el-option>
              <el-option label="Descendente" value="asc"></el-option>
            </el-select>
          </el-col>
          <el-col class="m-1 col-md-2 col-sm-12">
            <el-select v-model="headers.limit" placeholder="Mostrar" @change="getList()">
              <el-option label="20" value="2"></el-option>
              <el-option label="50" value="50"></el-option>
              <el-option label="100" value="100"></el-option>
            </el-select>
          </el-col>
        </el-row>
  
        <br>
  
        <el-table class="m-1" style="width: 100%" :data="general_data.data" v-loading="loading_get_list">
          
          <el-table-column prop="id" label="Folio" width="70"></el-table-column>
          <el-table-column prop="type_record" label="Asunto" width="110">
            <template slot-scope="scope">

              <el-tooltip v-if="scope.row.type_record == 'vacaciones'" class="item" effect="dark" content="Vacación" placement="bottom">
                <span v-bind:class="'circle-'+scope.row.type_record">{{scope.row.type_record}}</span>
              </el-tooltip>
              <el-tooltip v-else-if="scope.row.type_record == 'permiso'" class="item" effect="dark" content="Permiso" placement="bottom">
                <span v-bind:class="'circle-'+scope.row.type_record">{{scope.row.type_record}}</span>
              </el-tooltip>
              <el-tooltip v-else-if="scope.row.type_record == 'justificacion'" class="item" effect="dark" content="Justificación" placement="bottom">
                <span v-bind:class="'circle-'+scope.row.type_record">Justificación</span>
              </el-tooltip>
              <el-tooltip v-else-if="scope.row.type_record == 'requisicion'" class="item" effect="dark" content="Requisición" placement="bottom">
                <span v-bind:class="'circle-'+scope.row.type_record">Requisición</span>
              </el-tooltip>

            </template>
          </el-table-column>
          <el-table-column prop="personal_intelisis.full_name" label="Nombre" ></el-table-column>
          <el-table-column prop="status" label="Estatus">
            <template slot-scope="scope">
              <div v-if="scope.row.type_record == 'requisicion'">
                 <el-tag v-if="scope.row.status=='cancelada'" type="danger" effects="dark">{{scope.row.status}}</el-tag>
                  <el-tag v-if="scope.row.status=='rechazada'" type="danger" effects="dark">{{scope.row.status}}</el-tag>
                  <el-tag v-if="scope.row.status=='recaudar firmas'" type="warning" effects="dark">{{scope.row.status}}</el-tag>
                  <el-tag v-if="scope.row.status=='autorizada'" type="success" effects="dark">{{scope.row.status}}</el-tag>
                  <el-tag v-if="scope.row.status=='validacion'" type="info" effects="dark">{{scope.row.status}}</el-tag>
              </div>
              <div v-if="scope.row.type_record == 'vacaciones'">
                <span v-bind:class="'status-'+scope.row.status">{{scope.row.status}}</span>
              </div>
              <div v-if="scope.row.type_record == 'permiso'">
                <span v-bind:class="'status-'+scope.row.status">{{scope.row.status}}</span>
              </div>
              <div v-if="scope.row.type_record == 'justificacion'">
                <el-tag type="danger" effects="dark">Pendiente</el-tag>
              </div>


            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="Fecha de solicitud">
            <template slot-scope="scope">
              <!-- <div v-if="scope.row.type_record == 'requisicion'">{{ scope.row | date_large}}</div> -->
              <div >{{ scope.row | date_large }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="Acciones" >
            <template slot-scope="scope">

              <el-tooltip v-if="scope.row.type_record == 'vacaciones'" class="item" effect="dark" content="Ver" placement="bottom">
                <el-button
                  size="mini"
                  type="info"
                  circle
                  @click="viewRecordVacaciones(scope.row.id)">
                    <i class="el-icon-view"></i>
                </el-button>
              </el-tooltip>

              <el-tooltip v-else-if="scope.row.type_record == 'permiso'" class="item" effect="dark" content="Ver" placement="bottom">
                <el-button
                  size="mini"
                  type="info"
                  circle
                  @click="viewRecordPermiso(scope.row.id)">
                    <i class="el-icon-view"></i>
                </el-button>
              </el-tooltip>

              <div v-else-if="scope.row.type_record == 'justificacion'">
                <el-tooltip class="item" effect="dark" content="Ver" placement="bottom">
                  <el-button
                    size="mini"
                    type="info"
                    circle
                    @click="viewRecordJustificacion(scope)">
                      <i class="el-icon-view"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Autorizar" placement="bottom">
                  <el-button
                    size="mini"
                    type="success"
                    circle
                    @click="autorizarJustificacion(scope.row.id)">
                      <i class="el-icon-check"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="Rechazar" placement="bottom">
                  <el-button
                    size="mini"
                    type="danger"
                    circle
                    @click="rechazarJustificacion(scope.row.id)">
                      <i class="el-icon-close"></i>
                  </el-button>
                </el-tooltip>
              </div>

              <div v-else-if="scope.row.type_record == 'requisicion'">
                <div v-if="scope.row.status == 'validacion'">
                  <el-tooltip content="Detalles" placement="top">
                    <el-button type="info" size="mini" icon="el-icon-view" @click="validateRequisition(scope)" circle></el-button>
                  </el-tooltip>
                </div>
                <div v-else>
                  <el-tooltip content="Detalles" placement="top">
                    <el-button type="info" size="mini" icon="el-icon-view" @click="myPendingRequisition(scope)" circle></el-button>
                  </el-tooltip>
                  <!-- <el-tooltip content="Firmar" v-if="scope.row.status=='recaudar firmas' && scope.row.sign_status=='pendiente'"  placement="top">
                    <el-button type="success" size="mini" icon="el-icon-edit" @click="myPendingRequisitionFirmar(scope)" circle></el-button>
                  </el-tooltip> -->
                </div>

              </div>

              

            </template>
          </el-table-column>
          

        </el-table>
        <br>
        <el-row class="m-3" type="flex" justify="center">
          <el-pagination
            :page-size="headers.limit"
            :pager-count="9"
            layout="prev, pager, next"
            :total="general_data.total"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </el-row>
  
        <br>
        <view_record_vacaciones ref="viewVacationComponentVacaciones" @listenChildComponent="getList" />
        <view_record_permisos ref="viewWorkPermitComponent" @listenChildComponent="getList" />
        <ModalJustification ref="ModalJustification" />
        <ModalRequisition ref="ModalRequisition" />
        <ModalPendingRequisition ref="ModalPendingRequisition" />
        <viewFile ref="viewFile" />
        
      </el-card>
  
    </div>
  
  </template>
  
  <script>
  
  import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
  import { mapGetters} from 'vuex'
  import Swal from 'sweetalert2'
  import view_record_vacaciones from '../../vacaciones/viewRecord.vue'
  import view_record_permisos from '../../Permisos/SolicitarPermisos/viewRecord.vue'
  import ModalJustification from '../../ControlAsistencia/HorariosDependientes/components/ModalJustification.vue'
  import ModalRequisition from '../../Requisiciones/PanelRequisiciones/components/ModalRequisition.vue'
  import ModalPendingRequisition from '../../Requisiciones/RequisicionesPendientesFirma/components/ModalRequisition.vue'
  import viewFile from '../../Requisiciones/components/viewFile'


  import '@/styles/global_styles.css'
  import moment from 'moment'
  import { deepClone } from '@/utils'
  
  export default {
    name: 'TableSearch',
    components: {
      view_record_vacaciones,
      view_record_permisos,
      ModalJustification,
      ModalRequisition,
      ModalPendingRequisition,
      viewFile
    },
    data() {
      return {
        general_data:{},
        headers:{
          limit:20,
          page:1,
          order_by:'desc',
          search:"",
          subject:"all"
        },
        loading_get_list:false,
      }
    },
    beforeMount() {
      this.$store.dispatch('getEmailDomain');
      
  
    },
    created() {
      this.getList();
    },
  
    methods: {
      async getList(_page = 1){
        this.headers.page = _page;
        this.loading_get_list= true;
        await Api.get('/rh/authorisations/list',{
          params:this.headers
        })
        .then(response =>{
  
          const formAut = new FormData()
          formAut.append('name_view', this.$route.name)
          formAut.append('comentarios', "Autorizaciones")
          formAut.append('id_afectado',"")
          formAut.append('evento', 'Autorizaciones -> getList()')
  
          this.$store.dispatch('auditoria/addEventAuditoria', formAut)
  
          this.general_data = response.data
          this.loading_get_list = false
        })
        .catch(error =>{
          console.log(error);
          this.loading_get_list = false
  
        });
  
      },

      handleCurrentChange(val){
        this.getList(val);
      },

      async viewRecordVacaciones(_id){
        this.loading_get_list = true;

        await Api.get("/rh/vacation/single/"+_id)
        .then(response =>{

            const formAut = new FormData()
            formAut.append('name_view', this.$route.name)
            formAut.append('comentarios', "Autorizar Vacaciones")
            formAut.append('id_afectado',_id)
            formAut.append('evento', 'Vacaciones -> viewRecord()')

            this.$store.dispatch('auditoria/addEventAuditoria', formAut)

            this.loading_get_list = false;
            this.$refs.viewVacationComponentVacaciones._tempCreated({
              "record_data":response.data,
              "visible_modal":true,
              "permission_sign":true,
              "type_event":"list",
              "authorize_staff":true,
            });

        })
        .catch(error =>{
          this.loading_get_list = false;
          console.log("error => ","/rh/vacation/single/"+_id,error);
          this.$notify({
                title:"Aviso",
                message: "A ocurrido un error, intente de nuevo",
                type:"error",
              });
        });

      },

      async viewRecordPermiso(_id){
        this.loading_get_list = true;

        await Api.get("/rh/work-permits/single/"+_id)
        .then(response =>{
            this.loading_get_list = false;
            this.$refs.viewWorkPermitComponent._tempCreated({
              "work_permit":response.data,
              "visible_modal":true,
              "permission_sign":true,
              "type_event":"list",
              "authorize_staff":true,
            });

        })
        .catch(error =>{
          this.loading_get_list = false;
          this.$notify({
                title:"Aviso",
                message: "A ocurrido un error, intente de nuevo",
                type:"error",
              });
        });

      },

      /* ***************************** JUSTIFICACIONES   ***************************** */
      viewRecordJustificacion(_scope){

        const listArchivos = []
        this.$refs.ModalJustification.ruleForm.userAd = _scope.row.user
        this.$refs.ModalJustification.ruleForm.typeJus = _scope.row.dmirh_cat_type_justification.description
        this.$refs.ModalJustification.ruleForm.Comentarios = _scope.row.description
        this.$refs.ModalJustification.ruleForm.FechaInicio = _scope.row.date
        if(_scope.row.file!=null && _scope.row.file !=""){
          listArchivos.push({ name: _scope.row.file, url: _scope.row.file_url })
          this.$refs.ModalJustification.fileList = listArchivos
        }else{
          this.$refs.ModalJustification.fileList=[];
        }
        this.$refs.ModalJustification.isDisabled =true;
        this.$refs.ModalJustification.dialogType = 'edit'
        this.$refs.ModalJustification.dialogVisible = true


      },

      async autorizarJustificacion(Id) {
        const currentObj = this
        const id = Id
        const config = { headers: { 'content-type': 'multipart/form-data' }}
        const formData = new FormData()
        formData.append('id', id)
        this.loading_get_list = true

        await Api.post('/controlAsistencia/autorizarJustification', formData, config).then(res => {
          currentObj.res = res.data
          currentObj.status = res.status
          const formAut = new FormData()
          formAut.append('name_view', this.$route.name)
          formAut.append('comentarios', 'Se autorizo Justificacion con Id ')
          formAut.append('evento', 'autorizarHorario()')
          formAut.append('id_afectado', id)

          this.$store.dispatch('auditoria/addEventAuditoria', formAut)
          this.$notify({
            title: 'Proceso Exitoso',
            message: currentObj.res['success'],
            type: 'success'
          })

          this.loading_get_list=false;
          this.getList();

        }).catch(function(error) {
          console.log(error)
          this.loading_get_list=false;
        })
    
      
      },

      async rechazarJustificacion(Id) {
        const currentObj = this
        const id = Id
        const config = { headers: { 'content-type': 'multipart/form-data' }}
        const formData = new FormData()
        formData.append('id', id)
        this.loading_get_list = true
        await Api.post('/controlAsistencia/rechazarJustification', formData, config).then(res => {
          currentObj.res = res.data
          currentObj.status = res.status
            const formAut = new FormData()
          formAut.append('name_view', this.$route.name)
          formAut.append('comentarios', 'Se rechazó justificacion con Id')
          formAut.append('evento', 'rechazarJustification()')
          formAut.append('id_afectado', id)

          this.$store.dispatch('auditoria/addEventAuditoria', formAut)
          
          this.$notify({
            title: 'Proceso Exitoso',
            message: currentObj.res['success'],
            type: 'success'
          })

          this.loading_get_list = false
          this.getList();
          
        }).catch(function(error) {
          console.log(error)
          this.loading_get_list = false
        })

      },
      

      /* ***************************** JUSTIFICACIONES   ***************************** */


      /* ***************************** START - REQUISICIONES   ***************************** */
      async validateRequisition(scope) {
        const listArchivos = []
        this.$forceUpdate();

        this.$root.$refs.ModalRequisition.handleChangeTravel(true);
        this.$root.$refs.ModalRequisition.formRequisition = deepClone(scope.row);
        this.$root.$refs.ModalRequisition.handleChangeType(scope.row.type);
        this.$root.$refs.ModalRequisition.formRequisition.vacancy = scope.row.vacancy;
        this.$root.$refs.ModalRequisition.formRequisition.type_vacancy = scope.row.type_vacancy;
        this.$root.$refs.ModalRequisition.handleChangeTypeTemp(scope.row.type_vacancy);
        this.$root.$refs.ModalRequisition.formRequisition.reason_replacement = scope.row.reason_replacement;

        this.$root.$refs.ModalRequisition.formRequisition.temp_reason = scope.row.temp_reason;
        this.$root.$refs.ModalRequisition.formRequisition.days_temp_reason = scope.row.days_temp_reason;

        if (scope.row.dmi_control_email_domain) {
          this.$root.$refs.ModalRequisition.handleChangeEmail(true);

        } else {
          this.$root.$refs.ModalRequisition.handleChangeEmail(false);
        }
        if (scope.row.file != null && scope.row.file != "") {
          listArchivos.push({
            name: scope.row.file,
            url: scope.row.file_url
          })
          this.$root.$refs.ModalRequisition.fileList = listArchivos
        } else {
          this.$root.$refs.ModalRequisition.fileList = [];
        }


        var reso = Object.values(scope.row.resources);
        this.$root.$refs.ModalRequisition.formRequisition.resources = reso;
        if (scope.row.time_travel) {
          this.$root.$refs.ModalRequisition.chktravel = true;
        }

        if (scope.row.type == "Reemplazo") {
          if (scope.row.personal_substitution !== null && scope.row.personal_substitution !== "null") {
            this.$root.$refs.ModalRequisition.formRequisition.personal_substitution = scope.row.personal_substitution;
            this.$root.$refs.ModalRequisition.search = scope.row.personal_substitution;

          } else {
            this.$root.$refs.ModalRequisition.formRequisition.plaza_id = scope.row.plaza_id;
            this.$root.$refs.ModalRequisition.search = scope.row.plaza_id;

          }
          const formData = new FormData()
          formData.append('user', scope.row.user)
          this.$store.dispatch('getCommading_staff_All_Panel', formData);
        }
        this.$root.$refs.ModalRequisition.dialogType = 'edit'
        this.$root.$refs.ModalRequisition.dialogVisible = true

      },

      async myPendingRequisition(scope){

        const listArchivos = []
        this.$refs.ModalPendingRequisition.handleChangeTravel(true);
        this.$refs.ModalPendingRequisition.formRequisition = deepClone(scope.row);
        this.$refs.ModalPendingRequisition.formRequisition.vacancy = scope.row.vacancy;
        this.$refs.ModalPendingRequisition.handleChangeType(scope.row.type);
        this.$refs.ModalPendingRequisition.handleChangeTypeTemp(scope.row.type_vacancy);
        this.$refs.ModalPendingRequisition.search = scope.row.personal_substitution;
        this.$refs.ModalPendingRequisition.formRequisition.personal_substitution = scope.row.personal_substitution;
        this.$refs.ModalPendingRequisition.formRequisition.reason_replacement = scope.row.reason_replacement;
        this.$refs.ModalPendingRequisition.formRequisition.type_vacancy = scope.row.type_vacancy;
        this.$refs.ModalPendingRequisition.formRequisition.temp_reason = scope.row.temp_reason;
        this.$refs.ModalPendingRequisition.formRequisition.date = scope.row.date;

        if (scope.row.dmi_control_email_domain) {
          this.$refs.ModalPendingRequisition.handleChangeEmail(true);

        } else {
          this.$refs.ModalPendingRequisition.handleChangeEmail(false);
        }

        if (scope.row.file) {
          listArchivos.push({
            name: scope.row.file,
            url: scope.row.url
          })
          this.$refs.ModalPendingRequisition.fileList = listArchivos
        }

        var reso = Object.values(scope.row.resources);
        this.$refs.ModalPendingRequisition.formRequisition.resources = reso;
        if (scope.row.time_travel) {
          this.$refs.ModalPendingRequisition.chktravel = true;
        }
        if (scope.row.status == "Recaudar Firmas" || scope.row.status == "autorizado" || scope.row.status == "Cancelada") {
          this.$refs.ModalPendingRequisition.isDisabled = true;
        }

        if (scope.row.type == "Reemplazo") {
          if (scope.row.personal_substitution !== null && scope.row.personal_substitution !== "null") {
            this.$refs.ModalPendingRequisition.formRequisition.personal_substitution = scope.row.personal_substitution;
            this.$refs.ModalPendingRequisition.search = scope.row.personal_substitution;

          } else {
            this.$refs.ModalPendingRequisition.formRequisition.plaza_id = scope.row.plaza_id;
            this.$refs.ModalPendingRequisition.search = scope.row.plaza_id;

          }
          const formData = new FormData()
          formData.append('user', scope.row.user)
          this.$store.dispatch('getCommading_staff_All_Panel', formData);
        }
        this.$refs.ModalPendingRequisition.dialogType = 'new'
        this.$refs.ModalPendingRequisition.higher = true;
        this.$refs.ModalPendingRequisition.dialogVisible = true
      },

      myPendingRequisitionFirmar(scope) {

        this.loading_get_list = true;
        const formData = new FormData()
        formData.append('id', scope.row.id)
        formData.append('user', this.$store.getters.user);
        formData.append('status', true);
        this.$store.dispatch('SignRequisition', formData).then(res => {

          this.$notify({
            title: 'Requisicion Firmada',
            message: res.data.success,
            type: 'success',
            offset: 50
          });

          this.getList();

          const formAut = new FormData()
          formAut.append('name_view', this.$route.name)
          formAut.append('comentarios', 'Se firmó requisicion -> Detalles: ' + this.$store.getters.user)
          formAut.append('evento', 'myPendingRequisitionFirmar()')
          formAut.append('id_afectado', scope.row.id)

          this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        })

        this.loading_get_list = false;
      },

      /* ***************************** END - REQUISICIONES   ***************************** */

  
    },
    filters:{  
      date_large(_row){

        if(_row.type_record == 'requisicion'){
          var parsedDate = moment(_row.created_at, "YYYY-MM-DD");
          return parsedDate.format("DD-MM-YYYY");

        }else{
          var parsedDate = moment(_row.created_at, "DD-MM-YYYY");
          return parsedDate.format("DD-MM-YYYY");
        }
      },
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
  