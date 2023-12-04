<template>
  <div class="container-doc">
      <img id="logodatabox" src="@/img/logos/DATABOX LOGO.png"/>
    <div class="text-center">
      <h4>Administrador de Documentos</h4>
    </div>
    <div class="d-block">
      <Navbar />
    </div>

    <!-- <div class="files-container">   -->
    <Vuetable ref="browser" />

    <!-- </div>  -->

    <ModalArchivo ref="ModalArchivo" />

  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import Navbar from './components/Navbar'
import Vuetable from './components/MyVuetable'
import TabPrivacidadDoc from './components/TabPrivacidadDoc'
import ModalArchivo from './components/ModalArchivo'

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}
export default {
  components: {
    TabPrivacidadDoc,
    Navbar,
    Vuetable,
    ModalArchivo
  },

  data() {
    return {
      isloaded: false
    }
  },

  async created() {
    await this.$nextTick(() => {
      this.cargaManager()
      setTimeout(() =>
        this.$root.$refs.ModalArchivo.cargaSelects(),
      1000)
    })
  },
  methods: {
    async cargaManager() {
      this.$refs.browser.isLoaded = true

      await Api.post('/getCarpetas').then(res => {
        this.$refs.browser.isLoaded = false
        this.$refs.browser.loadTable = true
        this.$refs.browser.carpetas = res.data[0].carpetas
        this.$refs.browser.archivos = res.data[0].archivos
        this.$refs.browser.prueba = res.data[0]
      }).catch(function(error) {
        console.log(error)
      })
    }

  }

}
</script>

<style lang="scss">

  @import 'https://use.fontawesome.com/releases/v5.7.0/css/all.css';
    .el-select{

    width: 100%;
      }
  .container-doc{
       padding: 2%;
    position: relative;
    }

  .files-container{
    margin-top: 0px;
    height: auto;
    width:100%;
    // overflow: overlay;
    padding: 1%;
    border: white 4px ridge;

}
#logodatabox{
     width: 24%;
    margin-top: -10%;
    margin-bottom: -15%;
    margin-left: 2%;
}

</style>
