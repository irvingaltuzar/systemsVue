<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar style="background-color:#1c5a79">
        <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
          <md-icon style="color:white">menu</md-icon>
        </md-button>
        <span class="md-title" style="color:white">Panel de proveedores</span>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
        <md-toolbar class="md-transparent" md-elevation="0">
          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-dense" @click="toggleMenu">
              <md-icon>keyboard_arrow_left</md-icon>
            </md-button>
          </div>
        </md-toolbar>
        <md-list v-for="data in total_data">
          <md-list-item @click="show(data.order)">
            <md-icon :style="{color: data.color}">{{ data.icon }}</md-icon>
            <span class="md-list-item-text">{{ data.name }}</span>(<countTo :startVal="0" :endVal="data.value" :duration="5000"/>)
          </md-list-item>
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <div v-if="step === 0">
          <transition name="fade-transform" mode="out-in">
            <current-suppliers-list-component />
          </transition>
        </div>
        <div v-if="step === 1">
          <transition name="fade-transform" mode="out-in">
            <success-suppliers-list-component />
          </transition>
        </div>
        <div v-if="step === 2">
          <transition name="fade-transform" mode="out-in">
            <cancel-suppliers-list-component />
          </transition>
        </div>
        <div v-if="step === 4">
          <transition name="fade-transform" mode="out-in">
            <specialties-list-component />
          </transition>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import imageCompression from 'browser-image-compression'
import { mapMutations, mapState } from 'vuex'
import countTo from 'vue-count-to';
import moment from 'moment'
import Api from '@/store/modules/Api'

export default {
  name: 'DashboardSuppliers',
  components: { countTo },
  data: () => ({
    value: null,
    menuVisible: false,
    img_preview: null,
    step: 0,
    userSaved: false,
    sending: false,
  }),
  computed: {
    ...mapState('suppliers_tools', ['total_data']),
    week() {
      var weeknumber = moment().week()

      return weeknumber
    }
  },
  methods: {
    ...mapMutations('suppliers_tools', ['getTotalData']),
    checkNewPosts(activeTab) {
      if (activeTab !== 'tab-posts' && !this.checkInterval) {
        this.checkInterval = window.setInterval(() => {
          if (this.newPosts === 99) {
            this.newPosts = '99+'
            this.clearCheckPosts()
          } else {
            this.newPosts++
          }
        }, 1000)
      }
    },
    show(value) {
      console.log(value)
      this.step = value
    },
    toggleMenu () {
      this.menuVisible = !this.menuVisible
    }
  },
  mounted() {
    this.getTotalData()
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
