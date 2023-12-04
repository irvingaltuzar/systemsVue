<template>
	<div>
		<md-dialog :md-active.sync="showDialog">
			<md-dialog-title>Dar de baja proveedor</md-dialog-title>

			<md-dialog-content class="md-scrollbar">

				<form novalidate class="md-layout" @submit.prevent="store">
					<md-card-content>
						<div class="md-layout md-gutter mt-12">
							<div class="md-layout-item md-small-size-100">
								<md-field>
									<label>Motivo de baja</label>
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
				</form>

			</md-dialog-content>
		</md-dialog>
		<el-button size="mini" type="danger" circle @click="showDialog = true">
			<md-icon class="size-xsmall">delete</md-icon>
		</el-button>
	</div>
</template>

<script>
import imageCompression from 'browser-image-compression'
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import Api from '@/store/modules/Api'

export default {
	name: 'DeleteSupplierComponent',
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
		status: 2,
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
      Api.post('/suppliers/remove', {
        comment: this.comment,
				status: this.status,
				id: this.supplier.id
      })
			.then(res => {
				this.$notify({
					title: 'Realizado',
					message: 'Proveedor dado de baja correctamente',
					type: 'success'
				})

        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)            
				formAut.append('comentarios', 'Dió de baja al proveedor ->' + this.supplier.business_name)
				formAut.append('id_afectado', this.supplier.id)
        formAut.append('evento', 'remove()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

				this.changeValue()
				this.getTotalData()
				Object.assign(this.$data, this.$options.data.call(this))
        this.showDialog = false
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
