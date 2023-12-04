<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="3" name="Publico"><span slot="label"><b-icon icon="hdd-fill" /> Publico</span></el-tab-pane>
  </el-tabs>
</template>
<script>
import Vuetable from './MyVuetable'
import { Notification } from 'element-ui'
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
export default {
  components: {
    Vuetable
  },
  data() {
    return {
      activeName: 'Publico',
      arrTab: [],
      tabId: 3
    }
  },
  created() {
    this.$root.$refs.TabPrivacidad = this
  },
  methods: {
    open(name) {
      this.$notify.success({
        title: 'Cargando..',
        message: 'Has seleccionado Documentos ' + name,
        offset: 100,
        duration: 2500
      })
    },
    async handleClick(tab) {
      this.$root.$refs.breadcrumb.arrpath = []
      this.$root.$refs.Browser.loadTable = false
      this.$root.$refs.Browser.isLoaded = true
      this.open(tab.name)
      this.tabId = tab.label
      const currentObj = this
      const config = {
        headers: { 'content-type': 'multipart/form-data' }
      }

      const formData = new FormData()
      formData.append('privacidadId', this.tabId)

      await Api.post('/getCarpetas', formData, config).then(res => {
        this.$root.$refs.Browser.carpetas = res.data[0].carpetas
        this.$root.$refs.Browser.archivos = res.data[0].archivos
        this.$root.$refs.Browser.isLoaded = false
        this.$root.$refs.Browser.loadTable = true
      }).catch(function(error) {
        console.log(error)
      })
    }
  }
}
</script>
