<template>
  <el-dialog :key="renderKey" width="60vw" :visible.sync="dialogVisible" center top="5vh" :title="dialogType==='edit'?'Editar Usuario':'Nuevo Usuario'" @close="methodThatForcesUpdate">
    <el-form ref="ruleForm" :model="ruleForm" label-width="140px" :rules="rules" label-position="left">
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="ruleForm.nombre" clearable placeholder="Nombre" />
      </el-form-item>
      <el-form-item label="Apellido Paterno" prop="apePat">
        <el-input v-model="ruleForm.apePat" clearable placeholder="Apellido Paterno" />
      </el-form-item>
      <el-form-item label="Apellido Materno" prop="apeMat">
        <el-input v-model="ruleForm.apeMat" clearable placeholder="Apellido Materno" />
      </el-form-item>
      <el-form-item label="Usuario" prop="usuario">
        <el-input v-model="ruleForm.usuario" clearable placeholder="Nombre Usuario" />
      </el-form-item>
      <el-container>
        <el-switch
          v-model="ruleForm.roles"
          style="display: block;margin-left:20%"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
          active-text="Administrador"
          inactive-text="Usuario"
        />
        <el-switch
          v-model="ruleForm.borrado"
          style="display: block;margin-left:10%"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="Activo"
          :active-value="0"
          :inactive-value="1"
          inactive-text="No Activo"
        />
      </el-container><br>

      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        border
        fit
        :data="SubseccionList"
        style="width: 100%"
        @selection-change="handleSelectionChange($event)"
      >
        <el-table-column
          type="selection"
          width="55"
          property="key"
        />
          <el-table-column
          label="Nombre Sección"
        >
          <template slot-scope="scope">

            <p v-if="scope.row.secId != null">{{ scope.row.seg_seccion.secDesc }}</p>
            <p v-else>{{  scope.row.seccion_top.subsecDesc }}</p>
          
          </template>

        </el-table-column>

        <el-table-column
          label="Nombre Subsección"
        >
          <template slot-scope="scope">{{ scope.row.subsecDesc }}</template>
        </el-table-column>
    

        <el-table-column label="Permisos">
          <template slot-scope="scope">
            <el-select
              v-model="perm[scope.row.subsecId]"
              multiple
              placeholder="Selecciona permisos para esta subsección"
              @change="handleCheckAllChange($event,scope.row.subsecId)"
            >
              <el-option
                v-for="item in tipoPermisos"
                :key="item.tipoPermiso_Val"
                :label="item.tipoPermiso_Desc"
                :value="item.tipoPermiso_Val"
              />
            </el-select>

          </template>
        </el-table-column>
      </el-table>

    </el-form>
    <br>
    <div style="text-align:right;">
      <el-button type="danger" @click="dialogVisible=false;ClearModal()">Cancelar</el-button>
      <el-button :loading="btnloading" type="primary" @click="confirmUsuario('ruleForm')">Confirmar</el-button>

    </div>
  </el-dialog>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { deepClone } from '@/utils'
export default {

  data() {
    var validate = (rule, value, callback) => {
      if (value.trim() == '') {
        return callback(new Error('Por favor Ingresa titulo'))
      } else {
        return callback()
      }
    }
    return {
      renderKey: 0,
      usurioId: '',
      tipoPermisos: [],
      checkList: [], 
      perm: [],
      permisos: [],
      controlSeleccion: [],
      ruleForm: {
        nombre: '',
        apePat: '',
        apeMat: '',
        usuario: '',
        roles: 0,
        borrado: 0

      },
      rules: {
        nombre: [
          { required: true, message: 'Por favor Ingresa el Nombre', trigger: 'blur', validator: validate }
        ],
        apePat: [
          { required: true, message: 'Por favor Ingresa el Apellido Paterno', trigger: 'blur', validator: validate }
        ],
        apeMat: [
          { required: true, message: 'Por favor Ingresa el Apellido Materno', trigger: 'blur', validator: validate }
        ],
        usuario: [
          { required: true, message: 'Por favor Ingresa el Nombre de Usuario', trigger: 'blur', validator: validate }
        ],
        roles: [
          { required: true, message: 'Por favor Ingresa Roles', trigger: 'change' }
        ],
        activo: [
          { required: true, message: 'Por favor Ingresa Activo', trigger: 'change' }
        ]
      },
      routes: [],
      SubseccionList: [],
      listLoading: true,
      dialogVisible: false,
      dialogType: 'new',
      btnloading: false

    }
  },

  beforeMount() {
    this.$root.$refs.ModalCrearUsuario = this
  },
  created() {
    this.getUsuarios()
  },
  methods: {
    handleSelectionChange(val) {
      var res = []
      val.forEach(row => {
        if (!this.controlSeleccion.includes(row.subsecId)) {
          this.controlSeleccion.push(row.subsecId)
        }
        res.push(row.subsecId)
      })

      if (val.length > 0) {
        for (var a = 0; a < val.length; a++) {
          for (var i = 0; i < this.tipoPermisos.length; i++) {
            this.perm[val[a].subsecId].splice(i, 1, this.tipoPermisos[i].tipoPermiso_Val)
          }
          var bol = false
          for (var i = 0; i < this.permisos.length; i++) {
            if (this.permisos[i].nSubseccion == val[a].subsecId) {
              this.permisos.splice(i, 1, { nSubseccion: val[a].subsecId, crud: this.perm[val[a].subsecId].join(',') })
              bol = true
            }
          }
          if (bol == false) {
            this.permisos.push({ nSubseccion: val[a].subsecId, crud: this.perm[val[a].subsecId].join(',') })
          }
        }

        for (var i = 0; i < this.controlSeleccion.length; i++) {
          if (res.includes(this.controlSeleccion[i])) {

          } else {
            this.permisos.forEach(item => {
              if (item.nSubseccion == this.controlSeleccion[i]) {
                item.crud = ''
              }
            })
            this.perm[this.controlSeleccion[i]].splice(0, this.tipoPermisos.length)
          }
        }
      } else {
        for (var i = 0; i < this.perm.length; i++) {
          if (this.perm[i] !== undefined) {
            if (this.perm[i].length == this.tipoPermisos.length) {
              this.perm[i].splice(0, this.tipoPermisos.length)
            }
          }
        }
        this.permisos.forEach(item => {
          item.crud = ''
        })
      }
    },

    handleCheckAllChange(val, id) {
      var bol = false
      var crud = val
      for (var i = 0; i < this.permisos.length; i++) {
        if (this.permisos[i].nSubseccion == id) {
          this.permisos.splice(i, 1, { nSubseccion: id, crud: crud.join(',') })
          bol = true
        }
      }
      if (bol == false) {
        this.permisos.push({ nSubseccion: id, crud: crud.join(',') })
      }

      // console.log(this.permisos)
    },
    async getUsuarios() {
      this.$root.$refs.AdminUsuarios.listLoading = true
      const currentObj = this
      await Api.get('/getUsuarios').then(res => {
        currentObj.data = res.data
        this.$root.$refs.AdminUsuarios.UsuariosList = res.data
        this.$root.$refs.AdminUsuarios.listLoading = false
      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })
    },
    async getSubsecciones() {
      this.listLoading = true
      const currentObj = this
      await Api.get('/getSeccionesPermisos').then(res => {
        currentObj.data = res.data

        this.SubseccionList = currentObj.data
        this.listLoading = false
      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })
    },
    async getSubseccionesUsuario(scope) {
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('usuarioId', scope.row.usuarioId)
      const currentObj = this
      await Api.post('/getSubseccionesUsuario', formData, config).then(res => {
        currentObj.data = res.data
   
      for (var i = 0; i < res.data.length; i++) {
        this.controlSeleccion.push(res.data[i].subsecId)
        // console.log(this.SubseccionList)
        this.SubseccionList.forEach(element => {
          if (element.subsecId == res.data[i].subsecId) {
            element.key = true
          } else {
            if (element.key != true) {
              element.key = false
            }
          }
        })
      }

      //checks de tabla permisos
        const rowsToToggle = this.SubseccionList.filter(row => row.key)
      this.toggleSelection(rowsToToggle)

      //reiniciamos los parametros de permisos
          this.perm.forEach(element => {
        if (element) {
          element.length = 0
        }
      })

      //asignamos permisos asignados de logincrud
  for (var i = 0; i < res.data.length; i++) {
   var arraylogincrud = res.data[i].loginCrud.split(',')
        if (this.perm[res.data[i].subsecId]) {
          for (var a = 0; a < arraylogincrud.length; a++) {
            this.perm[res.data[i].subsecId].splice(a, 1, arraylogincrud[a])
          }
        }
        this.permisos.splice(i, 1, { nSubseccion: res.data[i].subsecId, crud: res.data[i].loginCrud })
      }
      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })

    },
    toggleSelection(rows) {
      // console.log(rows)
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    async getTipoPermisos() {
      const currentObj = this
      await Api.get('/getTipoPermisos').then(res => {
        // currentObj.data=res.data;
        this.tipoPermisos = res.data
      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })
    },
    ClearModal() {
      this.methodThatForcesUpdate()
      const form = this.$refs.ruleForm
      this.ruleForm.nombre = ''
      this.ruleForm.apePat = ''
      this.ruleForm.apeMat = ''
      this.ruleForm.usuario = ''
      this.ruleForm.roles = 0
      this.ruleForm.borrado = 1
      this.permisos = []
      this.btnloading = false
      if (form != undefined) {
        this.resetForm()
      }
    },
    methodThatForcesUpdate() {
      // ...
      this.perm = []
      this.renderKey++
      this.$nextTick(this.$forceUpdate())
      // Observe que tenemos que usar un $ aquí
      // ...
    },
   

    async confirmUsuario(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const isEdit = this.dialogType === 'edit'

          if (isEdit) {
            this.editarUsuario()
          } else {
            this.addUsuario()
          }
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      })
    },
    async addUsuario() {
      this.btnloading = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('nombre', this.ruleForm.nombre)
      formData.append('apePat', this.ruleForm.apePat)
      formData.append('apeMat', this.ruleForm.apeMat)
      formData.append('usuario', this.ruleForm.usuario)
      formData.append('roles', this.ruleForm.roles)
      formData.append('borrado', this.ruleForm.borrado)
      formData.append('permisos', JSON.stringify(this.permisos))
      await Api.post('/addUsuario', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Creo un nuevo usuario->' + this.ruleForm.usuario)
        formAut.append('evento', 'addUsuario()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$message({
          message: 'Se ha agregado correctamente',
          type: 'success'
        })
        this.btnloading = false
        this.dialogVisible = false
        this.ClearModal()
        this.getUsuarios()
      }
    },
    async editarUsuario() {
      this.btnloading = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}

      const formData = new FormData()
      formData.append('usuarioId', this.usuarioId)
      formData.append('nombre', this.ruleForm.nombre)
      formData.append('apePat', this.ruleForm.apePat)
      formData.append('apeMat', this.ruleForm.apeMat)
      formData.append('usuario', this.ruleForm.usuario)
      formData.append('roles', this.ruleForm.roles)
      formData.append('borrado', this.ruleForm.borrado)
      formData.append('permisos', JSON.stringify(this.permisos))
      await Api.post('/EditarUsuario', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se Editó Usuario->' + this.ruleForm.usuario + ' Detalles: No Activo ' + this.ruleForm.borrado + ' Administrador: ' + this.ruleForm.roles + ' Permisos: ' + JSON.stringify(this.permisos))
        formAut.append('evento', 'editarUsuario()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$message({
          message: 'Se ha Modificado correctamente',
          type: 'success'
        })
        this.btnloading = false
        this.dialogVisible = false
        this.ClearModal()
        this.getUsuarios()
      }
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
