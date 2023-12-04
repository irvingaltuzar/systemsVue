<template>
  <div class="app-container">
       <div class="filter-container">
     <el-input v-model="search"  clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search"></i></el-input>
   <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-s-custom" @click="handleAddRole" plain>Agregar Usuario</el-button>
   <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-view" @click="handleCrearPermisos" plain>Crear Tipo Permisos</el-button>
      
    </div>
 
    
    <el-table  v-loading="listLoading" :data="UsuariosList.filter(data => !search || data.nombre.toLowerCase().includes(search.toLowerCase()) ||
     data.apePat.toLowerCase().includes(search.toLowerCase()) ||
     data.apeMat.toLowerCase().includes(search.toLowerCase()) ||
     data.usuario.toLowerCase().includes(search.toLowerCase()))" style="width: 100%;" border>
   
      <el-table-column align="center" label="ID" width="80" >
        <template slot-scope="scope">
          {{ scope.row.usuarioId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Nombre" prop="Nombre">
        <template slot-scope="scope">
          {{ scope.row.nombre }}
        </template>
      </el-table-column>
        <el-table-column align="center" label="Apellido Paterno" >
        <template slot-scope="scope">
          {{ scope.row.apePat }}
        </template>
      </el-table-column>
        <el-table-column align="center" label="Apellido Materno" >
        <template slot-scope="scope">
          {{ scope.row.apeMat }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Usuario" >
        <template slot-scope="scope">
          {{ scope.row.usuario }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Permisos" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roles==1" effect="plain" type="success" >Administrador</el-tag>
          <el-tag v-else  effect="plain" >Usuario</el-tag>
        </template>
      </el-table-column>
        <el-table-column align="center" label="Estado" width="110">
        <template slot-scope="scope">
           <el-tag v-if="scope.row.borrado==0" type="success" effect="dark">Activo</el-tag>
          <el-tag  v-else  type="danger" effect="dark" >No Activo</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Acciones">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleEdit(scope)" size="small" icon="el-icon-edit">Editar</el-button>
        </template>
       </el-table-column>
    </el-table>

 <ModalCrearUsuario ref="ModalCrearUsuario" />
  <ModalTipoPermisos ref="ModalTipoPermisos" />
  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { deepClone } from '@/utils'
import ModalCrearUsuario from './components/ModalCrearUsuario'
import ModalTipoPermisos from './components/ModalTipoPermisos'
export default {
  components: {
   ModalCrearUsuario,
  ModalTipoPermisos
  },
  data() {
 
    return {
      UsuariosList: [],
      search:'',
    }
  },
  beforeMount(){
  this.$root.$refs.AdminUsuarios = this
  },
  created() {
    this.getUsuarios();
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
  
    handleAddRole() {
      this.$root.$refs.ModalCrearUsuario.ClearModal();
      this.$root.$refs.ModalCrearUsuario.getSubsecciones();
     this.$root.$refs.ModalCrearUsuario.getTipoPermisos();
      this.$root.$refs.ModalCrearUsuario.dialogType = 'new'
      this.$root.$refs.ModalCrearUsuario.dialogVisible = true
    },
    handleEdit(scope) {
     this.$root.$refs.ModalCrearUsuario.methodThatForcesUpdate()
     this.$root.$refs.ModalCrearUsuario.ClearModal();
     this.$root.$refs.ModalCrearUsuario.getSubsecciones();
     this.$root.$refs.ModalCrearUsuario.getTipoPermisos();
     this.$root.$refs.ModalCrearUsuario.getSubseccionesUsuario(scope)

      this.$root.$refs.ModalCrearUsuario.usuarioId=scope.row.usuarioId;
    this.$root.$refs.ModalCrearUsuario.ruleForm = deepClone(scope.row)
         this.$root.$refs.ModalCrearUsuario.dialogType = 'edit'
     this.$root.$refs.ModalCrearUsuario.dialogVisible = true
      
    },
    handleCrearPermisos(){
    //   this.$root.$refs.ModalTipoPermisos.getSubsecciones();
    //  this.$root.$refs.ModalCrearUsuario.getTipoPermisos();
    this.$refs.ModalTipoPermisos.getTipoPermisos()
      this.$refs.ModalTipoPermisos.dialogVisible = true
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
