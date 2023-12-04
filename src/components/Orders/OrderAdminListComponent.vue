<template>
  <div>
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix">
        <h3>Lista de pedidos totales</h3>
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

      <el-table v-loading="loading_get_list" class="m-1" style="width: 100%" :data="orders.data">
        <el-table-column fixed type="index" width="50" />
        <el-table-column prop="start_date" label="Fecha de inicio" width="220" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="text-align:center">{{ scope.row.menu.start_date | moment('ddd Do MMM YYYY') }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="finish_date" label="Fecha de fin" width="220" header-align="center" align="center">
          <template slot-scope="scope">
            <span style="text-align:center">{{ scope.row.menu.finish_date | moment('ddd Do MMM YYYY') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Acciones" width="230" header-align="center" align="center" class="display-button">
          <template slot-scope="scope">
            <div class="align" style="display: inline-flex !important">
              <el-tooltip class="item align-tooltip" effect="dark" content="Comida solicitada">
                <template v-if="scope.row.products.length > 0" class="align-tooltip">
                  <order-product-list-component :order="scope.row" />
                </template>
              </el-tooltip>

              <el-tooltip class="item align-tooltip" effect="dark" content="Ofertar comida" placement="bottom" style="text-align:center;">
                <offer-user-product-component :order="scope.row" />
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
  name: 'OrderAdminListComponent',
  data: () => ({
    tmp_limit: '',
    tmp_order: ''
  }),
  watch: {
    'tmp_limit'(value) {
      this.headers.limit = parseInt(value)
      this.getOrders()
    },
    'tmp_order'(value) {
      this.headers.order_by = value
      this.getOrders()
    }
  },
  created() {
    this.getOrders(1)
  },
  methods: {
    ...mapMutations('dining', ['getOrders']),
    headerSearch(_text) {
      console.log(_text)
      if (_text.length > 0) {
        this.headers.search = _text
      } else {
        this.headers.search = _text
      }
      this.getOrders()
    },
    handleCurrentChange(val) {
      this.getOrders(val)
    },
    setOrder(event) {
      console.log(event)
    }
  },
  computed: {
    ...mapState('dining', ['orders', 'rowsPerPage', 'headers', 'loading_get_list'])
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
</style>
