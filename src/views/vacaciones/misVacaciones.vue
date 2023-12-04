<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <h3>Mis Vacaciones</h3>
      </div>

      <el-row class="m-1" type="flex" justify="end">
        <el-col class="m-1 col-md-4 col-sm-12">
          <el-input placeholder="Buscar..." v-model="headers.search" @input="getList()"></el-input>
        </el-col>
        <el-col class="m-1 col-md-2 col-sm-12" >
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
          width="200"

          >
          <template slot-scope="scope">

            <el-tooltip v-if="scope.row.status == 'solicitado'" class="item" effect="dark" content="Ver" placement="bottom">
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

            <el-tooltip v-if="scope.row.status != 'cancelado' && scope.row.status != 'rechazado'" class="item" effect="dark" content="Cancelar" placement="bottom">
              <el-button
                size="mini"
                type="danger"
                circle
                @click="cancelRecord(scope.row.id)">
                  <i class="el-icon-close"></i>
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
import Swal from 'sweetalert2'
import view_record from './viewRecord'
import '@/styles/global_styles.css'
import moment from 'moment'

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
      await Api.get('/rh/vacation/list',{
        params:this.headers
      })
      .then(response =>{

        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', "Mis Vacaciones")
        formAut.append('id_afectado',"")
        formAut.append('evento', 'Vacaciones -> getList()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        this.general_data = response.data
        this.loading_get_list = false
        console.log(this.general_data);
      })
      .catch(error =>{
        console.log(error);
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
            formAut.append('comentarios', "Visualización de Vacaciones")
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

    cancelRecord(_id){

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

          this.fullscreenLoading = true;
          Api.get("/rh/vacation/cancel/"+_id)
          .then(response =>{

            if(response.data.success == 1){
              const formAut = new FormData()
              formAut.append('name_view', this.$route.name)
              formAut.append('comentarios', "Mis Vacaciones")
              formAut.append('id_afectado',_id)
              formAut.append('evento', 'Vacaciones -> cancelRecord()')

              this.$store.dispatch('auditoria/addEventAuditoria', formAut)

              this.$notify({
                  title:"Cancelado!",
                  message: "Ha sido cancelado correctamente.",
                  type:"success",
                });

            }else if(response.data.success == 2){
              this.$notify({
                  title:"Alerta!",
                  message: response.data.message,
                  type:"warning",
                });
            }else{
              this.$notify({
                  title:"Error!",
                  message: response.data.message,
                  type:"error",
                });
            }

            this.fullscreenLoading = false;
            this.getList();


          })
          .catch(error =>{
            this.fullscreenLoading = false;
            console.log(error,"/rh/vacation/cancel/"+_id);
            this.$notify({
                  title:"Aviso",
                  message: "A ocurrido un error, intente de nuevo",
                  type:"error",
                });
          });


        }
      })




    },

    printDocument(_id){
      window.open(process.env.VUE_APP_API_URL+'/rh/vacation/print-document/'+_id, '_blank')
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

        if(item.signed_date != null && item.order != 3){
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
