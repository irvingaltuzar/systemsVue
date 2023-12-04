<template>
  <div>
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <h3>Lista menú</h3>
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

      <el-table v-loading="loading_get_list" class="m-1" style="width: 100%" :data="dining_menu.data">
        <el-table-column fixed type="index" width="50" />
        <el-table-column prop="start_date" label="Fecha de inicio" width="220" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="text-align:center">{{ scope.row.start_date | moment('ddd Do MMM YYYY') }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="finish_date" label="Fecha de fin" width="220" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="text-align:center">{{ scope.row.finish_date | moment('ddd Do MMM YYYY') }}</span>
          </template>
        </el-table-column>
 
        <el-table-column prop="is_open" width="88" label="Estatus" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" round @click="toggleStatus(scope.row.id)">{{ scope.row.is_open | status }}</el-button>
            <!-- <span style="text-align:center"></span> -->
          </template>
        </el-table-column>

        <el-table-column label="Acciones" width="110" header-align="center" align="center">
          <template slot-scope="scope">
            <div class="align" style="display: inline-flex !important">
              <template v-if="!!scope.row.is_open">
                <el-tooltip class="item align-tooltip" effect="dark" content="Editar" placement="bottom">
                  <edit-dining-menu-component :menu="scope.row" />
                </el-tooltip>
              </template>

              <template v-if="!!!scope.row.is_open">
                <el-tooltip class="item align-tooltip" effect="dark" content="Ver pedidos" placement="bottom" >
                  <div class="clickable" @click="showOrders(scope.row.id)">
                    <md-icon class="size-xsmall">picture_as_pdf</md-icon>
                  </div>
                </el-tooltip>
              </template>
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
  name: 'DiningMenuListComponent',
  data: () => ({
    tmp_limit: '',
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
  filters: {
    status(value) {
      return !!value ? 'Abierto' : 'Cerrado'
    }
  },
  created() {
    this.getData(1)
  },
  methods: {
    ...mapMutations('dining', ['getData']),
    showOrders(id) {
      Api.get('/dining/order/general-pdf/' + id)
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'file.pdf')
          document.body.appendChild(link)
          link.click()
        })
        .catch(error => {
          console.log(error)
        })
    },
    headerSearch(_text) {
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
    toggleStatus(id) {

			Api.post('/dining/menu/close', {
				id: id
			}).then(response => {
				this.dining_menu.data.find(menu => menu.id === id).is_open = response.data.is_open
				// this.dt.disabled = false
			}).catch(error => {
        this.$notify({
          title: 'Oops!',
          message: 'Ha ocurrido un error, intente nuevamente!',
          type: 'error'
        })
			})

    }
  },
  computed: {
    ...mapState('dining', ['dining_menu', 'rowsPerPage', 'headers', 'loading_get_list'])
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

  .clickable {
		cursor: pointer;
  }
</style>
