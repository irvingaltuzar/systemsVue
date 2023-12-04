<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <panel-group  />
    <panel-group-categ />
      <el-divider content-position="center"><i class="el-icon-star-on"></i> Archivos Subidos Recientemente <i class="el-icon-star-on"></i></el-divider><br>
  <file-recently/>
    <!-- <lista-recientes /> -->
    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row> -->

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PanelGroupCateg from './components/PanelGroupCateg'
import ListaRecientes from './components/ListaRecientes'
import Api from "@/store/modules/Api" //Clase Api donde se declara Axios y la ruta al servidor
import FileRecently from './components/FileRecently.vue'


// const lineChartData = {
//   newVisitis: {
//     expectedData: [100, 120, 161, 134, 105, 160, 165],
//     actualData: [120, 82, 91, 154, 162, 140, 145]
//   },
//   messages: {
//     expectedData: [200, 192, 120, 144, 160, 130, 140],
//     actualData: [180, 160, 151, 106, 145, 150, 130]
//   },
//   purchases: {
//     expectedData: [80, 100, 121, 104, 105, 90, 100],
//     actualData: [120, 90, 100, 138, 142, 130, 130]
//   },
//   shoppings: {
//     expectedData: [130, 140, 141, 142, 145, 150, 160],
//     actualData: [120, 82, 91, 154, 162, 140, 130]
//   }
// }

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    PanelGroupCateg,
    ListaRecientes,
    FileRecently
   
  },
  data() {
    return {
      // lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    async contadores(){
      await Api.get('/getContadoresDocumentos').then(res=>{
        this.$root.$refs.Contadores.contConsultas= parseInt(res.data[0].Consultas[0].numero);
        this.$root.$refs.Contadores.contDescargas= parseInt(res.data[0].Descargas[0].numero);
        
              }).catch(function (error) {
                       console.log(error);
            });
    },
    
   async ArchivosRecientes(){
      await Api.get('/getArchivosRecientes').then(res=>{
        this.$root.$refs.ArchivosRecientes.arrArchivos=res.data[0].archivos;
        
              }).catch(function (error) {
                       console.log(error);
            });
   },  
  },
    async beforeMount() {  
        await this.$nextTick(() => {
          this.ArchivosRecientes();
            this.contadores();
           
          });
      },
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
