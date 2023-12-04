<template>
<el-dialog  top="3vh" width="55%" center :visible.sync="dialogVisible" title="Crear Nuevo Tipo Permiso">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" label-position="left" enctype="multipart/form-data">

      <el-form-item label="Descripcion" class="ml-4" prop="permiso">
        <el-input v-model="ruleForm.permiso" clearable style="width:80%" />

      </el-form-item>
      <el-form-item label="Valor" class="ml-4" prop="permiso_val">
         <el-input maxlength="1" v-model="ruleForm.permiso_val" clearable style="width:80%" />
      </el-form-item>
    </el-form>

    <div style="text-align:right;">
      <el-button type="danger" @click="dialogVisible=false">Cancelar</el-button>
      <el-button :loading="btnloadPermiso" type="success" @click="validateForm('ruleForm')">Crear Tipo Permiso<i class="el-icon-upload el-icon-right" /></el-button>

    </div><br>
    <el-table v-loading="listLoading" :data="arrTipoPermisos" border fit highlight-current-row class="table-responsive-lg">
      <el-table-column prop="tipoPermiso_Id" label="ID" width="50" />

      <el-table-column width="250" align="center" label="descripcion">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.tipoPermiso_Desc" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancelar
            </el-button>
          </template>
          <span v-else>{{ row.tipoPermiso_Desc }}</span>
        </template>
      </el-table-column>

        <el-table-column width="200" align="center" label="Valor">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.tipoPermiso_Val" maxlength="1" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancelar
            </el-button>
          </template>
          <span v-else>{{ row.tipoPermiso_Val }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="borrado" align="center" label="Activo" width="80" >
        <template slot-scope="{row}">

          <el-switch
            v-model="row.borrado"
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="row.disabled"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            :loading="loading"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            Aceptar
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="row.edit=!row.edit;row.disabled=!row.disabled"
          >
            Editar
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

</template>
<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor

export default {
    name: 'Tipo_Permisos',
  data() {
      
  var validate = (rule, value, callback) => {
      if (value.trim() == '') {
        return callback(new Error('Por favor Ingresa '))
      } else {
        callback()
      }
    }
      return {
      list: null,
      listLoading: true,
      dialogVisible: false,

      arrTipoPermisos: [],
      listLoading: true,
      loading: false,
      btnloadPermiso: false,
      desactivar: true,
      ruleForm: {
        permiso: '',
        permiso_val: ''
      },
      rules: {
        permiso: [
          { required: true, message: 'Por favor Ingresa Descripcion Tipo Permiso', trigger: 'blur', validator: validate }
        ],
        permiso_val: [
          { required: true, message: 'Por favor Ingresa Valor Tipo Permiso', trigger: 'blur', validator: validate }
        ]
      }
    }
},
    mounted() {
        
    },
    methods: {
         async getTipoPermisos() {
      await Api.get('/getTipoPermisosAll').then(res => {
        this.listLoading = false
        const items = res.data
        this.arrTipoPermisos= items.map(v => {
          this.$set(v, 'edit', false)
          this.$set(v, 'disabled', true)
          v.originaldescripcion = v.tipoPermiso_Desc 
          v.originalVal = v.tipoPermiso_Val    //  will be used when user click the cancel botton
          v.originalborrado = v.borrado
          return v
        })
      }).catch(function(error) {
        console.log(error)
      })
    },
    cancelEdit(row) {
      row.tipoPermiso_Desc= row.originaldescripcion
      row.tipoPermiso_Val= row.originalVal
      row.borrado = row.originalborrado
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
     formData.append('tipoPermisoDesc', row.tipoPermiso_Desc)
      formData.append('tipoPermisoVal', row.tipoPermiso_Val)
      formData.append('tipoPermisoId', row.tipoPermiso_Id)
      formData.append('borrado', row.borrado)

      await Api.post('/EditarTipoPermiso', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Edito este registro TipoPermiso con ID ->' + row.tipoPermiso_Id + ' && descripcionOriginal ->' + row.originaldescripcion + '-> DescripcionNew->' + row.tipoPermiso_Desc + ' && borrado ' + row.borrado)
        formAut.append('evento', 'EditarTipoPermiso()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        row.edit = false
        row.disabled = true
        row.originaldescripcion = row.descripcion
        this.$message({
          message: 'Se ha modificado correctamente',
          type: 'success'
        })
        this.loading = false
      } else {
        this.$message({
          message: 'Ocurrio un error en el proceso',
          type: 'error'
        })
      }
    },
    async addTipoPermiso() {
      this.btnloadPermiso = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}

      const formData = new FormData()
      formData.append('tipoPermisoDesc', this.ruleForm.permiso)
      formData.append('tipoPermisoVal',  this.ruleForm.permiso_val)
      formData.append('borrado', 0)

      await Api.post('/addTipoPermiso', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Creo un nuevo dato de Tipo Permiso->' + this.ruleForm.topico)
        formAut.append('evento', 'addTipoPermiso()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$message({
          message: 'Se ha agregado correctamente',
          type: 'success'
        })
        this.btnloadPermiso = false
        this.listLoading = true
        this.ruleForm.permiso=''
        this.ruleForm.permiso_val=''
        this.getTipoPermisos()
      } else {
        this.$message({
          message: 'Ocurrio un error en el proceso',
          type: 'error'
        })
      }
    },
    validateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addTipoPermiso()
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      })
    }
  },
    computed: {
    
    },
}

</script>

<style lang="scss">
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
