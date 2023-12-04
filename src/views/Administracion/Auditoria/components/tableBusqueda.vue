<template>
  <div class="app-container">

  <el-select class="filter-item w-50" clearable v-model="usuario" filterable placeholder="Selecciona Usuario">
          <el-option 
            v-for="item in UsuariosList"
            :key="item.usuario"
            :label="item.nombre+' '+item.apePat+' '+item.apeMat"
            :value="item.usuario">
          </el-option>
        </el-select>
          <el-button class="filter-item ml-4" type="primary" icon="el-icon-notebook-2" @click="generarReporteBusquedas" plain>Generar Reporte</el-button><br>
       <el-input v-show="total>0" v-model="search" clearable class="filter-item w-25 mt-4" placeholder="Buscar en reporte">  <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>

    
    <el-table  v-loading="listLoading" :data="ReporteList.filter(data => !search || data.usuarioConsulta.toLowerCase().includes(search.toLowerCase()) ||
     data.cadenaBusqueda.toLowerCase().includes(search.toLowerCase()) )" style="width: 100%;" class="mt-2" border>
   
      <el-table-column align="center" label="Usuario Consulta"  >
        <template slot-scope="scope">
          {{ scope.row.usuarioConsulta }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Cadena Busqueda" >
        <template slot-scope="scope">
          {{ scope.row.cadenaBusqueda }}
        </template>
      </el-table-column>
        <el-table-column align="center" label="Total" >
        <template slot-scope="scope">
          {{ scope.row.total }}
        </template>
      </el-table-column>
      
    </el-table>
     <pagination v-show="total>0" :total="total" :page-sizes="[50, 100,150, 200]" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="generarReporteBusquedas" />

  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
   components: { Pagination },
  data() {
    return {
      UsuariosList: [],
      search:'',
      ReporteList: [],
      DocumentosList: [],
      listLoading:false,
      date1: '',
      search:'',
      titulo:'',
      usuario:'',
        listQuery: {
        page: 1,
        limit: 100,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
         total: 0, 
    }
  },
  created() {
  this.getUsuarios();
    this.getTituloDocumentos();
  },
  methods: {
      async getUsuarios(){
          const currentObj = this
          await Api.get('/getUsuarios').then(res => {
          currentObj.data=res.data;
          this.UsuariosList=res.data;
          }).catch(function(error) {
            currentObj.error=error;
            console.log(error);
          })
    },
     async getTituloDocumentos(){
          const currentObj = this
          await Api.get('/getTitulosDocumentos').then(res => {
          currentObj.data=res.data;
          this.DocumentosList=res.data;
          }).catch(function(error) {
            currentObj.error=error;
            console.log(error);
          })
    },
     async generarReporteBusquedas(){
       this.listLoading= true;
       this.search=''
          const currentObj = this
           const config = { headers: { 'content-type': 'multipart/form-data' }}
      
      const formData = new FormData()
      formData.append('usuario', this.usuario)
      formData.append('pagina',this.listQuery.page)
      formData.append('limite',this.listQuery.limit)
          await Api.post('/generarReporteBusquedas', formData, config).then(res => {
           this.ReporteList=res.data[0].data;
          this.listLoading= false;
          this.total=res.data[0].total;
          }).catch(function(error) {
            currentObj.error=error;
            console.log(error);
          })
    },
    
  }
}
</script>
<style lang="scss" scoped>

.buscador{
  width: 30%;
  float: right;
}

fieldset.scheduler-border {
    border: 1px groove #ffffff75 !important;
    padding: 0 1.4em 1.4em 1.4em !important;
    margin: 0 0 1.5em 0 !important;
    -webkit-box-shadow:  0px 0px 0px 0px rgba(0, 0, 0, 0.658);
            box-shadow:  0px 0px 0px 0px rgba(0, 0, 0, 0.37);
}

    legend.scheduler-border {
        font-size: 1.2em !important;
        font-weight: bold !important;
        text-align: left !important;
        width:auto;
        padding:0 10px;
        border-bottom:none;
    }
</style>


