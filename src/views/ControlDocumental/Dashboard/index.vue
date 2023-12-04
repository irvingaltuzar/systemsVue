<template>
  <div class="app-container">
   <img id="logodatabox" src="@/img/logos/DATABOX LOGO.png"/>
    <panel-group />
   <!--  <panel-group-categ />  -->
    <el-divider content-position="center"><i class="el-icon-star-on" /> <span v-text="descripciondiv" /> <i class="el-icon-star-on" /></el-divider><br>
    <file-recently id="element" />

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PanelGroupCateg from './components/PanelGroupCateg'
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import FileRecently from './components/FileRecently.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    PanelGroupCateg,
    FileRecently

  },
  data() {
    return {
      descripciondiv: 'Archivos Subidos recientemente'
    }
  },
  computed: {
    ...mapGetters([
      'ubicacion'

    ])
  },

  created() {
    this.$root.$refs.Dash = this
  },
  created() {
    this.$nextTick(() => {
      this.ArchivosRecientes()
      setTimeout(() =>

        this.contadores(), 1000)
    })
  },
  methods: {
    async contadores() {

        const config = { headers: { 'content-type': 'multipart/form-data' }}
      // form data
      const formData = new FormData()
      formData.append('ubicacion', this.ubicacion)
      await Api.post('/getContadoresDocumentos', formData, config).then(res => {
        if (res.data[0].Consultas[0].numero != null && res.data[0].Descargas[0].numero != null) {
          this.$root.$refs.Contadores.contConsultas = parseInt(res.data[0].Consultas[0].numero)
          this.$root.$refs.Contadores.contDescargas = parseInt(res.data[0].Descargas[0].numero)
          this.$root.$refs.Contadores.contBusquedas = parseInt(res.data[0].Busquedas[0].numero)
          this.$root.$refs.Contadores.contFavoritos = parseInt(res.data[0].Favoritos[0].numero)
        }
      }).catch(function(error) {
        console.log(error)
      })
    },

    async ArchivosRecientes() {
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      // form data
      const formData = new FormData()
      formData.append('ubicacion', this.ubicacion)
      await Api.post('/getArchivosRecientes', formData, config).then(res => {
        this.$root.$refs.ArchivosRecientes.arrArchivos = res.data[0].archivos
      }).catch(function(error) {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  // background: url('../img/back_pattern-02.jpg');
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
#logodatabox{
     width: 33%;
    margin-top: -9%;
    margin-bottom: -9%;
    margin-left: 33%;
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
