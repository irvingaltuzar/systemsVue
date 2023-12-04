<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title class="dialog-header">Editar empresa</md-dialog-title>
      <form class="md-layout -mb-3" @submit.prevent="store">

        <md-dialog-content class="md-scrollbar">
          <md-card-content>
            <div class="md-layout md-gutter mt-3">
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label for="first-name">Nombre de empresa</label>
                  <md-input v-model="f.company_name" />
                  <!-- <span class="md-error" v-if="!$v.form.firstName.required">The first name is required</span>
                      <span class="md-error" v-else-if="!$v.form.firstName.minlength">Invalid first name</span> -->
                </md-field>
                <span v-if="v.company_name" class="md-danger" style="color:red;">*{{ v.company_name[0] }}</span>
              </div>
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>Gerente</label>
                  <md-select v-model="f.manager_id" :md-fuzzy-search="true">
                    <md-option v-for="item in managers" :key="item.id" :value="item.usuario_ad">
                      {{ item.name }} {{ item.last_name }}
                    </md-option>
                  </md-select>
                </md-field>
                <span v-if="v.manager_id" class="md-danger" style="color:red;">*{{ v.manager_id[0] }}</span>
              </div>
            </div>
            <div class="md-layout md-gutter mt-3">
              <div class="md-layout-item md-small-size-100">
                <md-switch v-model="f.has_law" class="md-primary">Ley anti-lavado </md-switch>
                <span v-if="v.has_law" class="md-danger" style="color:red;">*{{ v.has_law[0] }}</span>
              </div>
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>Contador</label>
                  <md-select v-model="f.accountant_id" :md-fuzzy-search="true">
                    <md-option v-for="item in accountants" :key="item.id" :value="item.usuario_ad">
                      {{ item.name }} {{ item.last_name }}
                    </md-option>
                  </md-select>
                </md-field>
                <span v-if="v.accountant_id" class="md-danger" style="color:red;">*{{ v.accountant_id[0] }}</span>
              </div>
            </div>

            <div class="md-layout md-gutter mt-3">
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>ERP</label>
                  <md-select v-model="f.erp_id" :md-fuzzy-search="true">
                    <md-option v-for="item in erps" :key="item.id" :value="item.id">
                      {{ item.description }}
                    </md-option>
                  </md-select>
                </md-field>
                <span v-if="v.erp_id" class="md-danger" style="color:red;">*{{ v.erp_id[0] }}</span>
              </div>
              <div class="md-layout-item md-small-size-100">
                <md-field>
                  <label>Se lleva en</label>
                  <md-select v-model="f.work_station_id" :md-fuzzy-search="true">
                    <md-option v-for="item in work_stations" :key="item.id" :value="item.id">
                      {{ item.description }}
                    </md-option>
                  </md-select>
                </md-field>
                <span v-if="v.work_station_id" class="md-danger" style="color:red;">*{{ v.work_station_id[0] }}</span>
              </div>
            </div>
          </md-card-content>
          <md-progress-bar v-if="disabled" md-mode="indeterminate" />
          <md-button type="submit" class="md-primary" :disabled="disabled">Guardar</md-button>
        </md-dialog-content>
      </form>
    </md-dialog>
    <el-button size="mini" type="warning" circle @click="showDialog = true">
      <md-icon class="size-xsmall">edit_note</md-icon>
    </el-button>
  </div>
</template>

<script>
import imageCompression from 'browser-image-compression'
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import Api from '@/store/modules/Api'

export default {
  name: 'EditAccountingCompanyComponent',
  props: {
    company: {
      required: true
    }
  },
  data: () => ({
    showDialog: false,
    is_loaded: null,
    f: {
      has_law: false,
      manager_id: '',
      accountant_id: '',
      company_name: '',
      erp_id: '',
      work_station_id: '',
      company_id: ''
    },
    tmp: '',
    v: new Object(),
    sending: false,
    disabled: false
  }),
  watch: {
    'data'(val) {
      this.tmp = val
      console.log(val)
    }
  },
  created() {
    this.getAccountantPersonal()
    this.getTools()
  },
  methods: {
    ...mapMutations('accounting', ['getAccountantPersonal', 'getTools', 'getData']),
    store() {
      this.disabled = true
      Api.post('/accounting/companies/update', {
        has_law: this.f.has_law,
        manager_id: this.f.manager_id,
        accountant_id: this.f.accountant_id,
        erp_id: this.f.erp_id,
        work_station_id: this.f.work_station_id,
        company_name: this.f.company_name,
        company_id: this.f.company_id
      })
        .then(res => {
          this.getData()
          this.$notify({
            title: 'Realizado',
            message: 'Empresa actualizada correctamente',
            type: 'success'
          })
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
          this.disabled = false
        })
    }
  },
  computed: {
    ...mapState('accounting', ['managers', 'accountants', 'work_stations', 'erps']),
    data() {
      this.f.has_law = this.company.has_law == 1 ? true : false
      this.f.manager_id = this.company.manager_id
      this.f.accountant_id = this.company.accountant_id
      this.f.company_name =	this.company.business_name
      this.f.erp_id = this.company.cat_erp_id
      this.f.work_station_id = this.company.cat_work_station_id
      this.f.company_id = this.company.id

      return this.company
    }
  }
}
</script>

  <style lang="scss" scoped>
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

    .dialog-header {
      background-color: #3f5465;
      color: white;
    }

    .-mb-3 {
      margin-top: -2.7rem;
    }

  </style>
