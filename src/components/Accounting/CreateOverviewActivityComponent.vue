<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title class="dialog-header">Registrar nueva opinión de cumplimiento</md-dialog-title>
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
            <div class="md-layout md-gutter mt-3">
              <div class="md-layout-item md-small-size-100">
                <md-datepicker v-model="f.date" required>
                  <label>Fecha de inicio *</label>
                </md-datepicker>
                <span v-if="v.date" class="md-danger" style="color:red;">*{{ v.date[0] }}</span>
              </div>
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>Opinión</label>
                  <md-select v-model="f.overview_id" :md-fuzzy-search="true">
                    <md-option v-for="item in cat_overviews" :key="item.id" :value="item.id">
                      {{ item.description }}
                    </md-option>
                  </md-select>
                </md-field>
                <span v-if="v.overview_id" class="md-danger" style="color:red;">*{{ v.overview_id[0] }}</span>
              </div>
            </div>
            <div class="md-layout md-gutter mt-3">
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>Comentarios</label>
                  <md-textarea v-model="f.comment" md-autogrow></md-textarea>
                </md-field>
                <span v-if="v.comment" class="md-danger" style="color:red;">*{{ v.comment[0] }}</span>
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
  name: 'CreateOverviewActivityComponent',
  data: () => ({
    showDialog: false,
    is_loaded: null,
    f: {
      company_id: '',
      date: '',
      comment: '',
      overview_id: ''
    },
    v: new Object(),
    sending: false,
    disabled: false
  }),
  created() {
    this.getAllCompanies()
    this.getCatOverview()
  },
  methods: {
    ...mapMutations('accounting', ['getAllCompanies', 'changeValue', 'getCatOverview']),
    store() {
      this.disabled = true
      Api.post('/accounting/overviews/store', {
        company_id: this.f.company_id,
        date: this.f.date,
        comment: this.f.comment,
        overview_id: this.f.overview_id,
      })
        .then(res => {
          this.$notify({
            title: 'Realizado',
            message: 'Contabilidad electrónica guardada correctamente',
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
  .md-field {
    max-width: 300px;
  }

	.size-xsmall {
		width: 10px;
    min-width: 10px;
    height: 10px;
    font-size: 17px!important;

	}

  /* .el-input__inner {
      display: block !important;
      outline: none !important;
      border: none !important;
      height: 2em !important;
      font-size: 16px !important;
      margin-bottom: 1px !important;
      border-bottom: 1px solid #333 !important;
  } */

  /* .el-input__inner.border: unset!important;{

  } */

  .dialog-header {
    background-color: #3f5465;
    color: white;
  }

  .-mb-3 {
    margin-top: -2.7rem;
  }

</style>
