<template>
    <div>
      <md-dialog :md-active.sync="showDialog">
        <md-dialog-title>Agregar especialidades</md-dialog-title>

        <md-dialog-content class="md-scrollbar">

          <form novalidate class="md-layout" @submit.prevent="store">
            <md-card class="md-layout-item  md-small-size-100">

              <md-card-content>
								<div class="md-layout md-gutter mt-3">
									<div class="md-layout-item md-small-size-100">
										<el-select class="input-autocomplete" multiple v-model="array_specialties" filterable placeholder="Selecciona una especialidad">
											<el-option v-for="item in specialties" :key="item.id" :label="item.description" :value="item.id"></el-option>
										</el-select>
										<span v-if="v.array_specialties" class="md-danger" style="color:red;">*{{ v.array_specialties[0] }}</span>
									</div>
								</div>
              </md-card-content>

              <md-progress-bar v-if="disabled" md-mode="indeterminate" />

              <md-card-actions>
                <md-button type="submit" class="md-primary" :disabled="disabled">Guardar</md-button>
              </md-card-actions>
            </md-card>
          </form>

        </md-dialog-content>
      </md-dialog>

      <el-button size="mini" type="warning" circle @click="activate()">
        <md-icon class="size-xsmall">add_circle</md-icon>
      </el-button>
    </div>
  </template>

  <script>
  import imageCompression from 'browser-image-compression'
  import { mapMutations, mapState } from 'vuex'
  import moment from 'moment'
  import Api from '@/store/modules/Api'

  export default {
    name: 'AddSpecialtiesComponent',
    props: {
      supplier_id: {
        required: true
      },
			current_specialities: {
				required: true
			},
			business_name: {
				required: true
			}
    },
    data: () => ({
      img_preview: null,
			array_specialties: [],
      is_loaded: null,
      showDialog: false,
      v: new Object(),
      sending: false,
      disabled: false
    }),
    watch: {
      'data'(val) {
        console.log()
      },
    },
    computed: {
      ...mapState('suppliers_tools', ['specialties']),
      data() {
        return this.supplier_id
      },
    },
    methods: {
      ...mapMutations('suppliers_tools', ['fetchCatSpecialties', 'changeValue']),
      activate () {
        this.showDialog = true
				this.fetchCatSpecialties()
				this.current_specialities.map(
										(value) => this.array_specialties.push(parseInt(value.cat_supplier_specialty))
									)
      },
			store () {
				this.disabled = true
				Api.post('/suppliers/store-specialties', {
					array_specialties: this.array_specialties,
					supplier_id: this.supplier_id
				})
				.then(res => {
					this.$notify({
						title: 'Realizado',
						message: 'Especialidad agregada correctamente',
						type: 'success'
					})

					const formAut = new FormData()
					formAut.append('name_view', this.$route.name)
					formAut.append('comentarios', 'Agregó una nueva especialidad al proveedor ->' + this.business_name)
					formAut.append('id_afectado', this.supplier_id)
					formAut.append('evento', 'storeSpecialties()')

					this.$store.dispatch('auditoria/addEventAuditoria', formAut)


					Object.assign(this.$data, this.$options.data.call(this))

					this.changeValue()
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
					this.disabled = false
					this.showDialog = false
					this.changeValue()
				})
			}
    }
  }
  </script>

  <style lang="scss" scoped>
      .md-dialog {
          max-width: 70%;
          margin-left: auto;
          margin-right: auto;
      }

      .dropzone-container {
          cursor: pointer;
          min-height: 180px;
          border: 2px dashed rgba(0,0,0,.54);
      }
      .dropzone-content{
          text-align: center;
          margin-top: 4rem;
          color: #777;
      }

      .v-list__tile__title {
          text-align: center!important;
      }

    .md-drawer {
      width: 230px;
      max-width: calc(100vw - 125px);
    }

    .md-field {
      max-width: 300px;
    }

      .size-xsmall {
          width: 10px;
      min-width: 10px;
      height: 10px;
      font-size: 17px!important;

      }

  </style>
