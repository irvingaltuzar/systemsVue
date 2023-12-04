<template>
  <div class="fm-navbar">
    <div class="row justify-content-between">
      <div class="col-11 ml-5 mb-3">
        <el-card class="box-card">

          <div class="input-group mb-3">
            <span id="search-addon" class="input-group-text border-0">
              <i class="fas fa-search" />
            </span>
            <input
              v-model="query"
              minlength="3"
              required
              type="search"
              class="form-control rounded"
              placeholder="Buscar Documento"
              aria-label="Buscar Documento"
              aria-describedby="search-addon"
              @keyup.enter="buscar"
            >
            <button type="button" class="btn btn-outline-primary" @click="buscar">Buscar</button>
          </div>
          <div class="input-group ">
            <div class="input-group selects">
              <el-select v-model="tipoDoc" clearable placeholder="Tipo de Documento">
                <el-option
                  v-for="item in dataCatTipoDoc"
                  :key="item.tipoDocumentoId"
                  :label="item.nombreTipoDocumento"
                  :value="item.tipoDocumentoId"
                />
              </el-select>
            </div>
            <div class="input-group selects">
              <el-select v-model="topico" clearable placeholder="Topico">
                <el-option
                  v-for="item in dataCatTopico"
                  :key="item.topicoId"
                  :label="item.descripcion"
                  :value="item.topicoId"
                />
              </el-select>
            </div>
            <div class="input-group selects">
              <el-select v-model="Area" clearable placeholder="Area">
                <el-option
                  v-for="item in dataCatArea"
                  :key="item.areaId"
                  :label="item.descripcion"
                  :value="item.areaId"
                />
              </el-select>
            </div>
            <div class="input-group selects">
              <el-select v-model="Modulo" clearable placeholder="Modulo">
                <el-option
                  v-for="item in dataCatModulo"
                  :key="item.moduloId"
                  :label="item.descripcion"
                  :value="item.moduloId"
                />
              </el-select>
            </div>
          </div>
        </el-card>
      </div>

      <div class="row col-12">

        <div class="col-11">
          <Breadcrumb />
        </div>
        <div class="col-1">
          <div class="btn-group" role="group">

            <button
              type="button"
              class="btn btn-secondary"
              title="refresh"
              @click="refreshAll()"
            >
              <i class="fas fa-sync-alt" />
            </button>

            <!-- <button  class="btn btn-secondary" :title="lang.btn.folder" @click="handleAddCarpeta" icon="el-icon-folder-add" ><i class="far fa-folder"/></button>
                   <button class="btn btn-secondary" :title="lang.btn.file" @click="handleAddArchivo" icon="el-icon-document" ><i class="far fa-file"/></button> -->
          </div>
        </div><br>
      </div>

    </div>
    <TabPrivacidadDoc />

  </div>
</template>

<script>
// import translate from '../../mixins/translate'
import Breadcrumb from '../Breadcrumb'
import TabPrivacidadDoc from '../TabPrivacidadDoc'
export default {
  components: {
    Breadcrumb,
    TabPrivacidadDoc
  },
  // mixins: [translate],
  data() {
    return {
      query: '',
      dataCatTipoDoc: [],
      dataCatTopico: [],
      dataCatArea: [],
      dataCatModulo: [],
      tipoDoc: '',
      Area: '',
      Modulo: '',
      topico: ''

    }
  },
  created() {
    this.$root.$refs.Buscador = this
  },
  methods: {
    refreshAll() {
      this.$root.$refs.Browser.refreshAll()
    },

    buscar() {
      if (this.query.length > 2) {
        this.$root.$refs.Browser.buscar(this.query, this.tipoDoc, this.Area, this.topico, this.Modulo)
      } else {
        this.$message.warning('Busqueda debe contener al menos 3 letras...')
      }
    }

  }
}
</script>

<style lang="scss" scoped>
    .fm-navbar {
        padding: 2%;
        .btn-group {
            margin-right: 0.4rem;
        }
    }

        .input-group {
      width: auto;
    }

      .input-group {
        width: auto;
        .selects{
              margin-left: 1.5%;
        }
        .labels{
          margin-left: 30px;
        }
      }

      .input-group input,
      .input-group .form-notch,
      .input-group .form-notch-trailing {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
      }

      .input-group button {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
</style>
