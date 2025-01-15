<template>
  <div class="page-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix text-center">
        <h3>Presentación de la contabilidad electrónica</h3>
      </div>
      <div slot="header" class="clearfix text-end">
        <create-e-accounting-component />
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

      <el-table class="m-1" style="width: 100%" :data="general_data.data" v-loading="loading_get_list">
        <el-table-column fixed type="index" width="50" />
        <el-table-column prop="work_station_name" label="Se lleva en" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="text-align:center">{{ scope.row.company.work_station_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="business_name" label="Empresa" width="180" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="text-align:center">{{ scope.row.company.business_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="manager_name" label="Gerente" width="180" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="text-align:center;word-break:break-word">{{ scope.row.company.manager_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountant_name" label="Contador" width="180" header-align="center" align="center">
            <template slot-scope="scope">
              <span style="text-align:center;word-break:break-word">{{ scope.row.company.accountant_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="electronic_accounting.status_name" label="Estatus" width="180" header-align="center" align="center">
            <template slot-scope="scope">
              <span style="text-align:center;word-break:break-word">{{ scope.row.status_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="electronic_accounting.date" label="Fecha" width="180" header-align="center" align="center">
            <template slot-scope="scope">
              <span style="text-align:center;word-break:break-word">{{ scope.row.date | moment('ddd Do MMM YYYY') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="electronic_accounting.id_transaction_receipt" label="Número de operación" width="180" header-align="center" align="center">
            <template slot-scope="scope">
              <span style="text-align:center;word-break:break-word;color:red">{{ scope.row.id_transaction_receipt | moment('ddd Do MMM YYYY') }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-table>
      <br>
      <el-row class="m-3" type="flex" justify="center">
          <el-pagination :page-size="headers.limit" :pager-count="9" layout="prev, pager, next" :total="general_data.total" @current-change="handleCurrentChange" >
          </el-pagination>
        </el-row>

      <br>
    </el-card>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Api from '@/store/modules/Api'
import moment from 'moment'

export default {
  name: 'AddEAccountingComponent',
  data: () => ({
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
  }),
  beforeMount() {
    this.getList();
  },
  created() {
  },
  watch: {
      'has_change'(value) {
        this.getList();
        setTimeout(() => {
            this.changeValue()
          }, 50)
      },
    },
  methods: {
    ...mapMutations('accounting', ['changeValue']),
    async getList(_page = 1){
      this.headers.page = _page;
      this.loading_get_list= true;
      await Api.get('/accounting/fetch-e-accounting',{
        params:this.headers
      })
      .then(response =>{
        this.general_data = response.data
        this.loading_get_list= false
      })
      .catch(error =>{
        console.log(error," => ",'/accounting/fetch-e-accounting');
        this.loading_get_list= false
      });

    },
    handleCurrentChange(val){
      this.getList(val);
    },
    deleteRow(id) {
      Api.post('/accounting/companies/delete', {
        company_id: id
      })
        .then(res => {
          this.getElectronicAccounting()
          this.$notify({
            title: 'Realizado',
            message: 'Empresa eliminada correctamente',
            type: 'success'
          })
        })
        .catch(error => {
          this.$notify({
            title: 'Oops!',
            message: 'Ha ocurrido un error, intente nuevamente!',
            type: 'error'
          })
          this.v = new Object()
          setTimeout(() => {
            this.v = error.response.data.errors
          }, 50)
        })
        .finally(() => {
        })
    }
  },
  computed: {
    ...mapState('accounting', ['has_change']),
    is_now() {
      return moment().utc()
    }
  },
  filters: {
    law(value) {
      return value ? 'Si' : 'No'
    }
  }
}
</script>

<style lang="scss" scoped>
	.md-table + .md-table {
		margin-top: 16px;
	}
	.avatar img {
		max-width: 30px;
	}

	.align-tooltip {
		min-width: 35px;
	}

  .action-design {
    color: red !important;
    cursor: pointer;
  }

</style>
