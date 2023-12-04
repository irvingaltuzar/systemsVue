<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <el-row type="flex" justify="end">
          <el-col class="m-1 col-md-10 col-sm-12">
            <h3>Precierres Fiscales</h3>
          </el-col>
          <el-col class="m-1 col-md-2 col-sm-12 text-right">
            <el-button type="success" @click="viewModal()"> <i class="fa-solid fa-circle-plus"></i></el-button>
          </el-col>
        </el-row>
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

      <el-row class="m-1" type="flex" justify="end">
        <el-col class="m-1 col-md-2 col-sm-12" >
          <el-select v-model="headers.month" placeholder="Mes" @change="getList()">
            <el-option label="Enero" value="01"></el-option>
            <el-option label="Febrero" value="02"></el-option>
            <el-option label="Marzo" value="03"></el-option>
            <el-option label="Abril" value="04"></el-option>
            <el-option label="Mayo" value="05"></el-option>
            <el-option label="Junio" value="06"></el-option>
            <el-option label="Julio" value="07"></el-option>
            <el-option label="Agosto" value="08"></el-option>
            <el-option label="Septiembre" value="09"></el-option>
            <el-option label="Octubre" value="10"></el-option>
            <el-option label="Noviembre" value="11"></el-option>
            <el-option label="Diciembre" value="12"></el-option>
            <el-option label="Anual" value="00"></el-option>
          </el-select>
        </el-col>
        <el-col class="m-1 col-md-2 col-sm-12" >
          <el-input placeholder="Año" v-model="headers.year" @input="getList()"></el-input>
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
            prop="work_station_name"
            label="Ubicación"
            width="120">
            <template slot-scope="scope">
              <span class="label">{{scope.row.accounting_companies.work_station_name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="Empresa"
            width="280">
              <template slot-scope="scope">
                <span class="label">{{scope.row.accounting_companies.business_name}} ({{scope.row.accounting_companies.erp_name}})</span>
              </template>
          </el-table-column>
          <el-table-column
            prop="start_date"
            width="180"
            label="Gerente">
            <template slot-scope="scope">
              <span class="label">{{scope.row.accounting_companies.manager_name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="return_date"
            label="Contador"
            width="180">
            <template slot-scope="scope">
              <span class="label">{{scope.row.accounting_companies.accountant_name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="month"
            label="Mes"
            width="50">
            <template slot-scope="scope">
              <span class="label">{{scope.row.month | getNameMonth}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="accounting_utility"
            label="Utilidad Contable"
            width="140"
            align="center">
            <template slot-scope="scope">
             <span class="label">{{scope.row.accounting_utility}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="tax_utility"
            label="Utilidad Fiscal"
            width="135"
            align="center">
            <template slot-scope="scope">
              <span class="label">{{scope.row.tax_utility}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="comments"
            label="Comentarios"
            width="200">
            <template slot-scope="scope">
              <span class="label">{{scope.row.comments}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Acciones"
            width="100"
            fixed="right"
            >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="Editar" placement="bottom">
                <el-button
                  size="mini"
                  type="primary"
                  circle
                  @click="editRecord(scope.row.id)">
                    <i class="fa-solid fa-pencil"></i>
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
    </el-card>
    <add_record ref="addMonthlyClosure"  @listenChildComponent="getList" ></add_record>
  </div>

</template>

<script>

import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import Swal from 'sweetalert2'
import moment from 'moment'
import '@/styles/global_styles.css'
import add_record from './addRecord.vue'

export default {
  name: 'TableSearch',
  components: {
    add_record
  },
  data() {
    return {
      general_data:{},
      headers:{
        limit:20,
        page:1,
        order_by:'desc',
        search:"",
        month:moment(new Date()).format('MM'),
        year:moment(new Date()).format('YYYY'),
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
      await Api.get('/accounting/fiscal-preclosing/list',{
        params:this.headers
      })
      .then(response =>{

        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', "Visualización de Precierre Fiscal")
        formAut.append('id_afectado',"")
        formAut.append('evento', 'Precierre Fiscal -> getList()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        this.general_data = response.data
        this.loading_get_list= false
      })
      .catch(error =>{
        console.log(error," => ",'/accounting/fiscal-preclosing/list');
        this.loading_get_list= false

      });

    },

    handleCurrentChange(val){
      this.getList(val);
    },

    /* *************************************************** */
    async editRecord(_id){
        this.loading_get_list= true;

        await Api.get("/accounting/fiscal-preclosing/single/"+_id)
        .then(response =>{
            this.loading_get_list= false;
            this.$refs.addMonthlyClosure._tempCreated({
              "visible_modal":true,
              "type_event":"edit",
              "record":response.data.data
            });

        })
        .catch(error =>{
          this.loading_get_list= false;
          console.log("error => ","/accounting/fiscal-preclosing/single/"+_id,error);
          this.$notify({
                title:"Aviso",
                message: "A ocurrido un error, intente de nuevo",
                type:"error",
              });
        });


        //orderSignatures

    },


    /* *************************************************** */

    viewModal(){
      this.$refs.addMonthlyClosure._tempCreated({"visible_modal":true});
    },



  },
  filters:{
    getNameMonth(_month){
      let months = ["Anual","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
      return months[_month];
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
