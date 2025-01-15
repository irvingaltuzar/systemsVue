<template>
    <div class="app-container">
      <el-card class="box-card" shadow="always">
        <div slot="header" class="clearfix">
          <h3>PROCESO DE INCIDENCIAS</h3>
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
            <el-row type="flex" class="mt-2 mb-3 section-title text-left">
                <el-col class="col-md-3 col-sm-12" >
                    <h5>Período a procesar</h5>
                </el-col>
            </el-row>
            <el-row class="m-1" type="flex">
              <el-col class="m-1 col-md-12 col-sm-12 text-danger">
                <span v-if="header_data.error.status == 1">{{ header_data.error.message }}</span>
              </el-col>
            </el-row>
              
            <el-row class="m-1" type="flex">
              <el-col class="m-1 col-md-4 col-sm-12">
                <el-date-picker
                      v-model="header_data.period"
                      type="daterange"
                      align="right"
                      start-placeholder="Fecha inicio"
                      end-placeholder="Fecha término"
                      format="dd-MM-yyyy"
                      value-format="yyyy-MM-dd"
                      :default-value="header_data.current_date"
                    >
                    </el-date-picker>
                    <span class="input-error">{{validate_header_data.period}}</span>
              </el-col>
              <el-col class="m-1 col-md-2 col-sm-12">
                <el-select
                  v-model="header_data.locations"
                  multiple
                  collapse-tags
                  filterable
                  allow-create
                  placeholder="Ubicación"
                >
                  <el-option
                    v-for="item in ubications"
                    :key="item.ubiccionId"
                    :label="item.descripcion"
                    :value="item.descripcion"
                  />
                </el-select>
                <span class="input-error">{{validate_header_data.locations}}</span>
              </el-col>
              <el-col class="m-1 col-md-2 col-sm-12">
                <el-select v-model="header_data.payment_period" placeholder="Periodo de pago">
                  <el-option
                    v-for="item in periods"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span class="input-error">{{validate_header_data.payment_period}}</span>
              </el-col>
              <el-col class="m-1 col-md-2 col-sm-12">
                <el-button :loading="btn_add_process == true" type="primary" @click="processIncident()">Procesar</el-button>
              </el-col>
            </el-row>
          </md-content>
        
          <md-content class="mt-5 m-3">
            <el-row type="flex" class="mt-2 mb-3 section-title text-left">
                <el-col class="col-md-2 col-sm-12" >
                    <h5>Lista</h5>
                </el-col>
                <!-- <el-col class="m-1 col-md-2 col-sm-12">
                  <el-input placeholder="Buscar empleado..." v-model="headers.search" @input="getList()"></el-input>
                </el-col>
                <el-col class="m-1 col-md-2 col-sm-12">
                  <el-select v-model="headers.order_by" placeholder="Estatus" @change="getList()">
                    <el-option label="Activo" value="desc"></el-option>
                    <el-option label="Descendente" value="asc"></el-option>
                  </el-select>
                </el-col>
                <el-col class="m-1 col-md-2 col-sm-12">
                  <el-select v-model="headers.order_by" placeholder="Ordenar" @change="getList()">
                    <el-option label="Ascendente" value="desc"></el-option>
                    <el-option label="Descendente" value="asc"></el-option>
                  </el-select>
                </el-col>
                <el-col class="m-1 col-md-2 col-sm-12">
                  <el-select v-model="headers.limit" placeholder="Mostrar" @change="getList()">
                    <el-option label="20" value="20"></el-option>
                    <el-option label="50" value="50"></el-option>
                    <el-option label="100" value="100"></el-option>
                    <el-option label="Todos" :value="general_data.total"></el-option>
                  </el-select>
                </el-col> -->
            </el-row>

            <el-table
              class="m-1"
              style="width: 100%"
              :data="general_data.data"
              v-loading="full_screen_loading">
              <el-table-column
                prop="id"
                label="Folio"
                width="60">
              </el-table-column>
              <el-table-column
                prop="status"
                label="Estatus"
                width="120">
                <template slot-scope="scope">
                  <el-tag type="success" v-if="scope.row.status == 'activo'">{{ scope.row.status.toUpperCase() }}</el-tag>
                  <el-tag type="info" v-if="scope.row.status == 'cerrado'">{{ scope.row.status.toUpperCase() }}</el-tag>
                  <el-tag type="danger" v-if="scope.row.status == 'cancelado'">{{ scope.row.status.toUpperCase() }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="start_date"
                label="Fechas"
                width="160">
                <template slot-scope="scope">
                  <strong>Inicio:</strong> <span>{{ scope.row.start_date }}</span><br>
                  <strong>Fin:</strong> <span>{{ scope.row.end_date }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="locations"
                label="Ubicaciones"
                width="150">
                <template slot-scope="scope">
                  {{ scope.row.locations.toUpperCase() }}
                </template>
              </el-table-column>
              <el-table-column
                prop="payment_period"
                label="Período de pago"
                width="105">
                <template slot-scope="scope">
                  {{ scope.row.payment_period.toUpperCase() }}
                </template>
              </el-table-column>
              <el-table-column
                prop="rfc_generated"
                label="Generado por">
                <template slot-scope="scope">
                  <span v-if="scope.row.personal_intelisis != null">{{ scope.row.personal_intelisis.full_name }}</span>
                  <span v-else>Historíco</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="observations"
                label="Observaciones"
                width="180">
                <template slot-scope="scope">
                  <el-collapse accordion v-if="scope.row.observations != null">
                    <el-collapse-item name="1">
                      <template slot="title" class="p-1">
                        <h5>&nbsp;<i class="fas fa-plus text-primary"></i></h5>
                      </template>
                      <div class="m-1">
                        {{ scope.row.observations }}
                      </div>
                    </el-collapse-item>
                  </el-collapse>
                  
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="Acciones">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="Ver" placement="bottom">
                    <el-button
                      size="mini"
                      type="info"
                      circle
                      @click="viewRecord(scope.row.id)">
                        <i class="el-icon-view"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip v-if="scope.row.status == 'activo'" class="item" effect="dark" content="Cerrar" placement="bottom">
                    <el-button
                      size="mini"
                      type="success"
                      circle
                      @click="closeRecord(scope.row.id)">
                        <i class="fas fa-lock"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip v-if="scope.row.status == 'activo'" class="item" effect="dark" content="Cancelar" placement="bottom">
                    <el-button
                      size="mini"
                      type="danger"
                      circle
                      @click="cancelRecord(scope.row.id)">
                        <i class="fas fa-close"></i>
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
  
    </div>
  
  </template>
  
  <script>
  
  import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
  import { mapGetters} from 'vuex'
  import Swal from 'sweetalert2'
  import '@/styles/global_styles.css'
  import moment from 'moment'
  import { deepClone } from '@/utils'
  
  export default {
    name: 'ProcesoDeIncidencias',
    components: {

    },
    data() {
      return {
        general_data:{},
        headers:{
          limit:20,
          page:1,
          order_by:'desc',
          search:""
        },
        header_data:{
          current_date:new Date(),
          period:[],
          locations:[],
          payment_period:null,
          error:{
            status:0,
            message:"",
          }

        },
        validate_header_data:{
          period:null,
          locations:null,
          payment_period:null,
        },
        btn_add_process:false,
        start_date:null,
        end_date:null,
        ubications: [],
        periods:[
          {
            value:"semanal",
            label:"Semanal"
          },
          {
            value:"quincenal",
            label:"Quincenal"
          }
        ],
        full_screen_loading:false,
      }
    },
    beforeMount() {
    },
    created() {

      this.getUbications();
      this.getList();

    },
    mounted(){
      
    },
    methods: {
      async getList(_page = 1){
        this.headers.page = _page;
        this.full_screen_loading= true;
        await Api.get('/rh/incident-process/list',{
          params:this.headers
        })
        .then(response =>{

          const formAut = new FormData()
          formAut.append('name_view', this.$route.name)
          formAut.append('comentarios', "Procesos de incidencias")
          formAut.append('id_afectado',"")
          formAut.append('evento', 'Procesos de incidencias -> getList()')

          this.$store.dispatch('auditoria/addEventAuditoria', formAut)
          this.general_data = response.data.data
          this.full_screen_loading = false
        })
        .catch(error =>{
          console.log(error);
          this.full_screen_loading = false

        });

      },

      async getUbications() {
        this.full_screen_loading = true
        const currentObj = this
        await Api.get('/controlAsistencia/getUbications').then(res => {
          currentObj.data = res.data
          this.ubications = res.data
          this.full_screen_loading = false
        }).catch(function(error) {
          currentObj.error = error
          console.log(error)
          this.full_screen_loading = false
        })
      },

      async processIncident(){

        let validate_form = this.validateFormProcessIncident();
        let ths = this;
        if(validate_form == true){
          let fechas=[
            moment(this.header_data.period[0]).format("yyyy-MM-DD"),
            moment(this.header_data.period[1]).format("yyyy-MM-DD"),
          ];

          ths.btn_add_process = true;
          const currentObj = this
          await Api.post('/rh/incident-process/add',{
              fechas:fechas[0]+","+fechas[1],
              ubications:this.header_data.locations.toString(),
              payment_period:this.header_data.payment_period,
          }).then(response => {

            if(response.data.success == 1){
              this.header_data.error.status=0;
              this.header_data.error.message="";
              this.getList();

              this.$notify({
                title:"Excelente",
                message: "Se ha generado correctamente el Proceso.",
                type:"success",
              });

            }else{
              this.header_data.error.status=1;
              this.header_data.error.message=response.data.message;
            }
            
            const formAut = new FormData()
            formAut.append('name_view', this.$route.name)
            formAut.append('comentarios', "Procesos de incidencias")
            formAut.append('id_afectado',"")
            formAut.append('evento', 'Generar nuevo proceso de incidencias -> processIncident()')

            

            this.$store.dispatch('auditoria/addEventAuditoria', formAut)

            ths.btn_add_process = false
          }).catch(function(error) {
            currentObj.error = error
            console.log(error)
            ths.btn_add_process = false
            
            this.$notify({
                  title:"Aviso",
                  message: "Ha ocurrido un error, intente de nuevo",
                  type:"error",
                });
          });

        }
      },

      closeRecord(_id){

        Swal.fire({
          title: 'Está seguro que desea cerrar el proceso?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cancelar!'
        }).then((result) => {
          if (result.isConfirmed) {

            this.full_screen_loading= true;
            
            Api.post(`/rh/incident-process/close/${_id}`)
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

      cancelRecord(_id){

        Swal.fire({
          title: 'Está seguro que desea cancelar el proceso?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, cancelar!'
        }).then((result) => {
          if (result.isConfirmed) {

            this.full_screen_loading= true;
            
            Api.post(`/rh/incident-process/cancel/${_id}`)
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

      validateFormProcessIncident(){

        let cont=0;

        if(this.header_data.period.length >= 2){
          this.validate_header_data.period = null;
        }else{
          this.validate_header_data.period= "Seleccione un período.";
          cont++;
        }

        if(this.header_data.locations.length > 0){
          this.validate_header_data.locations = null;
        }else{
          this.validate_header_data.locations= "Seleccione una o más ubicaciones.";
          cont++;
        }

        if(this.header_data.payment_period != null){
          this.validate_header_data.payment_period = null;
        }else{
          this.validate_header_data.payment_period= "Seleccione un período de pago.";
          cont++;
        }

        console.log("cont", cont);

        if(cont == 0){
          return true
        }else{
          return false
        }


      },

      viewRecord(_id){

        this.$router.push({path:`/rh/cai/proceso-de-incidencias/single/${_id}`});

      }

    },
    filters:{  
      short_date(_date){
        return (moment(_date).format('DD-MMM-YYYY')).toLocaleUpperCase();
      }
    },
    computed:{
      
    }

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
  