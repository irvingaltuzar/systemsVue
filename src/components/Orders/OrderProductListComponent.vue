<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Listado de pedidos</md-dialog-title>

      <md-dialog-content class="md-scrollbar">

        <form novalidate class="md-layout" @submit.prevent="store">
          <md-card class="md-layout-item  md-small-size-100">

            <md-card-content>
              <div class="md-layout md-gutter mt-3">
                <div class="md-layout-item md-small-size-100">
                  <md-card-media>
                    <img :src="img_preview">
                  </md-card-media>
                </div>
              </div>

              <div class="md-layout md-gutter mt-3">
                <div class="md-layout md-gutter md-alignment-center">
                  <div v-for="(product) in order.products" :key="product.id">
                    <div class="md-list-item-text pl-3 pt-3">
                      <b><span style="color:red;">{{ product.work_day_id | dayName }}</span></b>
                      <br>
                      <b><span>{{ product.food_type }}</span></b>
                    </div>
                  </div>
                </div>
              </div>
            </md-card-content>

            <md-progress-bar v-if="disabled" md-mode="indeterminate" />
          </md-card>
        </form>

      </md-dialog-content>
    </md-dialog>

    <el-button size="mini" type="info" circle @click="showDialog = true">
      <md-icon class="size-xsmall">receipt_long</md-icon>
    </el-button>
  </div>
</template>

<script>
import imageCompression from 'browser-image-compression'
import { mapMutations, mapState } from 'vuex'
import moment from 'moment'
import Api from '@/store/modules/Api'

export default {
  name: 'OrderProductListComponent',
  props: {
    order: {
      required: true
    }
  },
  data: () => ({
    showDialog: false,
    img_preview: null,
    array: [],
    is_loaded: null,
    f: {
      enabled_days: [],
      location_id: null,
      menu_id: '',
      description: '',
      file_updated: false,
      files: [],
      new_files: [],
      email: '',
      phone: '',
      start_date: null,
      finish_date: null
    },
    v: new Object(),
    sending: false,
    disabled: false
  }),
  watch: {
    'data'(val) {
      console.log('')
    }
  },
  filters: {
    dayName(day) {
      const days = [
        { id: 1, key: 'Sun', name: 'Domingo' },
        { id: 2, key: 'Mon', name: 'Lunes' },
        { id: 3, key: 'Tue', name: 'Martes' },
        { id: 4, key: 'Wed', name: 'Miércoles' },
        { id: 5, key: 'Thu', name: 'Jueves' },
        { id: 6, key: 'Fri', name: 'Viernes' },
        { id: 7, key: 'Sat', name: 'Sábado' }
      ]
      const found = days.find(element => element.id == day)
      return found.name
    }
  },
  computed: {
    ...mapState('locations', ['locations']),
    week() {
      var weeknumber = moment().week()

      return weeknumber
    },
    url() {
      return this.is_loaded = !!this.order.menu.image
    },
    data() {
      this.f.enabled_days = this.order.menu.enabled_days,
      this.f.menu_id = this.order.menu.id,
      this.f.location_id = this.order.menu.location_id,
      this.f.files =	this.order.menu.image,
      this.f.start_date = this.order.menu.start_date,
      this.f.finish_date = this.order.menu.finish_date,
      this.img_preview = this.order.menu.first_image_url
      this.is_loaded = !!this.order.menu.image
      return this.order
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
