<template>
  <el-dialog v-if="dialogTopicoVisible" top="3vh" width="55%" center :visible.sync="dialogTopicoVisible" title="Crear Nuevo Modulo">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" label-position="left" enctype="multipart/form-data">

      <el-form-item label="Descripcion" class="ml-4" prop="modulo">
        <el-input v-model="ruleForm.modulo" clearable style="width:80%" />

      </el-form-item>
    </el-form>

    <div style="text-align:right;">
      <el-button type="danger" @click="dialogTopicoVisible=false">Cancelar</el-button>
      <el-button :loading="btnloadtopic" type="success" @click="validateForm('ruleForm')">Crear Modulo<i class="el-icon-upload el-icon-right" /></el-button>

    </div><br>
    <el-table v-loading="listLoading" :data="arrModulo" border fit highlight-current-row class="table-responsive-lg">
      <el-table-column prop="moduloId" align="center" label="ID" width="80" />

      <el-table-column width="300" align="center" label="descripcion">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.descripcion" class="edit-input" size="small" />
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
          <span v-else>{{ row.descripcion }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="borrado" align="center" label="Activo">
        <template slot-scope="{row}">

          <el-switch
            v-if="row.borrado==1"
            v-model="row.borrado"
            active-value="0"
            inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="row.disabled"
          />

          <el-switch
            v-else
            v-model="row.borrado"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="0"
            inactive-value="1"
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
  name: 'CrearTopico',

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
      dialogTopicoVisible: false,

      arrModulo: [],
      listLoading: true,
      loading: false,
      btnloadtopic: false,
      desactivar: true,
      ruleForm: {
        modulo: ''
      },
      rules: {
        modulo: [
          { required: true, message: 'Por favor Ingresa topico', trigger: 'blur', validator: validate }
        ]
      }
    }
  },
  created() {

  },
  methods: {
    async loadModulos() {
      await Api.get('/getCatModulo').then(res => {
        this.listLoading = false
        const items = res.data
        this.arrModulo = items.map(v => {
          this.$set(v, 'edit', false)
          this.$set(v, 'disabled', true)
          v.originaldescripcion = v.descripcion //  will be used when user click the cancel botton
          v.originalborrado = v.borrado
          return v
        })
      }).catch(function(error) {
        console.log(error)
      })
    },
    cancelEdit(row) {
      row.descripcion = row.originaldescripcion
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
      formData.append('descripcion', row.descripcion)
      formData.append('moduloId', row.moduloId)
      formData.append('borrado', row.borrado)

      await Api.post('/updateModulo', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Edito este registro Modulo con ID ->' + row.moduloId + ' && descripcionOriginal ->' + row.originaldescripcion + '-> DescripcionNew->' + row.descripcion + ' && borrado ' + row.borrado)
        formAut.append('evento', 'EditarModulo()')

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
    async addModulo(row) {
      this.btnloadtopic = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}

      const formData = new FormData()
      formData.append('descripcion', this.ruleForm.modulo)
      formData.append('borrado', 0)

      await Api.post('/addModulo', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Creo un nuevo dato de Modulo->' + this.ruleForm.modulo)
        formAut.append('evento', 'addModulo()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$message({
          message: 'Se ha agregado correctamente',
          type: 'success'
        })
        this.btnloadtopic = false
        this.listLoading = true

        this.loadModulos()
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
          this.addModulo()
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
