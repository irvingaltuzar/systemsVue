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
              type="search"
                minlength="3" required
              class="form-control rounded"
              placeholder="Buscar Documento"
              aria-label="Buscar Documento"
              v-model="query"
              aria-describedby="search-addon"
               v-on:keyup.enter="buscar"
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

        <div class="col-8" />
        <div class="col-1 ml-4">
          <div class="btn-group" role="group">

            <button
              type="button"
              class="btn btn-secondary"
              title="Actualizar"
              @click="refreshAll()"
            >
              <i class="fas fa-sync-alt" />
            </button>

            <button class="btn btn-secondary" title="Nueva Carpeta" icon="el-icon-folder-add" @click="handleAddCarpeta"><i class="far fa-folder" /></button>
            <button class="btn btn-secondary" title="Nuevo Archivo" icon="el-icon-document" @click="handleAddArchivo"><i class="far fa-file" /></button>
            <button class="btn btn-secondary" title="Nuevo Topico" icon="el-icon-document" @click="handleAddTopico"><i class="fas fa-tags" /></button>
            <button class="btn btn-secondary" title="Nuevo Tipo Documento" icon="el-icon-document" @click="handleAddTipoDoc"><i class="fas fa-file-invoice" /></button>
            <button class="btn btn-secondary" title="Nueva Privacidad Documento" icon="el-icon-document" @click="handleAddPrivacidad"><i class="fas fa-user-lock" /></button>
            <button class="btn btn-secondary" title="Nuevo Modulo" icon="el-icon-document" @click="handleAddModulo"><i class="fas fa-object-group" /></button>
            <button class="btn btn-secondary" title="Nueva Area" icon="el-icon-document" @click="handleAddArea"><i class="fas fa-layer-group" /></button>

          </div>
        </div><br>
      </div>

    </div>

    <TabPrivacidadDoc />
    <Breadcrumb />

    <ModalFolder ref="ModalFolder" />
    <ModalTopico ref="ModalTopico" />
    <ModalTipoDoc ref="ModalTipoDoc" />
    <ModalPrivacidad ref="ModalPrivacidad" />
    <ModalModulo ref="ModalModulo" />
    <ModalArea ref="ModalArea" />

  </div>
</template>

<script>
import ModalFolder from './ModalFolder'
import Breadcrumb from './Breadcrumb'
import TabPrivacidadDoc from './TabPrivacidadDoc'
import ModalTopico from './ModalTopico'
import ModalTipoDoc from './ModalTipoDoc'
import ModalPrivacidad from './ModalPrivacidad'
import ModalModulo from './ModalModulo'
import ModalArea from './ModalArea'
export default {
  components: {
    ModalFolder,
    ModalTipoDoc,
    Breadcrumb,
    TabPrivacidadDoc,
    ModalTopico,
    ModalPrivacidad,
    ModalModulo,
    ModalArea
  },
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
        if(this.query.length>2){
      this.$root.$refs.Browser.buscar(this.query, this.tipoDoc, this.Area, this.topico, this.Modulo)
        }else{
          this.$message.warning("Busqueda debe contener al menos 3 letras...")
        }
    },
    handleAddArchivo() {
      this.$root.$refs.ModalArchivo.dialogType = 'new'
      this.$root.$refs.ModalArchivo.dialogVisible = true
      this.$root.$refs.ModalArchivo.cargaSelects()
      this.$root.$refs.ModalArchivo.vaciarModalArchivo()
    },
    handleAddCarpeta() {
      this.$refs.ModalFolder.dialogType = 'new'
      this.$refs.ModalFolder.dialogfolderVisible = true
      this.$refs.ModalFolder.vaciarModalFolder()
    },
    handleAddTopico() {
      this.$refs.ModalTopico.dialogTopicoVisible = true
      this.$refs.ModalTopico.loadTopicos()
    },
    handleAddTipoDoc() {
      this.$refs.ModalTipoDoc.dialogTopicoVisible = true
      this.$refs.ModalTipoDoc.loadTipoDoc()
    },
    handleAddPrivacidad() {
      this.$refs.ModalPrivacidad.dialogTopicoVisible = true
      this.$refs.ModalPrivacidad.loadPrivacidad()
    },
    handleAddModulo() {
      this.$refs.ModalModulo.dialogTopicoVisible = true
      this.$refs.ModalModulo.loadModulos()
    },
    handleAddArea() {
      this.$refs.ModalArea.dialogTopicoVisible = true
      this.$refs.ModalArea.loadArea()
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
