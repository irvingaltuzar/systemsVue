<template>
  <div class="container-doc">
  <img id="logodatabox" src="@/img/logos/DATABOX LOGO.png"/>

    <div class="text-center">
      <h4>Consulta de Documentos</h4>
    </div>
    <div class="d-block">
      <Navbar />
    </div>

    <!-- <div class="files-container">   -->
    <Vuetable ref="browser" />
    <!--
           </div>  -->
  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import Navbar from './components/blocks/Navbar'
import Vuetable from './components/MyVuetable'
import TabPrivacidadDoc from './components/TabPrivacidadDoc'
import { mapGetters } from 'vuex'

export default {
  components: {
    TabPrivacidadDoc,
    Navbar,
    Vuetable
  },

  data() {
    return {
      isloaded: false

    }
  },
  computed: {
    ...mapGetters([
      'ubicacion'

    ])
  },

  async beforeMount() {
    await this.$nextTick(() => {
      this.cargaManager()
      this.cargaSelects()
    })
  },
  methods: {
    async cargaManager() {
      this.$refs.browser.isLoaded = true
      const currentObj = this
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }

      const formData = new FormData()
      formData.append('ubicacion', this.ubicacion)
      await Api.post('/getCarpetaspublic', formData, config).then(res => {
        this.$refs.browser.isLoaded = false
        this.$refs.browser.loadTable = true
        this.$refs.browser.carpetas = res.data[0].carpetas
        this.$refs.browser.archivos = res.data[0].archivos
      }).catch(function(error) {
        console.log(error)
      })
    },
    async cargaSelects() {
      /** *Peticion para obtener informacion Catalogos Selects Crear/Editar Archivos */
      Api.get('/getCmbArchivos').then(res => {
        // Buscador
        this.$root.$refs.Buscador.dataCatTipoDoc = res.data[0].CatTipoDoc
        this.$root.$refs.Buscador.dataCatModulo = res.data[0].CatModulo
        this.$root.$refs.Buscador.dataCatTopico = res.data[0].CatTopico
        this.$root.$refs.Buscador.dataCatArea = res.data[0].CatArea

        // tabs
        this.$root.$refs.TabPrivacidad.arrTab = res.data[0].CatPrivacidad
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
  .container{
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
