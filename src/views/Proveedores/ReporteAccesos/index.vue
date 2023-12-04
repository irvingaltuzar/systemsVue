<template>
  <div class="app-container">
    <md-content class="p-3">
      <div class="nine">
        <h1>REPORTE DE ACCESOS<span>PROVEEDORES </span></h1>
      </div>

           <div class="filter-container">
     <el-input  v-model="search"  clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
    </div>
       <el-table  v-loading="listLoading" :data="ReportAccess.filter(data => !search ||
     data.name.toLowerCase().includes(search.toLowerCase()) ||
     data.last_name.toLowerCase().includes(search.toLowerCase()) ||  data.usuario_ad.toLowerCase().includes(search.toLowerCase()) ||
     data.subsecDesc.toLowerCase().includes(search.toLowerCase()))" style="width: 100%;" border>

     <el-table-column align="center" type="index" label="No." width="100">
      </el-table-column>
       <el-table-column  align="center" label="Nombre" width="250" prop="name">
      </el-table-column>
      <el-table-column  align="center" label="Apellidos" width="280" prop="last_name">
      </el-table-column>
      <el-table-column  align="center" label="Usuario" width="150" prop="usuario_ad">
      </el-table-column>
        <el-table-column  align="center" label="Email" width="280" prop="email">
      </el-table-column>
        <el-table-column  align="center" label="Modulo" width="180" prop="subsecDesc">
      </el-table-column>

    </el-table>
  </md-content>

  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { mapGetters} from 'vuex'
export default {
components: {  },
  data() {

    return {
     search:'',
     listLoading:false,
     btnloading:false,
     btnloading2:false,
     loading:false,
    }
  },

  created() {

     this.$store.dispatch("getReportAccessSupplier");
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'ReportAccess'
    ])
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }
// .clearfix {
//   background: #3f5465 !important;
//   color: white;
// }
  .clearfix:before,
  .clearfix:after {
    // display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  //   .el-header, .el-footer {
  //   background-color: #B3C0D1;
  //   color: #333;
  //   text-align: center;
  //   line-height: 60px;
  // }
/* Style 9
   ----------------------------- */
   .nine h1 {
  text-align:center; font-size:30px; text-transform:uppercase; color:#222; letter-spacing:1px;
  font-family:Helvetica,Arial,sans-serif; font-weight:400;
}
.nine h1 span {
  margin-top: 5px;
    font-size:15px; color:#444; word-spacing:1px; font-weight:normal; letter-spacing:2px;
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
