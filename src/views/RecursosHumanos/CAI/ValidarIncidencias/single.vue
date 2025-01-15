<template>
    <div class="app-container">
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <h3>
            Validar Incidencias
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
          
          <md-content class="m-3">
            
            <el-row type="flex" class="mt-2 ">
              <el-col class="col-md-3 col-sm-12">
                <el-button type="primary" round @click="addMultipleJustification()"><i class="fas fa-calendar-plus"></i> &nbsp; Justificación multiple</el-button><br>
                <span class="text-danger" v-if="count_selected_incident > 0">Seleccione uno o más registros</span>
              </el-col>
              <el-col class="col-md-6 col-sm-12 text-right">
                <el-input  suffix-icon="el-icon-search" v-model="search" placeholder="Buscar colaborador"/>
              </el-col>
              <el-col class="col-md-3 col-sm-12" style="display:contents;">
                <i class="fa-solid fa-filter mr-1 text-secondary" style="align-items: center; display: flex;"></i>
                <el-select v-model="headers.status" placeholder="Estatus" @change="getList()"
                >
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
              class="mt-4 m-1"
              style="width: 100%"
              :data="incident_process_detail.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
              v-loading="full_screen_loading"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
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
                    {{ scope.row.date_incident | short_date }}
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
                width="120">
                <template slot-scope="scope">
                  <el-tooltip v-if="(scope.row.status == 'Tolerancia' || scope.row.status == 'Retardo' || scope.row.status == 'Suspensión' || scope.row.status == 'Falta injustificada') && scope.row.dmirh_personal_justification_id == null" class="item" effect="dark" content="Justificar" placement="bottom">
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

    </div>
  </template>
  
  <script>
  
  import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
  import { mapGetters} from 'vuex'
  import Swal from 'sweetalert2'
  import '@/styles/global_styles.css'
  import moment from 'moment'
  import { deepClone } from '@/utils'
  import modalJustification from "./modalJustification"
  
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
        incident_process_detail:{},
        incident_process_id:this.$route.params.id,
        full_screen_loading:false,
        search:"",
        visible_modal:false,
        selected_incident:[],
        count_selected_incident:0,
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
        ]
      }
    },
    beforeMount() {
    },
    created() {
      this.getList();
    },
    computed: {

    },
    methods: {
      async getList(){

        this.full_screen_loading= true;
        await Api.get(`/rh/incident-process/validate-incident/list`,{
          params:{
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
          this.incident_process_detail = response.data.data
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

      /* async addJustificationIncident(){

        this.form_justification.btn_add_justification = true
        const currentObj = this
        await Api.post('/rh/incident-process/validate-incident/add-justification',this.form_justification).then(response => {
          if(response.data.success == 1){
            this.getList();

            this.$notify({
              title:"Excelente",
              message: "Se ha justificado la incidencia correctamente.",
              type:"success",
            });
            this.visible_modal=false;

          }else{
            this.$notify({
              title:"Aviso",
              message: response.data.message,
              type:"warning",
            });
          }
          
          const formAut = new FormData()
          formAut.append('name_view', this.$route.name)
          formAut.append('comentarios', "Justificacion de incidencia")
          formAut.append('id_afectado',this.form_justification.incident_process_id)
          formAut.append('evento', 'Se justifico una incidencia -> processIncident()')

          this.$store.dispatch('auditoria/addEventAuditoria', formAut)

          this.form_justification.btn_add_justification = false
          
        }).catch(function(error) {
          currentObj.error = error
          console.log(error)
          this.form_justification.btn_add_justification = false
          
          this.$notify({
                title:"Aviso",
                message: "Ha ocurrido un error, intente de nuevo",
                type:"error",
              });
        })
      }, */

      handleSelectionChange(val){
        this.selected_incident = val;
      },

      async addMultipleJustification(){

        if(this.selected_incident.length > 0){
          this.count_selected_incident=0;

          await Swal.fire({
            title: 'Estas seguro que desea justificar los elementos seleccionados?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, justificar!'
          }).then((result) => {
            if (result.isConfirmed) {
               Api.post('/rh/incident-process/validate-incident/add-multiple-justification',{rows:this.selected_incident}).then(response => {
                if(response.data.success == 1){

                 
                  this.$notify({
                    title:"Excelente",
                    message: "Se justificaron "+response.data.data.count_justified+" de un total de "+response.data.data.incidents_total,
                    type:"success",
                  });

                  this.getList();

                }else{
                  this.$notify({
                    title:"Aviso",
                    message: response.data.message,
                    type:"warning",
                  });
                }
                
                const formAut = new FormData()
                formAut.append('name_view', this.$route.name)
                formAut.append('comentarios', "Justificacion de incidencia")
                formAut.append('id_afectado',null)
                formAut.append('evento', 'Se agregaron multiples justificaciones -> addMultipleJustification()')

                this.$store.dispatch('auditoria/addEventAuditoria', formAut)
                
              }).catch(function(error) {
                console.log(error)
                
                this.$notify({
                      title:"Aviso",
                      message: "Ha ocurrido un error, intente de nuevo",
                      type:"error",
                    });
              })
            }
          })


        }else{
          this.count_selected_incident++;
        }
      }

    },
    filters:{  
      short_date(_date){  
        return (moment(_date).format('DD-MM-YYYY')).toLocaleUpperCase();
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
  