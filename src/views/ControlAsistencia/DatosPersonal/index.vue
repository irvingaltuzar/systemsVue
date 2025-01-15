<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
      <el-button :loading="btnloading" class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-s-custom" plain @click="updateInfoIntelisis">Actualizar Info</el-button>
      <!-- <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-view" @click="handleCrearPermisos" plain>Crear Tipo Permisos</el-button>-->

    </div>

    <el-table
      v-loading="listLoading"
      :data="UsuariosList.filter(data => !search || data.full_name.toLowerCase().includes(search.toLowerCase()))"
      border
      style="width: 100%;"
    >

      <el-table-column fixed align="center" label="No Empleado" width="115">
        <template slot-scope="scope">
          {{ scope.row.personal_id }}
        </template>
      </el-table-column>
      <!-- <el-table-column  align="center" label="No Empleado Anterior" width="115">
        <template slot-scope="scope">
          {{ scope.row.previous_personal_id }}
        </template>
      </el-table-column> -->
      <el-table-column  align="center" label="Nombre" prop="Nombre" width="250">
        <template slot-scope="scope">
          {{ scope.row.name }} {{ scope.row.last_name }}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="Fecha Nacimiento" width="150">
        <template slot-scope="scope">
          {{ scope.row.birth }}
        </template>
      </el-table-column> -->
      <!-- <el-table-column align="center" label="Sexo" width="90">
        <template slot-scope="scope">
          {{ scope.row.sex }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="Ubicación" width="140">
        <template slot-scope="scope">
          {{ scope.row.location }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Puesto" width="240">
        <template slot-scope="scope">
          {{ scope.row.position_company }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Departamento" width="240">
        <template slot-scope="scope">
          {{ scope.row.deparment }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Email Empresa" width="280">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Razon Social" width="300">
        <template slot-scope="scope">
          {{ scope.row.company_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Usuario" width="150">
        <template slot-scope="scope">
          {{ scope.row.usuario_ad }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="90">
        <template slot-scope="scope">
          <el-tag type="success" effect="dark"> {{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Acciones" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" @click="showModalSettings(scope.row)" size="small" circle><i class="fa-solid fa-gear"></i></el-button>
        </template>
       </el-table-column>
    </el-table>
    
    <modalUserSettings ref="modalUserSettings" />

  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { deepClone } from '@/utils'
import modalUserSettings from './modalUserSettings'

export default {
  components: {
    modalUserSettings
  },
  data() {
    return {
      UsuariosList: [],
      search: '',
      btnloading: false

    }
  },
  beforeMount() {
    this.$root.$refs.AdminUsuarios = this
  },
  created() {
    this.getUsuarios()
  },

  methods: {

    async getUsuarios() {
      this.listLoading = true
      const currentObj = this
      await Api.get('/controlAsistencia/getDatosPersonalIntelisis').then(res => {
        // currentObj.data=res.data;
        this.UsuariosList = res.data
        this.listLoading = false
      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })
    },

    async updateInfoIntelisis() {
      this.listLoading = true
      this.btnloading = true
      const currentObj = this

      await Api.get('/controlAsistencia/updatePersonalIntelisisSP').then(res => {
        currentObj.status = res.status
      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })

      if (currentObj.status === 200) {
        this.getUsuarios()

        this.$message({
          message: 'Se ha actualizado correctamente',
          type: 'success'
        })
        this.listLoading = false
        this.btnloading = false
      }
    },

    handleAddRole() {
      this.$root.$refs.ModalCrearUsuario.ClearModal()
      this.$root.$refs.ModalCrearUsuario.getSubsecciones()
      this.$root.$refs.ModalCrearUsuario.getTipoPermisos()
      this.$root.$refs.ModalCrearUsuario.dialogType = 'new'
      this.$root.$refs.ModalCrearUsuario.dialogVisible = true
    },
    handleEdit(scope) {
      this.$root.$refs.ModalCrearUsuario.methodThatForcesUpdate()
      this.$root.$refs.ModalCrearUsuario.ClearModal()
      this.$root.$refs.ModalCrearUsuario.getSubsecciones()
      this.$root.$refs.ModalCrearUsuario.getTipoPermisos()
      this.$root.$refs.ModalCrearUsuario.getSubseccionesUsuario(scope)
      this.$root.$refs.ModalCrearUsuario.dialogType = 'edit'
      this.$root.$refs.ModalCrearUsuario.dialogVisible = true
      this.$root.$refs.ModalCrearUsuario.usuarioId = scope.row.usuarioId
      this.$root.$refs.ModalCrearUsuario.ruleForm = deepClone(scope.row)
    },
    handleCrearPermisos() {
    //   this.$root.$refs.ModalTipoPermisos.getSubsecciones();
    //  this.$root.$refs.ModalCrearUsuario.getTipoPermisos();
      this.$refs.ModalTipoPermisos.getTipoPermisos()
      this.$refs.ModalTipoPermisos.dialogVisible = true
    },

    showModalSettings(_data){
      this.$refs.modalUserSettings._tempCreated(_data);
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
