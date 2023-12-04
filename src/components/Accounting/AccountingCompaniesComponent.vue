<template>
  <div class="page-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix text-center">
        <h3>Empresa - Gerente - Contador</h3>
      </div>
      <div slot="header" class="clearfix text-end">
        <create-accounting-company-component />
      </div>

      <el-row class="m-1" type="flex" justify="end">
        <el-col class="m-1 grid-content" :md="6" :xs="24">
          <el-input v-model="headers.search" placeholder="Buscar..." @input="headerSearch(headers.search)" />
        </el-col>
        <el-col class="m-1" :md="4" :xs="24">
          <el-select v-model="tmp_order" placeholder="Ordenar">
            <el-option label="Ascendente" value="asc" />
            <el-option label="Descendente" value="desc" />
          </el-select>
        </el-col>
        <el-col class="m-1" :md="4" :xs="24">
          <el-select v-model="tmp_limit" placeholder="Mostrar">
            <el-option label="20" value="20" />
            <el-option label="50" value="50" />
            <el-option label="100" value="100" />
          </el-select>
        </el-col>
      </el-row>

      <br>

      <el-table v-loading="loading_get_list" class="m-1" style="width: 100%" :data="accounting_companies.data">
        <el-table-column fixed type="index" width="50" />
        <el-table-column prop="work_station_name" label="Se lleva en" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="text-align:center">{{ scope.row.work_station_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="business_name" label="Empresa" width="180" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="text-align:center">{{ scope.row.business_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="has_law" label="Ley Antilavado" width="122" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="text-align:center">{{ scope.row.has_law | law }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="manager_name" label="Gerente" width="180" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="text-align:center;word-break:break-word">{{ scope.row.manager_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountant_name" label="Contador" width="180" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="text-align:center;word-break:break-word">{{ scope.row.accountant_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Acciones" width="120" header-align="center" align="center" class="display-button">
          <template slot-scope="scope">
            <div class="align" style="display: inline-flex !important">
              <el-tooltip class="item align-tooltip" effect="dark" content="Editar empresa">
                <template class="align-tooltip">
                  <edit-accounting-company-component :company="scope.row" />
                </template>
              </el-tooltip>

              <el-tooltip class="item align-tooltip" effect="dark" content="Editar empresa">
                <template class="align-tooltip">
                  <span @click="deleteRow(scope.row.id)">
                    <md-icon class="size-xsmall action-design">delete</md-icon>
                  </span>
                </template>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <br>
      <el-row class="m-3" type="flex" justify="center">
        <el-pagination :page-size="headers.limit" :pager-count="9" layout="prev, pager, next" :total="headers.total" @current-change="handleCurrentChange" />
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
  name: 'AccountingCompaniesComponent',
  data: () => ({
    tmp_limit: '',
    now: moment(),
    tmp_order: ''
  }),
  watch: {
    'tmp_limit'(value) {
      this.headers.limit = parseInt(value)
      this.getData()
    },
    'tmp_order'(value) {
      this.headers.order_by = value
      this.getData()
    }
  },
  created() {
    this.getData(1)
  },
  methods: {
    ...mapMutations('accounting', ['getData']),
    headerSearch(_text) {
      console.log(_text)
      if (_text.length > 0) {
        this.headers.search = _text
      } else {
        this.headers.search = _text
      }
      this.getData()
    },
    handleCurrentChange(val) {
      this.getData(val)
    },
    setOrder(event) {
      console.log(event)
    },
    deleteRow(id) {
      Api.post('/accounting/companies/delete', {
        company_id: id
      })
        .then(res => {
          this.getData()
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
    ...mapState('accounting', ['accounting_companies', 'rowsPerPage', 'headers', 'loading_get_list']),
    is_now() {
      console.log(moment().utc())
      return moment().utc()
    }
  },
  filters: {
    law(value) {
      return value == 1 ? 'Si' : 'No';
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
