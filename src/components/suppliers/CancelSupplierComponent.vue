<template>
	<div>
		<md-dialog :md-active.sync="showDialog">
			<md-dialog-title>Rechazar proveedor</md-dialog-title>

			<md-dialog-content class="md-scrollbar">

				<form novalidate class="md-layout" @submit.prevent="store">
					<md-card class="md-layout-item  md-small-size-100">

						<md-card-content>
							<div class="md-layout md-gutter mt-12">
								<div class="md-layout-item md-small-size-100">
									<md-field>
										<label>CC</label>
										<md-input v-model="second_mail"></md-input>
									</md-field>
								</div>
							</div>
							<div class="md-layout md-gutter mt-12">
								<div class="md-layout-item md-small-size-100">
									<md-field>
										<label>Comentarios</label>
										<md-textarea v-model="comment" md-autogrow></md-textarea>
									</md-field>
									<span v-if="v.comment" class="md-danger" style="color:red;">*{{ v.comment[0] }}</span>
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
		<el-button style="text-align:center;margin-top:0.5rem;margin-left:-0.7rem;" size="mini" type="danger" round @click="showDialog = true">Rechazar</el-button>
	</div>
</template>

<script>
import imageCompression from 'browser-image-compression'
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import Api from '@/store/modules/Api'

export default {
	name: 'CancelSupplierComponent',
	props: {
		supplier: {
			required: true
		}
	},
	data: () => ({
		showDialog: false,
		second_mail: '',
		comment: '',
		is_loaded: null,
		v: new Object(),
		disabled: false
	}),
	watch: {
		'data'(val) {
			console.log('')
			console.log('')
		}
	},
	computed: {
		data() {
			return this.menu
		}
	},
	methods: {
		...mapMutations('suppliers_tools', ['changeValue', 'getTotalData']),
    store() {
      this.disabled = true
      Api.post('/suppliers/cancel', {
				second_mail: this.second_mail,
        comment: this.comment,
				supplier: this.supplier
      })
			.then(res => {
				setTimeout(() => {
          this.changeValue()
				}, 50)
				this.$notify({
					title: 'Realizado',
					message: 'Proveedor rechazado correctamente',
					type: 'success'
				})

        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Canceló el proveedor ->' + this.supplier.business_name + ' && Motivo ->' + this.comment + ' && Con copia a ->' + this.second_mail)
        formAut.append('id_afectado', this.supplier.id)
        formAut.append('evento', 'cancel()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

				Object.assign(this.$data, this.$options.data.call(this))
				 this.$root.$refs.CurrentSuppliersListComponent.getList()
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
				this.changeValue()
        this.showDialog = false
				this.disabled = false
			})
    }
	},
	mounted() {
	}
}
</script>

<style lang="scss" scoped>
		.md-dialog {
				max-width: 100%;
				margin-left: auto;
				margin-right: auto;
		}

</style>
