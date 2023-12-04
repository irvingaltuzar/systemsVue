<template>
  <el-dialog top="3vh" width="55%" center :visible.sync="dialogVisible" title="Crear Nuevo Tipo Justificación">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" label-position="left" enctype="multipart/form-data">

      <el-form-item label="Descripcion" class="ml-4" prop="description">
        <el-input v-model="ruleForm.description" clearable style="width:80%" />

      </el-form-item>

    </el-form>

    <div style="text-align:right;">
      <el-button type="danger" @click="dialogVisible=false">Cancelar</el-button>
      <el-button :loading="btnloadPermiso" type="success" @click="validateForm('ruleForm')">Crear Tipo Justificación<i class="el-icon-upload el-icon-right" /></el-button>

    </div><br>

    <el-table v-loading="listLoading" :data="TypeJustifications" border fit highlight-current-row class="table-responsive-lg">
      <el-table-column prop="id" label="ID" width="50" />

      <el-table-column width="250" align="center" label="descripcion">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.description" class="edit-input" size="small" />
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
          <span v-else>{{ row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="deleted" align="center" label="Activo" width="80">
        <template slot-scope="{row}">

          <el-switch
            v-model="row.deleted"
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
  name: 'TipoJustificacion',
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

      typeJustificationTbl: [],

      listLoading: true,
      loading: false,
      btnloadPermiso: false,
      desactivar: true,
      ruleForm: {
        description: ''
      },
      rules: {
        description: [
          { required: true, message: 'Por favor Ingresa Descripcion', trigger: 'blur', validator: validate }
        ]
      }
    }
  },

  computed: {

    TypeJustifications() {
      return this.$store.getters.typeJustificationTbl
    }
  },
  created() {
    try {
      this.listLoading = false
    } catch (error) {
      console.error(error)
    }
  },
    beforeMount() {
    this.$root.$refs.ModalTipoJustification = this
  },

  methods: {

    cancelEdit(row) {
      row.description = row.originaldescripcion
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
      formData.append('description', row.description)
      formData.append('id', row.id)
      formData.append('deleted', row.deleted)

      await Api.post('/controlAsistencia/updateTypeJustification', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
        row.edit = false
        row.disabled = true
        row.originaldescripcion = row.description
        this.$message({
          message: 'Se ha modificado correctamente',
          type: 'success'
        })
        this.loading = false
           const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se editó tipo justificación -> description:' + row.description)
        formAut.append('evento', 'updateTypeJustification()')
        formAut.append('id_afectado', row.id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
      }).catch(function(error) {
       this.$message({
          message: 'Ocurrio un error en el proceso',
          type: 'error'
        })
      })

    },
    async addTypeJustification() {
      this.btnloadPermiso = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}

      const formData = new FormData()
      formData.append('description', this.ruleForm.description)

      await Api.post('/controlAsistencia/addTypeJustification', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
        this.$message({
          message: 'Se ha agregado correctamente',
          type: 'success'
        })
        this.btnloadPermiso = false
        this.listLoading = true
        this.ruleForm.permiso = ''
        this.ruleForm.permiso_val = ''
        this.$store.dispatch('getTypeJustification')
        this.listLoading = false

            const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se agregó tipo justificación -> description:' + this.ruleForm.description)
        formAut.append('evento', 'addTypeJustification()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
      }).catch(function(error) {
      this.$message({
          message: 'Ocurrio un error en el proceso',
          type: 'error'
        })
      })

    
    },
    validateForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addTypeJustification()
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      })
    }
  }

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
