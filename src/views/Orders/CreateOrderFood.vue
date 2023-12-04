<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar style="background-color:#1c5a79">
        <span class="md-title" style="color:white">Servicio de comedor</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full">
        <!-- <md-toolbar class="md-transparent" md-elevation="0">
            Navigation
          </md-toolbar> -->

        <md-list @md-changed="checkNewPosts">
          <md-list-item @click="change(1)">
            <md-icon>history</md-icon>
            <span class="md-list-item-text">Historial pedidos</span>
          </md-list-item>
          <md-list-item @click="change(2)">
            <md-icon>restaurant</md-icon>
            <span class="md-list-item-text" link>Solicitar comida</span>
          </md-list-item>

          <template v-if="!!!has_product">
            <md-list-item @click="change(3)">
              <md-icon>local_offer</md-icon>
              <span class="md-list-item-text">Tomar comida ofertada</span>
            </md-list-item>
          </template>
        </md-list>
      </md-app-drawer>
      <md-app-content>
        <div v-if="!!welcome">
          <transition name="fade-transform" mode="out-in">
            <welcome-dining-service-component :current_order="current_order" />
          </transition>
        </div>
        <div v-if="step === 1">
          <transition name="fade-transform" mode="out-in">
            <order-user-list-component />
          </transition>
        </div>
        <div v-if="step === 2">
          <transition name="fade-transform" mode="out-in">
            <create-user-order-component />
          </transition>
        </div>
        <div v-if="step === 3">
          <transition name="fade-transform" mode="out-in">
            <take-product-component />
          </transition>
        </div>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'CreateOrderFood',

  data: () => ({
  }),
  computed: {
    ...mapState('dining', ['step', 'welcome', 'current_order', 'has_product'])
  },
  methods: {
    ...mapMutations('dining', ['changeStep', 'getCurrentOrder', 'getCurrentProduct']),
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
    change(value) {
      this.changeStep(value)
    }
  },
  mounted() {
    this.getCurrentProduct()
    this.getCurrentOrder()
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
