<template>
    <div class="app-container">
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <h3>
            <router-link to="/rh/cai/proceso-de-incidencias"><i class="fas fa-arrow-alt-circle-left text-dark"></i> </router-link>
            Proceso de Incidencia / Incidencias
          </h3>
        </div>

        <div v-if="full_screen_loading" class="text-center">
          <br>
          <br>
          <br>
          <md-progress-spinner :md-stroke="2" :md-diameter="40" md-mode="indeterminate"></md-progress-spinner>
          <br>
          <br>
          <br>
        </div>

        <div v-else class="m-2">
          
          <md-content class="">
            <el-row class="mb-3">
              <el-row class="text-center">
                <el-col class="col-md-4 col-sm-12">
                  <div class="card-info">
                    <span><h1>{{ incident_process.incident_process_detail.length }}</h1></span>
                    <span class="text-info"><h5><i class="fas fa-calendar text-info m-1"></i>Totales</h5></span>
                  </div>
                </el-col>
                <el-col class="col-md-4 col-sm-12">
                  <div class="card-success">
                    <span><h1>{{ incident_process.incident_process_detail_justified }}</h1></span>
                    <span class="text-success"><h5><i class="fas fa-calendar-check text-success m-1"></i>Justificadas</h5></span>
                  </div>
                </el-col>
                <el-col class="col-md-4 col-sm-12">
                  <div class="card-danger">
                    <span><h1>{{ incident_process.incident_process_detail.length - incident_process.incident_process_detail_justified}}</h1></span>
                    <span class="text-danger"><h5><i class="fas fa-calendar-times text-danger m-1"></i>Sin justificar</h5></span>
                  </div>
                </el-col>
              </el-row>
            </el-row> 

            <el-row class="mt-3">
              <el-row>
                  <el-col class="col-md-4 col-sm-12">
                    <label>Folio:&nbsp;<strong>{{ incident_process.id}}</strong></label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12">
                    <label>Generado:&nbsp;<strong>{{ incident_process.created_at | short_date_generate }}</strong></label>
                  </el-col>
                  <el-col class="col-md-4 col-sm-12">
                    <label>Período:&nbsp;<strong>{{ incident_process.start_date }}</strong> al <strong>{{ incident_process.end_date }}</strong> </label>
                  </el-col>
                </el-row>
            </el-row> 
            
            <el-row>
              <el-col class="col-md-4 col-sm-12">
                <label>Colaboradores contemplados:&nbsp;<strong>{{ incident_process.collaborators_contemplated}}</strong></label>&nbsp;
                <el-tooltip class="item" effect="dark" content="Ver" placement="bottom">
                  <i class="fas fa-users text-primary" @click="modalCollaboratorscontemplated()"></i>
                </el-tooltip>
              </el-col>
              <el-col class="col-md-4 col-sm-12">
                <label>Ubicación:&nbsp;<strong>{{ incident_process.locations}}</strong></label>&nbsp;
              </el-col>
              <el-col class="col-md-4 col-sm-12">
                <label v-if="incident_process.status == 'activo'">Estatus:&nbsp;&nbsp;<el-tag type="success"><strong style="font-size: 18px;">{{ incident_process.status.toUpperCase() }}</strong></el-tag></label>
                <label v-if="incident_process.status == 'cerrado'">Estatus:&nbsp;&nbsp;<el-tag type="primary"><strong style="font-size: 18px;">{{ incident_process.status.toUpperCase() }}</strong></el-tag></label>
                <label v-if="incident_process.status == 'cancelado'">Estatus:&nbsp;&nbsp;<el-tag type="danger"><strong style="font-size: 18px;">{{ incident_process.status.toUpperCase() }}</strong></el-tag></label>
              </el-col>
            </el-row>

            <el-row class="mt-2">
              <el-row class="card-info">
                <el-row >
                  <el-col class="col-md-12 col-sm-12 text-right">
                    <el-button type="danger" v-if="incident_process.status == 'activo'" @click="cancelRecord()"><i class="fas fa-close"></i> Cancelar</el-button>
                    <el-button type="primary" v-if="incident_process.status == 'activo'" @click="sendNotification()" :loading="btn_send_notification"><i class="fa-solid fa-envelope-open-text"></i> Enviar notificación</el-button>
                    <el-button type="success" @click="closeRecord()" v-if="incident_process.status == 'activo'"><i class="fas fa-lock"></i> Cerrar proceso</el-button>
                    <el-button :loading="loading_mov_erp" type="primary" @click="getMovimientosERP()" v-if="incident_process.status == 'cerrado'"><i class="fa-solid fa-list-check"></i> Movientos ERP</el-button>
                  </el-col>
                </el-row>
              </el-row>
            </el-row> 

            

            <el-row type="flex" class="mt-5 justify-content-end">
              <el-col class="col-md-6 col-sm-12">
                <el-input  suffix-icon="el-icon-search" v-model="search" placeholder="Buscar colaborador"/>
              </el-col>
              <el-col class="col-md-6 col-sm-12"  style="display:contents;">
                <i class="fa-solid fa-filter mr-1 text-secondary" style="align-items: center; display: flex;"></i>
                <el-select v-model="headers.status" placeholder="Estatus" @change="getList()">
                  <el-option
                    v-for="item in status_incidents"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row> 

            <el-table
              class="mt-3 m-1"
              style="width: 100%"
              :data="incident_process.incident_process_detail.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
              v-loading="full_screen_loading">
              <el-table-column
                prop="id"
                label="Folio"
                width="70">
              </el-table-column>
              <el-table-column
                prop="name"
                label="Nombre"
                >
              </el-table-column>
              <el-table-column
                prop="date_incident"
                label="Fecha"
                width="100">
                <template slot-scope="scope">
                  <div>
                    {{ scope.row.date_incident | short_date}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="entry_hour"
                label="Entrada"
                width="100">
              </el-table-column>
              <el-table-column
                prop="horario_base"
                label="Horario base"
                width="220">
              </el-table-column>
              <el-table-column
                prop="status"
                label="Estatus"
                width="130">
                <template slot-scope="scope">
                  <!-- <span >{{ scope.row.status }}</span> -->
                  <el-tag v-if="scope.row.status == 'Puntualidad'" type="success">Puntualidad</el-tag>
                  <el-tag v-if="scope.row.status == 'Tolerancia'" type="info">Tolerancia</el-tag>
                  <el-tag v-if="scope.row.status == 'Retardo'" type="warning">Retardo</el-tag>
                  <el-tag v-if="scope.row.status == 'Suspensión'" type="danger">Suspensión</el-tag>
                  <el-tag v-if="scope.row.status == 'Falta injustificada'" type="danger">Falta injustificada</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="check_format"
                label="Checadas"
                width="150">
                <template slot-scope="scope">
                  <el-collapse accordion>
                    <el-collapse-item name="1">
                      <template slot="title" class="p-1">
                        <h5>&nbsp;<i class="fas fa-user-clock text-primary"></i></h5>
                      </template>
                      <div v-for="(check, index) in scope.row.check_format" :key="index">
                        <span v-if="check != ''">&nbsp;- {{ check }}</span>
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                  
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="Acciones"
                width="200">
                <template slot-scope="scope">
                  <el-tooltip v-if="scope.row.dmirh_personal_justification_id == null && incident_process.status == 'activo'" class="item" effect="dark" content="Justificar" placement="bottom">
                    <el-button
                      type="primary"
                      circle
                      @click="justifyIncident(scope.row)">
                      <i class="fas fa-calendar-plus"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip v-if="scope.row.dmirh_personal_justification_id != null" class="item" effect="dark" content="Justificado" placement="bottom">
                    <el-button
                      type="success"
                      circle
                      @click="viewJustification(scope.row)">
                        <i class="fas fa-calendar-check"></i>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </md-content>
          
        </div>
  
        <br>
        <br>  
        <br>
        
      </el-card>
      
      <modalJustification ref="modalJustification"  @listenChildComponent="getList"></modalJustification>

      <el-dialog title="Colaboradores contemplados" :visible.sync="modal_visible_cc">
        <el-row type="flex" class="mb-1 justify-content-end">
            <el-col class="col-md-6 col-sm-12">
              <el-input  suffix-icon="el-icon-search" v-model="search_modal" placeholder="Buscar colaborador"/>
            </el-col>
          </el-row>
        <el-table
        :data="collaborators_contemplated.filter(data => !search_modal || data.full_name.toLowerCase().includes(search_modal.toLowerCase()))"
        >
          <el-table-column property="personal_id" label="No. Personal" width="150"></el-table-column>
          <el-table-column property="full_name" label="Nombre"></el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog title="Movimientos ERP" :visible.sync="modal_mov_erp" width="80%">
        <el-row type="flex" class="mb-1 justify-content-end">
            <el-col class="col-md-6 col-sm-12">
              <el-input  suffix-icon="el-icon-search" v-model="search_modal_mov_erp" placeholder="Buscar colaborador"/>
            </el-col>
          </el-row>
        <el-table
        v-loadin="loading_mov_erp"
        :data="list_mov_erp.filter(data => !search_modal_mov_erp || data.insert_mov_erp.referencia.toLowerCase().includes(search_modal_mov_erp.toLowerCase()))"
        >
        <el-table-column property="insert_mov_erp.personal" label="No. Personal" width="150"></el-table-column>
        <el-table-column property="insert_mov_erp.referencia" label="Nombre" width="270"></el-table-column>
          <el-table-column property="insert_mov_erp.concepto" label="Tipo de incidencia" width="150"></el-table-column>
          <el-table-column property="insert_mov_erp.cantidad" label="Cantidad" width="85"></el-table-column>
          <el-table-column property="observations" label="Observaciones"></el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog title="Notificaciones enviadas" :visible.sync="modal_error_sent_notification">
        <el-row class="card-danger">
          <el-col><strong>No se encontró el Gerente o Director de las siguientes personas.</strong></el-col>
        </el-row>
        <el-row>
          <el-col v-for="item in gerente_director_not_found">
            <el-tag class="m-1" type="info" effect="dark">{{ item }}</el-tag>
          </el-col>
        </el-row>
        <br>
        <el-row class="card-danger">
          <el-col><strong>No se pudo enviar la notificación a los siguientes correos.</strong></el-col>
        </el-row>
        <el-row>
          <el-col v-for="item in email_not_sent">
            <el-tag class="m-1" type="info" effect="dark">{{ item }}</el-tag>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="modal_error_sent_notification = false">Cerrar</el-button>
        </span>
      </el-dialog>
    </div>
  
  </template>
  
  <script>
  
  import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
  import { mapGetters} from 'vuex'
  import Swal from 'sweetalert2'
  import '@/styles/global_styles.css'
  import moment from 'moment'
  import { deepClone } from '@/utils'
  import modalJustification from "../ValidarIncidencias/modalJustification.vue"
  
  export default {
    name: 'SingleProcesoDeIncidencias',
    components: {
      modalJustification
    },
    data() {
      return {
        headers:{
          status:""
        },
        incident_process:{},
        incident_process_id:this.$route.params.id,
        full_screen_loading:false,
        search:"",
        collaborators_contemplated:[],
        list_mov_erp:[],
        modal_visible_cc:false,
        modal_mov_erp:false,
        modal_error_sent_notification:false,
        btn_send_notification:false,
        loading_mov_erp:false,
        search_modal:"",
        search_modal_mov_erp:"",
        gerente_director_not_found:[],
        email_not_sent:[],
        status_incidents:[
          {
            text:"Todos",
            value:""
          },
          {
            text:"Tolerancia",
            value:"Tolerancia"
          },
          {
            text:"Retardo",
            value:"Retardo"
          },
          {
            text:"Suspensión",
            value:"Suspensión"
          },
          {
            text:"Falta injustificada",
            value:"Falta injustificada"
          },
        ],
        cut_off_dates:[],
        cutoff_date:"",
      }
    },
    beforeMount() {
    },
    created() {

      this.getList();
      

    },
    mounted(){
      
    },
    methods: {
      async getList(){

        this.full_screen_loading= true;
        await Api.get(`/rh/incident-process/single/`,{
          params:{
            "incident_process_id":this.incident_process_id,
            "type_incident":this.headers.status,
          }
        })
        .then(response =>{

          const formAut = new FormData()
          formAut.append('name_view', this.$route.name)
          formAut.append('comentarios', "Obtener detalle de proceso")
          formAut.append('id_afectado',this.incident_process_id)
          formAut.append('evento', 'Obtener detalle de proceso -> getList()')

          this.$store.dispatch('auditoria/addEventAuditoria', formAut)
          this.incident_process = response.data.data
          this.full_screen_loading = false
        })
        .catch(error =>{
          console.log(error);
          this.full_screen_loading = false

        });

      },

      justifyIncident(_incident){

        this.$refs.modalJustification._tempCreated({
          "incident":_incident,
          "edit":true
        });

      },

      viewJustification(_incident){
        this.$refs.modalJustification._tempCreated({
          "incident":_incident,
          "edit":false
        });
      },

      async modalCollaboratorscontemplated(){

        this.modal_visible_cc = true;
        this.search_modal="";

        await Api.get(`/rh/incident-process/collaboratos-contemplated/${this.incident_process_id}`)
        .then(response =>{

          if(response.data.success == 1){
            this.collaborators_contemplated = response.data.data  
          }else{
            this.$notify({
              title:"Error",
              message: "No se obtuvieron los registros.",
              type:"error",
            });
          }

        })
        .catch(error =>{
          console.log(error);
        });

      },
      closeRecord(){

        Swal.fire({
          title: 'Está seguro que desea cerrar el proceso?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cerrar'
        }).then((result) => {
          if (result.isConfirmed) {

            this.full_screen_loading= true;
            
            Api.post(`/rh/incident-process/close/`+this.incident_process_id)
            .then(response =>{

              const formAut = new FormData()
              formAut.append('name_view', this.$route.name)
              formAut.append('comentarios', "Se cerro el proceso")
              formAut.append('id_afectado',this.incident_process_id)
              formAut.append('evento', 'Se cerro el proceso manualmente -> cerrarRecord()')

              this.$store.dispatch('auditoria/addEventAuditoria', formAut)
              this.full_screen_loading = false
              
              if(response.data.success == 1){
                this.getList();

                this.$notify({
                  title:"Excelente",
                  message: "Se ha cerrado correctamente el proceso de incidencias",
                  type:"success",
                });
                
              }else{
                this.$notify({
                    title:"Aviso",
                    message: "Ha ocurrido un error, intente de nuevo",
                    type:"warning",
                  });
              }
            })
            .catch(error =>{
              console.log(error);
              this.full_screen_loading = false
              
              this.$notify({
                    title:"Aviso",
                    message: "Ha ocurrido un error, intente de nuevo",
                    type:"error",
                  });
            });

          }
        })

      },

      cancelRecord(){

        Swal.fire({
          title: 'Está seguro que desea cancelar el proceso?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cancelar'
        }).then((result) => {
          if (result.isConfirmed) {

            this.full_screen_loading= true;
            
            Api.post(`/rh/incident-process/cancel/`+this.incident_process_id)
            .then(response =>{

              const formAut = new FormData()
              formAut.append('name_view', this.$route.name)
              formAut.append('comentarios', "Se cancelo el proceso")
              formAut.append('id_afectado',this.incident_process_id)
              formAut.append('evento', 'Se cancelo el proceso manualmente -> cancelRecord()')

              this.$store.dispatch('auditoria/addEventAuditoria', formAut)
              this.full_screen_loading = false
              

              if(response.data.success == 1){
                this.getList();

                this.$notify({
                  title:"Excelente",
                  message: "Se ha cancelo correctamente el proceso de incidencias",
                  type:"success",
                });
                
              }else{
                this.$notify({
                    title:"Aviso",
                    message: "No se puede cancelar, puesto que ya tiene justificaciones.",
                    type:"warning",
                  });
              }
            })
            .catch(error =>{
              console.log(error);
              this.full_screen_loading = false
              
              this.$notify({
                    title:"Aviso",
                    message: "Ha ocurrido un error, intente de nuevo",
                    type:"error",
                  });
            });
          
          }
        })

      },

      async getMovimientosERP(){
        this.modal_mov_erp = true;
        this.loading_mov_erp = true;
        this.search_modal_mov_erp="";

        await Api.get(`/rh/incident-process/get-preview-insert-mov-erp/${this.incident_process_id}`)
        .then(response =>{

          if(response.data.success == 1){
            this.list_mov_erp = response.data.data  
            this.loading_mov_erp = false;
          }else{
            this.$notify({
              title:"Error",
              message: "No se obtuvieron los registros.",
              type:"error",
            });
            this.loading_mov_erp = false;
          }
          
          
        })
        .catch(error =>{
          console.log(error);
          this.loading_mov_erp = false;
        });
      },

      sendNotification(){

        this.btn_send_notification = true;
        this.gerente_director_not_found = [];
        this.email_not_sent = [];
        Api.get(`/rh/incident-process/send-notification/`+this.incident_process_id)
            .then(response =>{
              if(response.data.success == 1){

                this.$notify({
                  title:"Excelente",
                  message: "Notificaciones enviadas.",
                  type:"success",
                });

                if(response.data.data.gerente_director_not_found.length > 0 || response.data.data.email_not_sent.length > 0){
                  this.gerente_director_not_found = response.data.data.gerente_director_not_found;
                  this.email_not_sent = response.data.data.email_not_sent;
                  this.modal_error_sent_notification = true;
                }

                const formAut = new FormData()
                formAut.append('name_view', this.$route.name)
                formAut.append('comentarios', "Se envia notificación a los jefes directos")
                formAut.append('id_afectado',this.incident_process_id)
                formAut.append('evento', 'Enviar notificación -> sendNotification()')

                this.$store.dispatch('auditoria/addEventAuditoria', formAut)
                this.btn_send_notification = false
                
              }else{
                this.$notify({
                    title:"Aviso",
                    message: "Ha ocurrido un error, intente de nuevo",
                    type:"warning",
                  });
              }
              this.btn_send_notification = false
            })
            .catch(error =>{
              console.log(error);
              this.btn_send_notification = false
              
              this.$notify({
                    title:"Aviso",
                    message: "Ha ocurrido un error, intente de nuevo",
                    type:"error",
                  });
            });
      },

    },
    filters:{  
      short_date(_date){
          return (moment(_date).format('DD-MM-YYYY')).toLocaleUpperCase();
      },
      short_date_generate(_date){
          return (moment(_date,'DD-MM-YYYY').format('DD-MM-YYYY')).toLocaleUpperCase();
      },
      short_date_select(_date){
          return (moment(_date).format('DD-MMM-YYYY'));
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
  