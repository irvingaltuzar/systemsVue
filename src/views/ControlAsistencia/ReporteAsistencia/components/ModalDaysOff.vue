<template>
  <el-dialog top="3vh" width="55%" center :visible.sync="dialogVisible" title="Crear Nueva Fecha Puente">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="200px" label-position="left" enctype="multipart/form-data">

      <el-form-item label="Fecha" class="ml-4" prop="date">
       <el-date-picker
          v-model="ruleForm.date"
          type="date"
          placeholder="Fecha"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
        />

      </el-form-item>

    </el-form>

    <div style="text-align:right;">
      <el-button type="danger" @click="dialogVisible=false">Cancelar</el-button>
      <el-button :loading="btnloadPermiso" type="success" @click="validateForm('ruleForm')">Agregar Fecha<i class="el-icon-upload el-icon-right" /></el-button>

    </div><br>

    <el-table v-loading="listLoading" :data="DaysOff" border fit highlight-current-row class="table-responsive-lg">
      <el-table-column prop="id" label="ID" width="50" />

      <el-table-column width="250" align="center" label="date">
        <template slot-scope="{row}">
          <template v-if="row.edit">
              <el-date-picker
          v-model="row.date"
          type="date"
          placeholder="Fecha"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
        />
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
          <span v-else>{{ row.date }}</span>
        </template>
      </el-table-column>

      <!--<el-table-column prop="deleted" align="center" label="Activo" width="80">
        <template slot-scope="{row}">

          <el-switch
            v-model="row.deleted_at"
            :active-value=""
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="row.disabled"
          />
        </template>
      </el-table-column>-->
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
import { mapGetters} from 'vuex'
export default {
  name: 'ModalDaysOff',
  data() {
    var validate = (rule, value, callback) => {
      if (value.trim() == '') {
        return callback(new Error('Por favor Ingresa '))
      } else {
        callback()
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
      list: null,
      listLoading: true,
      dialogVisible: false,

      typeJustificationTbl: [],

      listLoading: true,
      loading: false,
      btnloadPermiso: false,
      desactivar: true,
      ruleForm: {
        date: ''
      },
      rules: {
        date: [
          { required: true, message: 'Por favor Ingresa Fecha', trigger: 'blur', validator: ValidateDate }
        ]
      }
    }
  },

  computed: {
 ...mapGetters([
      'DaysOff',
    ])

  },
  created() {
    try {
      this.listLoading = false
    } catch (error) {
      console.error(error)
    }
  },
    beforeMount() {
    this.$root.$refs.ModalDaysOff = this
  },

  methods: {

    cancelEdit(row) {
      row.date = row.originaldescripcion
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
      formData.append('date', row.date)
      formData.append('id', row.id)
      // formData.append('deleted', row.deleted)

      await Api.post('/controlAsistencia/updateDaysOff', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
        row.edit = false
        row.disabled = true
        row.originaldescripcion = row.date
        this.$message({
          message: 'Se ha modificado correctamente',
          type: 'success'
        })
        this.loading = false
           const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se editó fecha puente -> description:' + row.date)
        formAut.append('evento', 'updateDaysOff()')
        formAut.append('id_afectado', row.id)

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
      }).catch(function(error) {
       this.$message({
          message: 'Ocurrio un error en el proceso',
          type: 'error'
        })
      })

    },
    async addDaysOff() {
      this.btnloadPermiso = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}

      const formData = new FormData()
      formData.append('date', this.ruleForm.date)

      await Api.post('/controlAsistencia/addDaysOff', formData, config).then(res => {
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
        this.$store.dispatch('getDaysOff')
        this.listLoading = false

            const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se agregó fecha puente -> description:' + this.ruleForm.date)
        formAut.append('evento', 'addDaysOff()')

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
          this.addDaysOff()
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
