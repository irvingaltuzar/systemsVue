<template>
  <div class="app-container">
    <md-content class="p-3">
      <div class="nine">
        <h1>MIS PROVEEDORES<span>&nbsp</span></h1>
      </div>

           <div class="filter-container">
     <el-input v-model="search"  clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
   <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-s-custom" @click="handleAddProveedor" plain>Agregar Proveedor</el-button>
    </div>
       <el-table  v-loading="listLoading" :data="MySuppliers.filter(data => !search || data.id.toString().includes(search.toString()) || data.business_name.toLowerCase().includes(search.toLowerCase()) ||
     data.classification.toLowerCase().includes(search.toLowerCase()) ||  data.contact.toLowerCase().includes(search.toLowerCase()) || (data.created_at && data.created_at.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
     || (data.email && data.email.toLowerCase().indexOf(this.search.toLowerCase()) > -1) || (data.phone && data.phone.toLowerCase().indexOf(this.search.toLowerCase()) > -1)
     || (data.efo && data.efo.toLowerCase().indexOf(this.search.toLowerCase()) > -1))" style="width: 100%;" border>

       <el-table-column fixed align="center" label="No. Proveedor" width="120" prop="id">
      </el-table-column>

      <el-table-column align="center" label="Fecha"  width="180" prop="created_at">
      </el-table-column>

        <el-table-column align="center" label="Razón social / Nombre" width="300"  prop="business_name"   >
      </el-table-column>

        <el-table-column align="center" label="Especialidad" width="220"  prop="classification" >
      </el-table-column>
     <el-table-column align="center" label="Contacto de ventas" width="220"   prop="contact" >
      </el-table-column>
        <el-table-column align="center" label="Correo" width="220"   prop="email" >
      </el-table-column>
        <el-table-column align="center" label="Télefono" width="220"  prop="phone"  >
      </el-table-column>
      <el-table-column align="center" label="Cuenta bancaria" width="220"  prop="bank_account"  >
      </el-table-column>
      <el-table-column align="center" label="EFO" width="220"   prop="efo" >
      </el-table-column>
   <el-table-column align="center" label="Página web/Formato" width="220"   prop="web_page" >
      </el-table-column>
         <el-table-column fixed="right"  align="center" label="Estatus" width="140"  >
      <template slot-scope="scope">
          <el-tag v-if="scope.row.status==0" type="warning" effects="dark">En proceso</el-tag>
       <el-tag v-if="scope.row.status==1" type="sucess" effects="dark">aprobado</el-tag>
       <el-tag v-if="scope.row.status==2" type="info" effects="dark">rechazado</el-tag>
       <el-tag v-if="scope.row.status==3" type="danger" effects="dark">bloqueado</el-tag>
       </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="Acciones" width="115">
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.update_user==1" content="Editar" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle @click="handleUpdateProveedor(scope)" :loading="btnloading" />
            </el-tooltip>
          </template>
        </el-table-column>

    </el-table>

  </md-content>
  <ModalNuevoProveedor ref="ModalNuevoProveedor" />

  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { mapGetters} from 'vuex'
import { deepClone } from '@/utils'
import ModalNuevoProveedor from './components/ModalNuevoProveedor'
export default {
  components: {
    ModalNuevoProveedor
  },
  data() {

    var validate = (rule, value, callback) => {
      if (value == '' || value == null) {
        return callback(new Error('Por favor Ingresa titulo'))
      } else {
        return callback()
      }
    }
    var ValidateDate = (rule, value, callback) => {
      if (value == '' || value == null) {
        return callback(new Error('Por favor Ingresa fecha'))
      } else {
        return callback()
      }
    }
    return {
     search:'',
   listLoading:false,
     btnloading:false,
     btnloading2:false,

    }
  },
  beforeMount() {
  },
  created() {
    this.$store.dispatch("getMySuppliers");
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'MySuppliers'
    ])
  },
  methods: {

  handleAddProveedor() {

      this.$root.$refs.ModalAddProveedor.dialogType = 'new'
      this.$root.$refs.ModalAddProveedor.dialogVisible = true
     this.$root.$refs.ModalAddProveedor.resetForm();

    },

   handleUpdateProveedor(scope) {

      const listArchivos = []
      const listArchivos2 = []
      const listArchivos3 = []
      const listArchivos4 = []
      const listArchivos5 = []
      const listArchivos6 = []
      const listArchivos7 = []
      const listArchivos8 = []
      const listArchivos9 = []
      const listArchivos10 = []
      const listArchivos11 = []
      const listArchivos12 = []
      const listArchivos13 = []
      const listArchivos14 = []
      const listArchivos15 = []
      const listArchivos16 = []
      const listArchivos17 = []
      const listArchivos18 = []
      const listArchivos19 = []

      this.$root.$refs.ModalAddProveedor.formProveedor= deepClone(scope.row);
     this.$root.$refs.ModalAddProveedor.ChangeCountry();
      for(let i=0;i<scope.row.get_document_supplier_all.length;i++){
        if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 1){
        listArchivos.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_ActaConstitutiva = listArchivos
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 2){
        listArchivos2.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_INE = listArchivos2
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 3){
        listArchivos3.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_ComprobanteDomicilio = listArchivos3
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 4){
        listArchivos4.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_CSF = listArchivos4
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 5){
        listArchivos5.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_OCOF = listArchivos5
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 6){
        listArchivos6.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_AltaIMSS = listArchivos6
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 7){
        listArchivos7.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_OCOIMSS = listArchivos7
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 8){
        listArchivos8.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_EstCuenta = listArchivos8
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 9){
        listArchivos9.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_CTB = listArchivos9
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 10){
        listArchivos10.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_CV = listArchivos10
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 12){
        listArchivos11.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_INE = listArchivos11
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 13){
        listArchivos12.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_COT1 = listArchivos12
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 14){
        listArchivos13.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_COM = listArchivos13
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 15){
        listArchivos14.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_RFI = listArchivos14
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 16){
        listArchivos15.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_REPSE = listArchivos15
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 17){
        listArchivos16.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_DAER = listArchivos16
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 18){
        listArchivos17.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_COT2 = listArchivos17
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 19){
        listArchivos18.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_COT3 = listArchivos18
        }else if(scope.row.get_document_supplier_all[i].cat_document_supplier_id == 20){
        listArchivos19.push({ name: scope.row.get_document_supplier_all[i].name, url: scope.row.get_document_supplier_all[i].url })
           this.$root.$refs.ModalAddProveedor.file_COT4 = listArchivos19
        }
      }
     this.$root.$refs.ModalAddProveedor.formProveedor.state=scope.row.state;
      this.$root.$refs.ModalAddProveedor.dialogType = 'edit'
      this.$root.$refs.ModalAddProveedor.dialogVisible = true
    },


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

  .clearfix:before,
  .clearfix:after {
    content: "";
  }
  .clearfix:after {
    clear: both
  }

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
