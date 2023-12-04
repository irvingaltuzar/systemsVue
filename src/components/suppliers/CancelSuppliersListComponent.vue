<template>
  <div class="page-container">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix text-center">
        <h3 class="text-center">Proveedores dados de baja</h3>
      </div>
      <br>
      <el-tooltip class="item align-tooltip" effect="dark" content="Descargar excel" placement="bottom">
        <el-button size="mini" type="success" :loading="downloadLoading" style="margin-left: 20px;" @click="handleDownload">
          Descargar excel
          <md-icon class="size-xsmall">get_app</md-icon>
        </el-button>
      </el-tooltip>

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

			<el-table v-loading="loading_get_list" class="m-1" style="width: 100%;font-size:12px!important" :data="general_data.data">
        <el-table-column prop="id" label="Folio / Referencia" width="70" header-align="center" align="center">
          <template slot-scope="scope">
						<span style="text-align:center">
              {{ scope.row.id }}
						</span> <br>
            <span style="text-align:center">
              {{ scope.row.referencia_intelisis }}
						</span>
					</template>
        </el-table-column>
				<el-table-column prop="responsable_name" label="Registró" width="205" header-align="center" align="center">
					<template slot-scope="scope">
            <el-popover placement="top" width="350"  trigger="hover">
              <p>
                <b>
                  Puesto:
                </b>
                  {{ (scope.row.responsable != null) ? scope.row.responsable.position_company : 'Historico'  }}
              </p>
              <p>
                <b>
                  Área:
                </b>
                  {{ (scope.row.responsable != null) ? scope.row.responsable.deparment : 'Historico'  }}
              </p>
              <p>
                <b>
                  Unidad de negocio:
                </b>
                  {{ (scope.row.responsable != null) ? scope.row.responsable.company_name : 'Historico'  }}
              </p>
              <p>
                <b>
                  Ubicación:
                </b>
                  {{ (scope.row.responsable != null) ? scope.row.responsable.location : 'Historico'  }}
              </p>
              <el-button slot="reference" style="font-size:11px;">
                {{ scope.row.responsable_name }}
              </el-button>
            </el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="business_name" label="Razón social" width="170" header-align="center" align="center">
					<template slot-scope="scope">
						<span style="text-align:center;">
              {{ scope.row.business_name }}
              <br>
              {{ scope.row.rfc }}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="type_supplier" label="Tipo" width="120" header-align="center" align="center">
					<template slot-scope="scope">
						<el-col class="mx-auto" :md="4" :xs="24">
							<el-select v-model="tmp_type" :placeholder="scope.row.type_supplier" @change="changeType(scope.row.id)">
								<el-option label="Proveedor" value="Proveedor" />
								<el-option label="Contratista" value="Contratista" />
							</el-select>
						</el-col>
					</template>
				</el-table-column>
				<el-table-column prop="email" label="Contacto" width="170" header-align="center" align="center">
					<template slot-scope="scope">
						<span style="text-align:center">
              {{ scope.row.email }}
						</span> <br>
						<span style="text-align:center">
              {{ scope.row.contact }}
						</span>
						<span style="text-align:center">
              {{ scope.row.phone }}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="efo" label="EFO" width="60" header-align="center" align="center">
					<template slot-scope="scope">
						<span style="text-align:center">
              {{ scope.row.efo }}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="finish_date" label="Fecha de registro" width="80" header-align="center" align="center">
					<template slot-scope="scope">
						<span style="text-align:center">
              {{ scope.row.created_at | moment('DD/MM/YYYY') }}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="is_open" width="100" label="Estatus" header-align="center" align="center">
					<template slot-scope="scope">
            <el-popover placement="top" width="350"  trigger="hover">
              <p>
                <b>
                  Motivo de rechazo:
                </b>
                {{ scope.row.motive_down }}
              </p>
              <el-button slot="reference" type="danger" style="font-size:11px;">
                Ver
              </el-button>
            </el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="is_open" width="91" label="Acciones" header-align="center" align="center">
					<template slot-scope="scope">
            <div class="align" style="display: inline-flex !important">
              <template v-if="scope.row.responsable.usuario_ad != user">
                <el-tooltip class="item align-tooltip" effect="dark" content="Reactivar" placement="bottom">
									<el-button size="mini" type="success" circle @click="changeStatus([scope.row.id, 0, scope.row.business_name, scope.row.referencia_intelisis])">
										<md-icon class="size-xsmall">lock_open</md-icon>
									</el-button>
                </el-tooltip>
              </template>

              <template v-if="scope.row.responsable.usuario_ad != user">
                <el-tooltip class="item align-tooltip" effect="dark" content="Editar proveedor" placement="bottom" >
                  <edit-suppliers-component :supplier="scope.row" />
                </el-tooltip>
              </template>
            </div>
					</template>
				</el-table-column>

				<el-table-column prop="is_open" width="91" label="Archivos" header-align="center" align="center">
					<template slot-scope="scope">
            <div class="align" style="display: inline-flex !important">
              <template v-if="scope.row.responsable.usuario_ad != user">
                <el-tooltip class="item align-tooltip" effect="dark" content="Descargar archivos" placement="bottom">
									<el-button size="mini" type="danger" circle @click="downloadZip(scope.row.files)">
										<md-icon class="size-xsmall">folder_zip</md-icon>
									</el-button>
                </el-tooltip>
              </template>

              <template>
                <el-tooltip class="item align-tooltip" effect="dark" content="Ver historial" placement="bottom">
                  <supplier-time-line-component :logs="scope.row.logs"/>
                </el-tooltip>
              </template>
            </div>
					</template>
				</el-table-column>
				<el-table-column prop="classification" width="100" label="Trabajos realizados" header-align="center" align="center">
					<template slot-scope="scope">
            <el-popover placement="top" width="350"  trigger="hover">
              <p>
                <b>
                  Trabajos realizados:
                </b>
                  {{ scope.row.classification }}
              </p>
              <el-button slot="reference" type="danger" style="font-size:11px;">
                Ver
              </el-button>
            </el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="specialties" label="Especialidades" width="170" header-align="center" align="center">
					<template slot-scope="scope">
            <template v-for="specialty in scope.row.specialities">
              <span style="text-align:center">
                {{ specialty.specialty_name }},
              </span> <br>
            </template>
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
import { mapMutations, mapState, mapGetters } from 'vuex'
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
    downloadLoading: false
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Folio', 'Intelisis', 'Razón social / nombre', 'RFC', 'Tipo', 'Correo', 'Teléfono', 'Contacto Ventas', 'Estado', 'Unidad de negocio', 'EFO', 'Clasificación', 'Trabajos realizados', 'Estatus', 'Fecha de registro', 'Registró']
        const filterVal = ['id', 'referencia_intelisis', 'business_name', 'rfc', 'type_supplier', 'email', 'phone', 'contact', 'state_name', 'responsable.company_name', 'efo', 'classification', '', 'status_name', 'date', 'responsable_name']
        const list = this.general_data.data
        const data = this.formatJson(filterVal, list)
        const name = "current_suppliers" + this.now
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: name,
          autoWidth: true, //Optional
          bookType: 'xlsx' //Optional
        })

        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Descargó el archivo de excel ->' + name + ' && en el panel de proveedores en proceso')
        formAut.append('evento', 'approve()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    changeType (id) {
				Api.post('/suppliers/change-type', {
					id: id,
					type: this.tmp_type
				})
				.then(response => {
					this.$notify({
						title: 'Realizado',
						message: 'Tipo de proveedor cambiado correctamente',
						type: 'success'
					})
					this.getList(1)
          this.tmp_type = ''
				})
				.catch(error => {
					this.$notify({
						title: 'Error',
						message: 'Ha ocurrido un error, intenta nuevamente',
						type: 'error'
					})
          this.tmp_type = ''
					this.getList(1)
				})
        .finally (() => {
          this.tmp_type = ''
        })
			},
			changeStatus (payload) {
				var [id, status, business_name, erp_id] = payload
				if (status === 0) {
					Api.post('/suppliers/reactive', {
						id: id,
						status: status,
            erp_id: erp_id
					})
					.then(response => {
						this.$notify({
              title: 'Realizado',
              message: 'Proveedor reactivado correctamente',
              type: 'success'
            })
            const formAut = new FormData()
            formAut.append('name_view', this.$route.name)
            formAut.append('comentarios', 'Reactivó al proveedor ->' + business_name)
            formAut.append('id_afectado', id)
            formAut.append('evento', 'reactive()')

            this.$store.dispatch('auditoria/addEventAuditoria', formAut)

						this.getList(1)
						this.getTotalData()
					})
					.catch(error => {
						this.$notify({
							title: 'Error',
							message: 'Ha ocurrido un error, intenta nuevamente',
							type: 'error'
						})
						this.getList(1)
					})
				}
			},
			async createFile(value){
				let response = await fetch("/storage/Proveedores/8_1669248519_file_ActaConstitutiva.pdf");
				let data = await response.blob();
				let metadata = {
					type: 'application/pdf'
				};
				let file = new File([data], "test.pdf", metadata);
				var reader = new FileReader()
				// ... do something with the file or return it
				reader.readAsDataURL(file)
				reader.onload = function () {
					console.log(reader.result)
				}
			},
      downloadZip(files) {
      // var new_zip = new JsZip()
      var count = 0
      var url_2 = files[0].file_url
      var zipFilename = "informacion_proveedor.zip";
      var zip = new JsZip()
      var xhttp = new XMLHttpRequest()

      files.forEach(element => {
        var filename = element.name

        JSZipUtils.getBinaryContent(element.file_url, function (err, data) {
          if(err) {
            throw err
          }
          zip.file(filename, data, {binary:true})
            count++
            console.log(count)
            console.log(files.length)
            if (count == files.length) {
              zip.generateAsync({type:"blob"})
              .then(function(blob) {
                  saveAs(blob, zipFilename)
              })
            }
        })
      })
    },
			urlToPromise (url) {
				JSZipUtils.getBinaryContent(url, function (err, data) {
						if(err) {
							throw err
						}

						var zip = new JsZip()
						zip.file("Some.pdf", data, {binary:true});
						content = zip.generateAsync();
				})
			},
    async getList(_page = 1){
      this.headers.page = _page;
      this.loading_get_list= true;
      await Api.get('/suppliers/fetch',{
        params:this.headers
      })
      .then(response =>{
        this.general_data = response.data
        this.loading_get_list= false
      })
      .catch(error =>{
        console.log(error," => ",'/suppliers/fetch');
        this.loading_get_list= false
      });

    },
    handleCurrentChange(val){
      this.getList(val);
    },
  },
  computed: {
    ...mapState('suppliers_tools', ['has_change']),
    ...mapGetters(['user'])
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
