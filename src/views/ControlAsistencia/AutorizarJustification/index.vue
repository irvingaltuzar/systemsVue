<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div class="nine">
        <h1>Autorizar Justificación<span>Mi Personal</span></h1>
      </div>
      <div class="filter-container">
        <el-input v-model="search" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
      </div>
      <div class="filter-container" />
 <el-table
        v-loading="listLoading"
        :data="JustificationsMyPersonal.filter(data => !search || data.description.toLowerCase().includes(search.toLowerCase()) )"
        style="width: 100%;"
        border
      >
       <el-table-column  align="center" label="No." width="80" prop="id">
        </el-table-column>
          <el-table-column align="center" label="Status" width="110">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.approved_by=='' || scope.row.approved_by==null" type="warning" effect="dark">Pendiente</el-tag>
            <el-tooltip v-else :content="'por: '+scope.row.approved_by" placement="top">
               <el-tag  type="success" effect="dark">Autorizado</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
         <el-table-column  align="center" label="Usuario" width="150" prop="user">
        </el-table-column>
        <el-table-column  align="center" label="Fecha" width="150" prop="date">
        </el-table-column>
  <el-table-column  align="center" label="Tipo" width="220" >
   <template slot-scope="scope">
            {{ scope.row.dmirh_cat_type_justification.description }}
          </template>
  
        </el-table-column>
        <el-table-column  label="Descripción" width="700" prop="description">
        </el-table-column>
       
    <el-table-column fixed='right' align="center" label="Acciones" width="155">
          <template slot-scope="scope">
            <el-tooltip content="Detalles" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle :loading="btnloading" @click="handleDetailJustification(scope)" />
            </el-tooltip>
             <el-tooltip content="Autorizar" placement="top">
              <el-button type="success" icon="el-icon-check" circle :loading="btnloading" @click="autorizarJustification(scope.row.id)" />
            </el-tooltip>
            <el-tooltip content="Rechazar" placement="top">
              <el-button type="danger" icon="el-icon-close" circle :loading="btnloading" @click="rechazarJustification(scope.row.id)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
 <ModalJustification ref="ModalJustification" />
  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { deepClone } from '@/utils'
import { mapGetters} from 'vuex'
import ModalJustification from '../HorariosDependientes/components/ModalJustification'
export default {
  components: {
  ModalJustification
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
    this.$root.$refs.ViewHorariosPersonal = this
  },
  created() {
           this.listLoading=true;

      this.$store.dispatch('getJustificationsMyPersonal').then(res =>{
      });
        this.listLoading=false;


  },
computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'JustificationsMyPersonal',
    ])
  },
  methods: {

  handleDetailJustification(scope){
         const listArchivos = []
      this.$refs.ModalJustification.ruleForm.userAd = scope.row.user
      this.$refs.ModalJustification.ruleForm.typeJus = scope.row.dmirh_cat_type_justification.description
       this.$refs.ModalJustification.ruleForm.Comentarios = scope.row.description
       this.$refs.ModalJustification.ruleForm.FechaInicio = scope.row.date
       if(scope.row.file!=null && scope.row.file !=""){
        listArchivos.push({ name: scope.row.file, url: scope.row.file_url })
         this.$refs.ModalJustification.fileList = listArchivos
      }else{
         this.$refs.ModalJustification.fileList=[];
      }
       this.$refs.ModalJustification.isDisabled =true;
       this.$refs.ModalJustification.dialogType = 'edit'
       this.$refs.ModalJustification.dialogVisible = true
    },

    async autorizarJustification(Id) {
      const currentObj = this
      const id = Id
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('id', id)
      this.btnloading = true
      await Api.post('/controlAsistencia/autorizarJustification', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
          const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se autorizo Justificacion con Id ')
        formAut.append('evento', 'autorizarHorario()')
        formAut.append('id_afectado', id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$notify({
          title: 'Proceso Exitoso',
          message: currentObj.res['success'],
          type: 'success'
        })
        this.btnloading = false
        this.listLoading=true;

      this.$store.dispatch('getJustificationsMyPersonal');
        this.listLoading=false;

      }).catch(function(error) {
        console.log(error)
      })
  
    
    },
    async rechazarJustification(Id) {
      const currentObj = this
      const id = Id
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('id', id)
       this.btnloading = true
      await Api.post('/controlAsistencia/rechazarJustification', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
          const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se rechazó justificacion con Id')
        formAut.append('evento', 'rechazarJustification()')
        formAut.append('id_afectado', id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$notify({
          title: 'Proceso Exitoso',
          message: currentObj.res['success'],
          type: 'success'
        })
        this.btnloading = false
        this.$store.dispatch('getJustificationsMyPersonal');
      }).catch(function(error) {
        console.log(error)
      })

    }

  }
}
</script>

<style lang="scss" scoped>
/* Style 9
   ----------------------------- */
.nine h1 {
  text-align:center; font-size:40px; text-transform:uppercase; color:#222; letter-spacing:1px;
  font-family:"Playfair Display", serif; font-weight:400;
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
