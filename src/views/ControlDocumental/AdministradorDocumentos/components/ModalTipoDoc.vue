<template>
  <el-dialog v-if="dialogTopicoVisible" top="3vh" width="69%" center :visible.sync="dialogTopicoVisible" title="Crear Nuevo Tipo Documento">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" label-position="left" enctype="multipart/form-data">

      <el-form-item label="Nombre" class="ml-4" prop="tipoDoc">
        <el-input v-model="ruleForm.tipoDoc" clearable style="width:80%" />

      </el-form-item>
    </el-form>

    <div style="text-align:right;">
      <el-button type="danger" @click="dialogTopicoVisible=false">Cancelar</el-button>
      <el-button :loading="btnloadtopic" type="success" @click="validateForm('ruleForm')">Crear Tipo Documento<i class="el-icon-upload el-icon-right" /></el-button>

    </div><br>
    <el-table v-loading="listLoading" :data="arrTipoDoc" border fit highlight-current-row class="table-responsive-lg">
      <el-table-column prop="tipoDocumentoId" align="center" label="ID" width="80" />

      <el-table-column width="300" align="center" label="Nombre">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.nombreTipoDocumento" class="edit-input" size="small" />
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
          <span v-else>{{ row.nombreTipoDocumento }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="esDeSistema" align="center" label="Es de Sistema">
        <template slot-scope="{row}">

          <el-switch
            v-if="row.esDeSistema==1"
            v-model="row.esDeSistema"
            active-value="1"
            inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="row.esSistema"
          />

          <el-switch
            v-else
            v-model="row.esDeSistema"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            :disabled="row.esSistema"
          />
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
            @click="row.edit=!row.edit;row.disabled=!row.disabled;row.esSistema=!row.esSistema"
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
        return callback(new Error('Por favor Ingresa tipo documento '))
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: true,
      dialogTopicoVisible: false,

      arrTipoDoc: [],
      listLoading: true,
      loading: false,
      btnloadtopic: false,
      desactivar: true,
      ruleForm: {
        tipoDoc: ''
      },
      rules: {
        tipoDoc: [
          { required: true, message: 'Por favor Ingresa tipo Documento', trigger: 'blur', validator: validate }
        ]
      }
    }
  },
  created() {

  },
  methods: {
    async loadTipoDoc() {
      await Api.get('/getCatTipoDocumento').then(res => {
        this.listLoading = false
        const items = res.data
        this.arrTipoDoc = items.map(v => {
          this.$set(v, 'edit', false)
          this.$set(v, 'disabled', true)
          this.$set(v, 'esSistema', true)
          v.originalnombreTipoDocumento = v.nombreTipoDocumento //  will be used when user click the cancel botton
          v.originalborrado = v.borrado
          v.originalesDeSistema = v.esDeSistema
          return v
        })
      }).catch(function(error) {
        console.log(error)
      })
    },
    cancelEdit(row) {
      row.nombreTipoDocumento = row.originalnombreTipoDocumento
      row.borrado = row.originalborrado
      row.esDeSistema = row.originalesDeSistema
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
      formData.append('nombreTipoDocumento', row.nombreTipoDocumento)
      formData.append('tipoDocumentoId', row.tipoDocumentoId)
      formData.append('borrado', row.borrado)
      formData.append('esSistema', row.esDeSistema)

      await Api.post('/updateTipoDoc', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Edito este registro Tipo Doc con ID ->' + row.tipoDocumentoId + ' && descripcionOriginal ->' + row.originalnombreTipoDocumento + '-> DescripcionNew->' + row.nombreTipoDocumento + ' && borrado ' + row.borrado)
        formAut.append('evento', 'EditarTipoDoc()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        row.edit = false
        row.disabled = true
        row.originalnombreTipoDocumento = row.nombreTipoDocumento
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
    async addTipoDoc(row) {
      this.btnloadtopic = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}

      const formData = new FormData()
      formData.append('nombreTipoDocumento', this.ruleForm.tipoDoc)
      formData.append('borrado', 0)
      formData.append('esSistema', 0)

      await Api.post('/addTipoDoc', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Creo un nuevo dato de Tipo Documento->' + this.ruleForm.tipoDoc)
        formAut.append('evento', 'addTipoDoc()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)

        this.$message({
          message: 'Se ha agregado correctamente',
          type: 'success'
        })
        this.btnloadtopic = false
        this.listLoading = true

        this.loadTipoDoc()
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
          this.addTipoDoc()
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
