<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <h3>Autorizar Vacaciones</h3>
      </div>

      <el-row class="m-1" type="flex" justify="end">
        <el-col class="m-1 col-md-4 col-sm-12">
          <el-input placeholder="Buscar..." v-model="headers.search" @input="getList()"></el-input>
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
          </el-select>
        </el-col>
      </el-row>

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
          width="150">
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
          prop="start_date"
          width="250"
          label="Fechas">
          <template slot-scope="scope">
            <span><strong>Fecha inicio:</strong> {{scope.row.start_date}}</span><br>
            <span><strong>Fecha final:</strong> {{scope.row.end_date}}</span><br>
          </template>
        </el-table-column>
        <el-table-column
          prop="return_date"
          label="Fecha regreso"
          width="130">
        </el-table-column>
        <el-table-column
          prop="total_days"
          label="Dias otorgados"
          width="130">
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
          prop="document"
          label="Documento"
          width="120"
          align="center"
          >
          <template slot-scope="scope">
              <a v-if="scope.row.document" :href="scope.row.api_document" class="text-danger icon-document" target="_blank"><i class="fa-solid fa-file-pdf"></i></a>
          </template>
        </el-table-column>

        <el-table-column
          label="Acciones"
          width="120"

          >
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="Ver" placement="bottom">
              <el-button
                size="mini"
                type="success"
                circle
                @click="viewRecord(scope.row.id)">
                  <i class="el-icon-edit"></i>
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
      <view_record ref="viewVacationComponent" @listenChildComponent="getList"></view_record>
    </el-card>

  </div>

</template>

<script>

import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import view_record from './viewRecord.vue'
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
        search:""
      },
      loading_get_list:false,
    }
  },
  beforeMount() {
    this.getList();

  },
  created() {

  },

  methods: {
    async getList(_page = 1){
      this.headers.page = _page;
      this.loading_get_list= true;
      await Api.get('/rh/vacation/authorize-vacation-list',{
        params:this.headers
      })
      .then(response =>{

        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', "Autorizar Vacaciones")
        formAut.append('id_afectado',"")
        formAut.append('evento', 'Vacaciones -> getList()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        this.general_data = response.data
        this.loading_get_list = false
      })
      .catch(error =>{
        console.log('/rh/vacation/authorize-vacation-list',error);
        this.loading_get_list = false

      });

    },

    handleCurrentChange(val){
      this.getList(val);
    },

    async viewRecord(_id){
        this.fullscreenLoading = true;

        await Api.get("/rh/vacation/single/"+_id)
        .then(response =>{

            const formAut = new FormData()
            formAut.append('name_view', this.$route.name)
            formAut.append('comentarios', "Autorizar Vacaciones")
            formAut.append('id_afectado',_id)
            formAut.append('evento', 'Vacaciones -> viewRecord()')

            this.$store.dispatch('auditoria/addEventAuditoria', formAut)

            this.fullscreenLoading = false;
            this.$refs.viewVacationComponent._tempCreated({
              "record_data":response.data,
              "visible_modal":true,
              "permission_sign":true,
              "type_event":"list",
              "authorize_staff":true,
            });

        })
        .catch(error =>{
          this.fullscreenLoading = false;
          console.log("error => ","/rh/vacation/single/"+_id,error);
          this.$notify({
                title:"Aviso",
                message: "A ocurrido un error, intente de nuevo",
                type:"error",
              });
        });


        //orderSignatures

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

        if(item.signed_date != null  && item.order != 3){
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

</style>
