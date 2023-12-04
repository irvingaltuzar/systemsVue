<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <h3>Reporte General</h3>
      </div>

      <el-row class="m-1">
        <el-col class="m-1 col-md-2 col-sm-12">
          <el-input placeholder="Buscar..." v-model="headers.search" @input="getList()"></el-input>
        </el-col>
        <el-col class="m-1 col-md-2 col-sm-12">
          <div class="block">
            <el-date-picker
              v-model="headers.start_date"
              type="date"
              placeholder="Del"
              @change="getList()"
              >
            </el-date-picker>
          </div>
        </el-col>
        <el-col class="m-1 col-md-2 col-sm-12">
          <div class="block">
            <el-date-picker
              v-model="headers.end_date"
              type="date"
              placeholder="Al"
              @input="getList()">
            </el-date-picker>
          </div>
        </el-col>
        <el-col class="m-1 col-md-2 col-sm-12">
          <el-select v-model="headers.type_permit" placeholder="Tipo de permiso" @change="getList()">

            <el-option v-for="item in type_permit_list" :key="item.id" :label="item.description" :value="item.id"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row class="m-1">
        <el-col class="m-1 col-md-2 col-sm-12">
          <el-select v-model="headers.status" placeholder="Estatus" @change="getList()">
            <el-option label="Solicitado" value="solicitado"></el-option>
            <el-option label="Rechazado" value="rechazado"></el-option>
            <el-option label="Autorizado" value="autorizado"></el-option>
            <el-option label="Cancelado" value="cancelado"></el-option>
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
        </el-col>
        <el-col class="m-1 col-md-2 col-sm-12 d-flex">
          <div class="block">
            <el-tooltip class="item" effect="dark" content="Limpiar" placement="bottom">
              <el-button type="warning" circle @click="clearHeaders()"><i class="fa-solid fa-trash"></i></el-button>
            </el-tooltip>
          </div>
        </el-col>
        <el-col class="m-1 col-md-1 col-sm-12 d-flex">
          <div class="block">
            <el-tooltip class="item" effect="dark"  content="Generar reporte" placement="bottom">
              <el-button v-if="loading_get_list == false" type="success" @click="generalreport_excel()"><i class="fa-solid fa-file-excel"></i> Generar reporte</el-button>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>

      <br>
      <br>

      <el-table
        class="m-1"
        style="width: 100%"
        :data="general_data.data"
        v-loading="loading_get_list">
        <el-table-column
          prop="id"
          label="Folio"
          width="70">
        </el-table-column>
        <el-table-column
          prop="date_request"
          label="Fecha de solicitud"
          width="90">
        </el-table-column>
        <el-table-column
          prop="status"
          label="Estatus"
          width="100">
            <template slot-scope="scope">
              <span v-bind:class="'status-'+scope.row.status">{{scope.row.status}}</span>
            </template>
        </el-table-column>
        <el-table-column
          prop="personal_intelisis_id"
          label="Empleado"
          width="250">
          <template slot-scope="scope">
            <span v-if="scope.row.personal_intelisis != null" class="label">{{scope.row.personal_intelisis.name}} {{scope.row.personal_intelisis.last_name}}</span>
            <span v-else class="label">Histórico</span>
          </template>
        </el-table-column>
        <el-table-column
          label="Tipo de permiso"
          width="250">
          <template slot-scope="scope">
            <span>{{scope.row.type_permit.description}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="reason"
          label="Motivo"
          width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.dmirh_permit_concepts_id == null">{{scope.row.reason}}</span>
            <span v-else>{{scope.row.permit_concept.description}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="Última firma"
          width="200">
          <template slot-scope="scope">
            <span class="digital-sign">{{ scope.row.signatures | end_signature}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="start_date"
          width="150"
          label="Fechas">
          <template slot-scope="scope">
            <span><strong>Del:</strong> {{scope.row.start_date}}</span><br>
            <span><strong>Al:</strong> {{scope.row.end_date}}</span><br>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="Fecha de creación"
          width="160">
        </el-table-column>
        <el-table-column
          prop="document"
          label="Documento"
          width="120"
          align="center"
          >
          <template slot-scope="scope">
              <a v-if="scope.row.document != null" :href="scope.row.api_document" class="text-danger icon-document" target="_blank"><i class="fa-solid fa-file-pdf"></i></a>
          </template>
        </el-table-column>

        <el-table-column

          label="Acciones"
          width="120"
          >
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.document == null" class="item" effect="dark" content="Ver" placement="bottom">
              <el-button
                size="mini"
                type="info"
                circle
                @click="viewRecord(scope.row.id)">
                  <i class="el-icon-view"></i>
              </el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="Imprimir" placement="bottom">
              <el-button
                size="mini"
                type="warning"
                circle
                @click="printDocument(scope.row.id)">
                  <i class="fa-solid fa-print"></i>
              </el-button>
            </el-tooltip>

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
      <view_record ref="viewWorkPermitComponent" @listenChildComponent="getList"></view_record>
			<export-json-excel :data="report_excel.data" :fields="report_excel.headers" worksheet="reporte" :name="report_excel.file_name" id="json-excel" class="d-none"></export-json-excel>

    </el-card>

  </div>

</template>

<script>

import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import view_record from '../SolicitarPermisos/viewRecord'
import moment from 'moment'
import '@/styles/global_styles.css'

export default {
  name: 'TableSearch',
  components: {
    view_record,
  },
  data() {
    return {
      general_data:{},
      headers:{
        limit:20,
        page:1,
        order_by:'desc',
        search:"",
        start_date:"",
        end_date:"",
        type_permit:"",
        status:"",
      },
      type_permit_list:[],
      loading_get_list:false,
      report_excel:{
        data:[],
        headers:[
          {
            'title': '#',
            'name': 'index',
          },
          {
            'title': 'Folio',
            'name': 'id',
          },
          {
            'title': 'Fecha de solicitud',
            'name': 'date_request',
          },
          {
            'title': 'Estatus',
            'name': 'status',
          },
          {
            'title': 'No. Empleado',
            'name': 'personal_id',
          },
          {
            'title': 'Empleado',
            'name': 'employee',
          },
          {
            'title': 'Empresa',
            'name': 'company_name',
          },
          {
            'title': 'Tipo de permiso',
            'name': 'type_permit',
          },
          {
            'title': 'Motivo',
            'name': 'reason',
          },
          {
            'title': 'Días',
            'name': 'total_days',
          },
          {
            'title': 'Fecha inicio',
            'name': 'start_date',
          },
          {
            'title': 'Fecha final',
            'name': 'end_date',
          },
          {
            'title': 'Fecha de regreso',
            'name': 'return_date',
          },
          {
            'title': 'Comentarios',
            'name': 'comments',
          },
          {
            'title': 'Fecha de creación',
            'name': 'created_at_date',
          },
        ],
        file_name:"",
      }
    }
  },
  beforeMount() {

  },
  created() {
    this.getList();
    this.getTypePermit();

  },

  methods: {
    async getList(_page = 1){
      this.headers.page = _page;
      this.loading_get_list= true;
      await Api.get('/rh/work-permits/general-report',{
        params:this.headers
      })
      .then(response =>{

        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', "Reporte General")
        formAut.append('id_afectado',"")
        formAut.append('evento', 'Permisos -> getList()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        this.general_data = response.data
        this.loading_get_list = false
      })
      .catch(error =>{
        console.log('/rh/work-permits/general-report',error);
        this.loading_get_list = false

      });

    },

    async getTypePermit(){
      this.loading_get_list= true;

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
        this.loading_get_list = false;

      })
      .catch(error =>{
        this.loading_get_list = false;
        this.$notify({
            title: 'Error',
            message: 'Error al conectarse con el servidor, vuelva a intentarlo de nuevo',
            type: 'error'
          });
        console.log('request error => /rh/work-permits/type-permit-list',error);

      });

    },

    generalreport_excel(){

      let employee="";
      let personal_id="";
      let company_name="";

      this.general_data.data.forEach((permit,index) =>{

        if(permit.personal_intelisis != null){
          employee = permit.personal_intelisis.name+" "+permit.personal_intelisis.last_name
        }else{
          employee = `Histórico (${permit.personal_intelisis_usuario_ad})`
        }

        if(permit.personal_intelisis != null){
          personal_id = permit.personal_intelisis.personal_id
        }else{
          personal_id = "Histórico"
        }

        if(permit.personal_intelisis != null){
          company_name = permit.personal_intelisis.company_name
        }else{
          company_name = "Histórico"
        }

        this.report_excel.data.push({
          "index" :index+1,
          "id": permit.id,
          "date_request" : permit.date_request,
          "status" : permit.status,
          "personal_id" : personal_id,
          "employee" : employee,
          "company_name" : company_name,
          "type_permit" : permit.type_permit.description,
          "reason" : permit.dmirh_permit_concepts_id != null ? permit.permit_concept.description : permit.reason,
          "total_days" : permit.total_days,
          "start_date" : permit.start_date,
          "end_date" : permit.end_date,
          "return_date" : permit.return_date,
          "comments" : permit.comments,
          "created_at_date" : permit.created_at,
        });
      });

      this.report_excel.file_name = "reporte_permisos_de_trabajo_"+(moment(new Date()).format('YYYYMMDD_hhmmss'));
			document.querySelector('#json-excel').click();

      const formAut = new FormData()
      formAut.append('name_view', this.$route.name)
      formAut.append('comentarios', "Reporte General - Archivo generado: "+this.report_excel.file_name)
      formAut.append('id_afectado',"")
      formAut.append('evento', 'Permisos -> generalreport_excel()')

      this.$store.dispatch('auditoria/addEventAuditoria', formAut)

    },

    clearHeaders(){
      this.headers={
        limit:20,
        page:1,
        order_by:'desc',
        search:"",
        start_date:"",
        end_date:"",
        status:"",
      };

      this.getList()
    },

    handleCurrentChange(val){
      this.getList(val);
    },

    async viewRecord(_id){
        this.loading_get_list = true;

        await Api.get("/rh/work-permits/single/"+_id)
        .then(response =>{
            const formAut = new FormData()
            formAut.append('name_view', this.$route.name)
            formAut.append('comentarios', "Reporte General")
            formAut.append('id_afectado',_id)
            formAut.append('evento', 'Permisos -> viewRecord()')

            this.$store.dispatch('auditoria/addEventAuditoria', formAut)

            this.loading_get_list = false;
            this.$refs.viewWorkPermitComponent._tempCreated({
              "work_permit":response.data,
              "visible_modal":true,
              "permission_sign":false,
              "type_event":"list",
              "authorize_staff":false,
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


        //orderSignatures

    },

    printDocument(_id){
      window.open(process.env.VUE_APP_API_URL+'/rh/work-permits/print-document/'+_id, '_blank')
    },


  },
  filters:{

    end_signature(_signatures){

      let end_signature = "";
      let sign = null;
      for (const item of _signatures) {
        if(item.status == "rechazado"){
          sign = item;
          break;
        }

        if(item.signed_date != null && item.order != 3 && item.is_automatic == 0){
          sign = item;
        }
      }

      if(sign != null){
        if(sign.personal_intelisis != null){
          end_signature = sign.personal_intelisis.name +" "+sign.personal_intelisis.last_name +" - "+(moment(sign.signed_date).format('DD-MM-YYYY H:m:s'));
        }else{
          end_signature = "Histórico";
        }

      }else{
        end_signature="Sin firmas";
      }

      return end_signature;
    }

  },
}
</script>

<style lang="scss" scoped>
.el-input .el-select{
    width: 110px;
  }
</style>
