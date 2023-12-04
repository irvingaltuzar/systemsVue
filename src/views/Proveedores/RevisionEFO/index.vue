<template>
  <div class="app-container">
    <md-content class="p-3">
      <div class="nine">
        <h1>CONTRALORIA PROVEEDORES<span> Revisión EFO </span></h1>
      </div>

           <div class="filter-container">
     <el-input  v-show="total>0" v-model="search" @change="handleSearch" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
    </div>
       <el-table  v-loading="listLoading" :data="SuppliersEFO" style="width: 100%;" border>

       <el-table-column fixed align="center" label="No. Proveedor" width="120" prop="id">
      </el-table-column>
        <el-table-column align="center" label="Folio Intelisis" width="120" prop="referencia_intelisis">
      </el-table-column>
        <el-table-column align="center" label="RFC" width="150"  prop="rfc">
  </el-table-column>
        <el-table-column align="center" label="Razón social / Nombre" width="300"  prop="business_name"   >
      </el-table-column>

        <el-table-column align="center" label="Tipo" width="150"  prop="type_supplier" >
      </el-table-column>

        <el-table-column align="center" label="Correo" width="220"   prop="email" >
      </el-table-column>
        <el-table-column align="center" label="Télefono" width="220"  prop="phone"  >
      </el-table-column>

        <el-table-column fixed="right"  width="400px"  align="center" label="Estatus EFO">
        <template slot-scope="{row}">
          <template v-if="row.edit">
          <el-select v-model="row.efo" filterable class="w-50" style="right:6%" clearable placeholder="seleccionar:">
              <el-option
                v-for="item in optionsEFO"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancelar
            </el-button>
            <br>
            <el-upload
                class="upload-demo"
                action="#"
                :key="row.id"
                ref="file_efo"
                v-model="filename"
                :on-preview="handlePreview"
                 :on-exceed="handleExceed"
                 :on-change="handleChange"
                :before-upload="beforeUploadFile"
                :limit="1"
                :auto-upload="false"
                >
                    <el-tooltip content="Subir archivo" placement="top">
                <el-button type="info" icon="el-icon-upload" class="mt-2"  circle></el-button>
                 </el-tooltip>
              </el-upload>
       </template>
       <div v-else>
       <el-tag >{{row.efo}}</el-tag>
        <el-link v-if="row.get_document_supplier" :href="row.get_document_supplier.file_url"
        target="_blank" type="info" icon="el-icon-document  el-icon--right" class="ml-2" >EFO</el-link>

       </div>
       </template>
      </el-table-column>
    <el-table-column align="center" label="Fecha"  width="180" prop="created_at">
      </el-table-column>
      <el-table-column fixed="right" align="center" label="Acciones" width="115">
                <template slot-scope="{row}">
         <el-tooltip v-if="row.edit" content="Guardar" placement="top">
          <el-button

            :loading="loading"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Guardar
          </el-button>
        </el-tooltip>
         <el-tooltip  v-else content="Editar" placement="top">
          <el-button

            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit;row.disabled=!row.disabled"
          >
            Editar
          </el-button>
        </el-tooltip>
          </template>
        </el-table-column>

    </el-table>
  </md-content>
<pagination v-show="total>0" :total="total" :page-sizes="[500, 800]" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="suppliersEFO" />

  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { mapGetters} from 'vuex'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
components: { Pagination },
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
     loading:false,
     upfile:'',
      listQuery: {
        page: 1,
        limit: 500,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
       total: 1,
     filename:'',
       optionsEFO: [{
          value: 'O.K.',
          label: 'O.K.'
        }, {
          value: 'PREVENTIVO',
          label: 'PREVENTIVO'
        }, {
          value: 'DEFINITIVO',
          label: 'DEFINITIVO'
        }
      ],
    }
  },
  beforeMount() {
  },
  created() {
     const formData = new FormData()
       formData.append('pagina',this.listQuery.page)
      formData.append('limite',this.listQuery.limit)
     this.$store.dispatch("getSuppliersEFO",formData).then(res=>{
      this.total=res.total
       console.log(res);
    });
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'SuppliersEFO'
    ])
  },
  methods: {
suppliersEFO(){
  this.listLoading=true;
const formData = new FormData()
       formData.append('pagina',this.listQuery.page)
      formData.append('limite',this.listQuery.limit)
    this.$store.dispatch("getSuppliersEFO",formData).then(res=>{
     this.total=res.total
       console.log(res);
       this.listLoading=false;
    });
},
 handleSearch() {
 this.listLoading=true;
 if(this.search!=""){
  const formData = new FormData()
      formData.append('search',this.search)
    this.$store.dispatch("getSuppliersEFOSearch",formData).then(res=>{
     this.total=res.total
       this.listLoading=false;
    });
 }else{
      this.suppliersEFO();
 }


    },



    confirmRequisition(formName){
       this.$refs[formName].validate((valid) => {
        if (valid) {
          // const isEdit = this.dialogType === 'edit'

          // if (isEdit) {
            // this.editarUsuario();
          // } else {
            this.addRequisition()
          // }
        } else {
           this.$notify({
          title: 'Información Incompleta',
          message: 'Falta capturar Informacion',
          type: 'warning',
          offset: 50
        });
          return false
        }
      })
    },
  cancelEdit(row) {
      row.efo = row.originaldescripcion
      row.deleted = row.originalborrado
      row.edit = false
      row.disabled = true
      this.$message({
        message: 'No se ha realizado ningun cambio',
        type: 'warning'
      })
    },
   async confirmEdit(row) {
      this.loading = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}

      const formData = new FormData()
      formData.append('efo', row.efo)
      formData.append('id', row.id)
     if (this.upfile != '') {
          formData.append('file', this.upfile.raw);
      if (row.get_document_supplier != null) {
          formData.append('delete', row.get_document_supplier.name);
      }
    }

      // formData.append('deleted', row.deleted)
      // console.log(row.dmi_cat_status_recruitment.description)
      await Api.post('/suppliers/updateStatusEFO', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
        this.listLoading=true;


        row.edit = false
        row.disabled = true
        row.originaldescripcion = row.description
            this.$store.dispatch("getSuppliersEFO");
        this.$notify({
          title: 'Estatus Actualizado',
          message: currentObj.res.success,
          type: 'success',
          offset: 50
        });

       const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se Editó EFO -> Detalles: ' + row.efo)
        formAut.append('evento', 'updateStatusEFO()')
         formAut.append('id_afectado', row.id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
      }).catch(function(error) {
       this.$message({
          message: 'Ocurrio un error en el proceso',
          type: 'error'
        })
      })


        this.listLoading = false
        this.loading = false
        this.upfile=''

    },
     handleRemove(file, fileList) {
      Api.get('/deletefile/' + file.raw.name).then(res => {
        this.$message.warning(`El archivo ha sido removido correctamente`)
      })
    },
    handlePreview(file) {
      console.log(file)
    },
    handleChange(file, fileList) {
     this.upfile =file
      console.log(file)
    },
     async beforeUploadFile(file, fileList) {
      const currentObj = this
      const fileType = file.raw.type
      const isLt2M = file.size
       const isPDF =  'application/pdf'
      let bool = false
      const ext = []
      let split
      await Api.get('/getCatTipoAdjunto').then(res => {
        currentObj.data = res.data
        for (var i = 0; i < currentObj.data.length; i++) {
          split = currentObj.data[i].extension.split('.')
          ext.push(split[1])
          if (currentObj.data[i].mimeType == fileType && isPDF==fileType) {
            if (isLt2M >= currentObj.data[i].tamanioPermitido) {
              this.$message.error('El archivo supera el peso maximo admitido para este formato es: ' + this.bytesToSize(currentObj.data[i].tamanioPermitido))
              fileList.pop()
            }
            bool = true
          }
        }
        if (!bool) {
          this.$message.error('El archivo debe contener los siguientes formatos pdf' )
          fileList.pop()
        }
      }).catch(function(error) {
        console.log(error)
      })
    },
   handleExceed(files, fileList) {
      this.$message.warning(`El límite es de un solo archivo intentas seleccionar ${files.length} archivo esta vez`)
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
