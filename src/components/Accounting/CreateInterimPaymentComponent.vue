<template>
	<div>
		<md-dialog :md-active.sync="showDialog" >
			<md-dialog-title class="dialog-header">Registrar nuevo pago provisional</md-dialog-title>
			<form class="md-layout -mb-3" @submit.prevent="store">

				<md-dialog-content class="md-scrollbar">
					<md-card-content>
						<div class="md-layout md-gutter mt-3">
							<div class="md-layout-item md-small-size-100">
								<el-select class="input-autocomplete" v-model="f.company_id" filterable placeholder="Selecciona una empresa">
									<el-option v-for="item in accounting_companies" :key="item.id" :label="item.business_name" :value="item.id"></el-option>
								</el-select>
								<span v-if="v.company_id" class="md-danger" style="color:red;">*{{ v.company_id[0] }}</span>
							</div>
						</div>
						<br>
						<br>
						<div class="md-subtitle">Registro DIOT</div>
						<md-divider></md-divider>
						<div class="md-layout md-gutter mt-3">
							<div class="md-layout-item md-small-size-100">
								<md-datepicker v-model="f.diot.date" required>
									<label>Fecha de inicio *</label>
								</md-datepicker>
								<span v-if="v.diot_date" class="md-danger" style="color:red;">*{{ v.diot_date[0] }}</span>
							</div>
							<div class="md-layout-item md-small-size-100">
								<md-field>
                  <label>Folio de transacción</label>
                  <md-input v-model="f.diot.id_transaction"></md-input>
                </md-field>
                <span v-if="v.diot_id_transaction" class="md-danger" style="color:red;">*{{ v.diot_id_transaction[0] }}</span>
							</div>
						</div>
						<br>
						<br>
						<div class="md-subtitle">Registro DYP</div>
						<md-divider></md-divider>
						<div class="md-layout md-gutter mt-3">
							<div class="md-layout-item md-small-size-100">
								<md-datepicker v-model="f.dyp.date" required>
									<label>Fecha de inicio *</label>
								</md-datepicker>
								<span v-if="v.dyp_date" class="md-danger" style="color:red;">*{{ v.dyp_date[0] }}</span>
							</div>
							<div class="md-layout-item md-small-size-100">
								<md-field>
                  <label>Folio de transacción</label>
                  <md-input v-model="f.dyp.id_transaction"></md-input>
                </md-field>
                <span v-if="v.dyp_id_transaction" class="md-danger" style="color:red;">*{{ v.dyp_id_transaction[0] }}</span>
							</div>
						</div>
						<md-divider></md-divider>
						<div class="md-layout md-gutter mt-3">
              <div class="md-layout-item md-small-size-100">
                <md-switch v-model="f.yearly" class="md-primary">Anual</md-switch>
                <span v-if="v.yearly" class="md-danger" style="color:red;">*{{ v.yearly[0] }}</span>
              </div>
						</div>
					</md-card-content>
					<md-progress-bar v-if="disabled" md-mode="indeterminate" />
					<md-button type="submit" class="md-primary" :disabled="disabled">Guardar</md-button>
				</md-dialog-content>
			</form>
		</md-dialog>
		<el-button size="mini" type="success" @click="showDialog = true">
			<md-icon class="size-xsmall" style="color:white;">add_circle</md-icon>
		</el-button>
	</div>
</template>
  
<script>
import imageCompression from 'browser-image-compression'
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import Api from '@/store/modules/Api'

export default {
	name: 'CreateInterimPaymentComponent',
	data: () => ({
		showDialog: false,
		is_loaded: null,
		f: {
			diot: {
				date: '',
				id_transaction: '',
			},
			dyp: {
				date: '',
				id_transaction: '',
			},
			company_id: '',
			yearly: false
		},
		v: new Object(),
		sending: false,
		disabled: false
	}),
	created() {
		this.getAllCompanies()
	},
	methods: {
		...mapMutations('accounting', ['getAllCompanies', 'getInterims', 'changeValue']),
		store() {
			this.disabled = true
			Api.post('/accounting/interim/store', {
				company_id: this.f.company_id,
				diot_date: this.f.diot.date,
				diot_id_transaction: this.f.diot.id_transaction,
				dyp_date: this.f.dyp.date,
				dyp_id_transaction: this.f.dyp.id_transaction,
				yearly: this.f.yearly
			})
			.then(res => {
				this.$notify({
					title: 'Realizado',
					message: 'Pago provisional registrado correctamente',
					type: 'success'
				})
				Object.assign(this.$data, this.$options.data.call(this))
				this.changeValue()
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
					this.disabled = false
					this.changeValue()
				})
		}
	},
	computed: {
		...mapState('accounting', ['accounting_companies', 'cat_overviews'])
	},
	mounted() {
		this.$material.locale = {
			startYear: 1900,
			endYear: 2099,
			dateFormat: 'yyyy-MM-dd',
			days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
			shortDays: ['Dom', 'Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab'],
			shorterDays: ['D', 'L', 'M', 'Mi', 'J', 'V', 'S'],
			months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			shortMonths: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'],
			shorterMonths: ['J', 'F', 'M', 'A', 'M', 'Ju', 'Ju', 'A', 'Se', 'O', 'N', 'D'],
			firstDayOfAWeek: 0,
			cancel: 'Cancelar',
			confirm: 'Ok'
		}
	}
}
</script>

<style lang="css">
  .md-dialog {
      max-width: 100%;
      min-height: 100%;
      margin-left: auto;
      margin-right: auto;
  }
  .md-dialog-container {
    max-height: 100% !important;
  }
	.dialog-header {
		background-color: #3f5465;
		color: white;
	}

	.-mb-3 {
		margin-top: -2.7rem;
	}

</style>
  