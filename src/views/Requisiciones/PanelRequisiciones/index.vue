<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div class="nine">
        <h1>Panel de Requisiciones<span>Personal</span></h1>
      </div>
      <el-tabs type="border-card">
        <el-tab-pane label="Validación">
        <tableValidation  />
        </el-tab-pane>
        <el-tab-pane label="Consulta">
          <tableConsulta />
        </el-tab-pane>
        <el-tab-pane label="Reclutamiento">
         <tableAutorizadas />
        </el-tab-pane>
      </el-tabs>

    </el-card>
 <viewFile  ref="viewFile" />
     <ModalRequisition ref="ModalRequisition" />

  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import tableValidation from './components/tableValidation'
import tableConsulta from './components/tableConsulta'
import tableAutorizadas from './components/tableAutorizadas'
import viewFile from '../components/viewFile'
import ModalRequisition from './components/ModalRequisition'
export default {
  components: {
    tableValidation,
    tableConsulta,
    tableAutorizadas,
    viewFile,
    ModalRequisition
  },
  data() {
    return {
      HorariosList: [],
      search: '',
      btnloading: false,
      btnloading2: false
    }
  },
  beforeMount() {
    this.$root.$refs.PanelRequisiciones = this
  },
  created() {
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
/* Style 9
   ----------------------------- */
.nine h1 {
  text-align:center; font-size:25px; text-transform:uppercase; color:#222; letter-spacing:1px;
  font-family:Helvetica,Arial,sans-serif; font-weight:400;
}
.nine h1 span {
  margin-top: 5px;
    font-size:13px; color:#444; word-spacing:1px; font-weight:normal; letter-spacing:2px;
    text-transform: uppercase; font-family:"Raleway", sans-serif; font-weight:500;

    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    grid-template-rows: 27px 0;
    grid-gap: 20px;
    align-items: center;
}

.nine h1 span:after,.nine h1 span:before {
    content: " ";
    display: block;
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #ccc;
    height: 5px;
  background-color:#f8f8f8;
}

</style>
