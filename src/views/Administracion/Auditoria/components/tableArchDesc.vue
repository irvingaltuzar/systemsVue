<template>
  <div class="app-container">
    
<fieldset class="scheduler-border">
    <legend class="scheduler-border">Personalizar Reporte</legend>

      <el-form :inline="true" label-position="top" class="demo-form-inline">
          <el-form-item  label="Fecha de Eventos:">
        <el-date-picker 
            v-model="date1"
            type="datetimerange"
            range-separator="A"
            start-placeholder="Fecha Inicio"
            end-placeholder="Fecha Final"
             :default-time="['00:00:00', '23:59:59']"
             value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
          <el-form-item class="ml-1" style="width: 27%;" label="Usuario:">
          <el-select clearable v-model="usuario" filterable placeholder="Selecciona Usuario">
          <el-option 
            v-for="item in UsuariosList"
            :key="item.usuario"
            :label="item.nombre+' '+item.apePat+' '+item.apeMat"
            :value="item.usuario">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item style="width: 27%;" class="ml-1" label="Documento:">
          <el-select clearable v-model="titulo" filterable placeholder="Selecciona Titulo Documento">
          <el-option 
            v-for="item in DocumentosList"
            :key="item.documentoId"
            :label="item.titulo"
            :value="item.titulo">
          </el-option>
        </el-select>
        </el-form-item>
      
          <el-button style="margin-left: 40%;" class="filter-item" type="primary" icon="el-icon-notebook-2" @click="generarReporteDescargas" plain>Generar Reporte</el-button>
        <el-form-item></el-form-item>
        </el-form>
      </fieldset>
      
 <el-input v-show="total>0" v-model="search" clearable class="filter-item w-25" placeholder="Buscar en reporte">  <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
 

    
    <el-table  v-loading="listLoading" :data="ReporteList.filter(data => !search || data.usuarioConsulta.toLowerCase().includes(search.toLowerCase()) ||
     data.fechaEvento.toLowerCase().includes(search.toLowerCase()) ||
     data.archivoDocumento.toLowerCase().includes(search.toLowerCase()) ||
     data.comentarios.toLowerCase().includes(search.toLowerCase()))" style="width: 100%;"  class="mt-2" border>
   
      <el-table-column align="center" label="Usuario Consulta" width="150" >
        <template slot-scope="scope">
          {{ scope.row.usuarioConsulta }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Fecha Evento" width="120" >
        <template slot-scope="scope">
          {{ scope.row.fechaEvento }}
        </template>
      </el-table-column>
        <el-table-column align="center" label="Archivo Documento"  >
        <template slot-scope="scope">
          {{ scope.row.archivoDocumento }}
        </template>
      </el-table-column>
        <el-table-column align="center" label="Titulo Documento" >
        <template slot-scope="scope">
          {{ scope.row.tituloDocumento }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Comentarios" width="400">
        <template slot-scope="scope">
          {{ scope.row.comentarios }}
        </template>
      </el-table-column>
      
    </el-table>

     <pagination v-show="total>0" :total="total" :page-sizes="[100, 200,500, 1000]" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="generarReporteDescargas" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor


export default {
  components: { Pagination },
  data() {
    return {
      UsuariosList: [],
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
         this.listLoading= true;
          const currentObj = this
          await Api.get('/getUsuarios').then(res => {
          currentObj.data=res.data;
          this.UsuariosList=res.data;
          this.listLoading= false;
          }).catch(function(error) {
            currentObj.error=error;
            console.log(error);
          })
    },
     async getTituloDocumentos(){
          const currentObj = this
          await Api.get('/getTitulosDocumentos').then(res => {
          this.DocumentosList=res.data;
          }).catch(function(error) {
            currentObj.error=error;
            console.log(error);
          })
    },
     async generarReporteDescargas(){
       this.listLoading= true;
        this.search=''
          const currentObj = this
           const config = { headers: { 'content-type': 'multipart/form-data' }}
      if(this.date1===null){
        this.date1='';
      }
      const formData = new FormData()
      formData.append('usuario', this.usuario)
      formData.append('titulo', this.titulo)
      formData.append('fechas', this.date1)
      formData.append('pagina',this.listQuery.page)
      formData.append('limite',this.listQuery.limit)

          await Api.post('/generarReporteDescargas', formData, config).then(res => {
            this.ReporteList=res.data[0].data;
          this.listLoading= false;
          this.total=res.data[0].total;
          }).catch(function(error) {
            currentObj.error=error;
            console.log(error);
          })
    }
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


