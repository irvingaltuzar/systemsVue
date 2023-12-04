<template>
  <div class="app-container">
      <div class="tab-container">
<el-tabs type="border-card">
  <el-tab-pane>
    <span slot="label"><i class="el-icon-download"></i>  Reporte Archivos Descargados</span>
    <TblArchDescargados ref="Descargados" />
  </el-tab-pane>
  <el-tab-pane > <span slot="label"><i class="el-icon-view"></i>  Reporte Archivos Consultados</span>
  <TblArchConsul /> </el-tab-pane>
  <el-tab-pane>  <span slot="label"><i class="el-icon-search"></i>  Reporte Busquedas</span>
  <TblBusqueda /></el-tab-pane>
</el-tabs>
  </div>
      
  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import TblArchDescargados from './components/tableArchDesc'
import TblArchConsul from './components/tableArchConsul'
import TblBusqueda from './components/tableBusqueda'

import { deepClone } from '@/utils'
export default {
  components: {
    TblArchDescargados,
    TblArchConsul,
    TblBusqueda
  },
  data() {
 
    return {
      UsuariosList: [],
      search:'',
    }
  },
  created() {
  },
 
  methods: {
   
   
  
  
    handleAddRole() {
   
    
    },
    handleEdit(scope) {
 
      
    },
    handleCrearPermisos(){

    }
  
  }
}
</script>

<style lang="scss" scoped>

.buscador{
  width: 30%;
  float: right;
}
</style>
