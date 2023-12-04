<template>
  <div class="page-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix text-center">
        <h3 class="text-center">Lista de especialidades</h3>
      </div>
      <div slot="header" class="clearfix text-end">
        <create-specialties-component/>
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
            <el-option label="10" value="10"></el-option>
            <el-option label="20" value="20"></el-option>
            <el-option label="50" value="50"></el-option>
            <el-option label="100" value="100"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <br>

			<el-table v-loading="loading_get_list" class="m-1" style="width: 100%" :data="general_data.data">
				<el-table-column fixed type="index" width="50" />
				<el-table-column prop="description" label="Descripción" width="350" header-align="center" align="center">
					<template slot-scope="scope">
						<span style="text-align:center;color:red">
							<el-tag type="success" effect="dark">
								{{ scope.row.description }}
							</el-tag>
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="is_open" width="350" label="Estatus" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tooltip class="item align-tooltip" effect="dark" content="Editar empresa">
                <template class="align-tooltip">
                  <span @click="deleteRow(scope.row.id)">
                    <md-icon class="size-xsmall action-design">delete</md-icon>
                  </span>
                </template>
						</el-tooltip>
					</template>
				</el-table-column>
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
  name: 'CurrentSuppliersListComponent',
  data: () => ({
    general_data:{},
    tmp_type: '',
    headers:{
      limit:10,
      page:1,
      order_by:'desc',
      search:"",
      status: 2
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
    ...mapMutations('suppliers_tools', ['changeValue', 'getTotalData']),
			deleteRow(id) {
				Api.post('/suppliers/specialties/delete', {
					specialty_id: id
				})
				.then(res => {
					this.$notify({
						title: 'Realizado',
						message: 'Especialidad eliminada correctamente',
						type: 'success'
					})
					this.fetchSpecialties()
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
			},
    async getList(_page = 1){
      this.headers.page = _page;
      this.loading_get_list= true;
      await Api.get('/suppliers/fetch-specialties',{
        params:this.headers
      })
      .then(response =>{
        this.general_data = response.data
        this.loading_get_list= false
      })
      .catch(error =>{
        console.log(error," => ",'/suppliers/fetch-specialties');
        this.loading_get_list= false
      });

    },
    handleCurrentChange(val){
      this.getList(val);
    },
  },
  computed: {
    ...mapState('suppliers_tools', ['has_change']),
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
