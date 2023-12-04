<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div v-scroll-to="'#element'" class="card-panel"  @click="ArchivosMasFavoritos">
        <div class="card-panel-icon-wrapper icon-star">
          <svg-icon icon-class="BOTON_FAVORITOS" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Favoritos
          </div>
          <count-to :start-val="0" :end-val="contFavoritos" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div  v-scroll-to="'#element'" class="card-panel" @click="ArchivosMasDescargados">
        <div class="card-panel-icon-wrapper icon-download ">
          <svg-icon icon-class="BOTON_DESCARGAS" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Más Descargados
          </div>
          <count-to :start-val="0" :end-val="contDescargas" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div  v-scroll-to="'#element'" class="card-panel" @click="ArchivosMasVisitados">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="BOTON_VISITADOS" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Más Visitados
          </div>
          <count-to :start-val="0" :end-val="contConsultas" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div v-scroll-to="'#element'" class="card-panel" @click="ArchivosMasBuscados">
        <div class="card-panel-icon-wrapper icon-search">
          <svg-icon icon-class="BOTON_BUSCADOS" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Más Buscados
          </div>
          <count-to :start-val="0" :end-val="contBusquedas" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { mapGetters } from 'vuex'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      contConsultas: 0,
      contDescargas: 0,
      contBusquedas:0,
      contFavoritos:0,
      var: ''
    }
  },
  created() {
    this.$root.$refs.Contadores = this
  },
  computed: {
    ...mapGetters([
      'ubicacion'

    ])
  },
  methods: {
    async ArchivosMasDescargados() {
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      // form data
      const formData = new FormData()
      formData.append('ubicacion', this.ubicacion)

      await Api.post('/getArchivosMasDescargados', formData, config).then(res => {
        this.$root.$refs.ArchivosRecientes.arrArchivos = res.data
        this.$root.$refs.ArchivosRecientes.actFavorite = 0

      }).catch(function(error) {
        console.log(error)
      })
      this.$parent.descripciondiv = 'Archivos Más Descargados'
    },
    async ArchivosMasVisitados() {
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      // form data
      const formData = new FormData()
      formData.append('ubicacion', this.ubicacion)
      await Api.post('/getArchivosMasVisitados', formData, config).then(res => {
        this.$root.$refs.ArchivosRecientes.arrArchivos = res.data
        this.$root.$refs.ArchivosRecientes.actFavorite = 0

      }).catch(function(error) {
        console.log(error)
      })
      this.$parent.descripciondiv = 'Archivos Más Visitados'
    },
    async ArchivosMasBuscados() {
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      // form data
      const formData = new FormData()
      formData.append('ubicacion', this.ubicacion)
      await Api.post('/getArchivosMasBuscados', formData, config).then(res => {
        this.$root.$refs.ArchivosRecientes.arrArchivos = res.data
        this.$root.$refs.ArchivosRecientes.actFavorite = 0

      }).catch(function(error) {
        console.log(error)
      })
      this.$parent.descripciondiv = 'Archivos Más Buscados'
    },
    async ArchivosMasFavoritos() {
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      // form data
      const formData = new FormData()
      formData.append('ubicacion', this.ubicacion)
      await Api.post('/getArchivosMasFavoritos', formData, config).then(res => {
        this.$root.$refs.ArchivosRecientes.arrArchivos = res.data
        this.$root.$refs.ArchivosRecientes.actFavorite = 1
      }).catch(function(error) {
        console.log(error)
      })
      this.$parent.descripciondiv = 'Archivos Más Favoritos'
    }
  }

}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 110px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    border-radius:50px;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .20);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-star {
        background: #ffbc01
      }

      .icon-download {
        background: #389701;
      }
      .icon-people {
        background: #0072bc;
      }
     .icon-search {
        background:#ff793d
      }
    }

    .icon-star {
      color: #e5ff00fd;
    }

    .icon-download {
      color: #389701;
    }
    .icon-people {
        color: #0072bc;
      }
    .icon-search {
        color: #5286e7;
      }

    .card-panel-icon-wrapper {
   float: left;
    margin: 8px 0px 0 11px;
    padding: 10px;
    -webkit-transition: all 0.38s ease-out;
    transition: all 0.38s ease-out;
    border-radius: 50px;
    }

    .card-panel-icon {
      float: left;
      font-size: 65px;
    }

    .card-panel-description {
      // float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 41%;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
          margin-left: 12%;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 10px auto !important;
      float: none !important;
    }
  }
}
</style>
