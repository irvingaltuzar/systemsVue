<template>
  <form novalidate class="md-layout" @submit.prevent="store">
    <md-card class="md-layout-item  md-small-size-100">
      <md-card-header>
        <div class="md-title">Generar cobro de comedor</div>
      </md-card-header>

      <md-card-content>
        <div class="md-layout md-gutter mt-3">
          <div class="md-layout-item md-small-size-50">
            <md-datepicker v-model="f.start_date" required>
              <label>Fecha de inicio *</label>
            </md-datepicker>
            <span v-if="v.start_date" class="md-danger" style="color:red;">*{{ v.start_date[0] }}</span>
          </div>
          <div class="md-layout-item md-small-size-50">
            <md-datepicker v-model="f.finish_date">
              <label>Fecha de fin *</label>
            </md-datepicker>
            <span v-if="v.finish_date" class="md-danger" style="color:red;">*{{ v.finish_date[0] }}</span>
          </div>
        </div>

        <div class="md-layout md-gutter mt-3">
          <div class="md-layout-item md-small-size-100">
            <md-field>
              <label>Quincena cubierta</label>
              <md-select v-model="f.payment_day" :md-fuzzy-search="false">
                <md-option value="1">
                  Primera quincenca
                </md-option>
                <md-option value="2">
                  Segunda quincenca
                </md-option>
              </md-select>
            </md-field>
            <span v-if="v.payment_day" class="md-error" style="color:red;">*{{ v.payment_day[0] }}</span>
          </div>
        </div>
      </md-card-content>

      <md-progress-bar v-if="disabled" md-mode="indeterminate" />

      <md-card-actions>
        <md-button type="submit" class="md-primary" :disabled="disabled">Guardar</md-button>
      </md-card-actions>
    </md-card>
  </form>
</template>

<script>
import imageCompression from 'browser-image-compression'
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import Api from '@/store/modules/Api'

export default {
  name: 'DiningPaymentsComponent',

  data: () => ({
    f: {
      payment_day: null,
      start_date: null,
      finish_date: null
    },
    v: new Object(),
    disabled: false
  }),
  computed: {
  },
  methods: {
    store() {
      this.disabled = true

      Api.post('/dining/order/upload-cashout', {
        payment_day: this.f.payment_day,
        start_date: this.f.start_date,
        finish_date: this.f.finish_date
      })
        .then(res => {
          this.$notify({
            title: 'Realizado',
            message: 'Menú guardado correctamente',
            type: 'success'
          })
          Object.assign(this.$data, this.$options.data.call(this))
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
  mounted() {

  }
}
</script>

  <style lang="scss" scoped>

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
  </style>
