<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="search" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
      <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-s-custom" plain @click="handleAddHorario">Agregar Horario</el-button>
      <el-button class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-view" plain @click="handleCrearPermisos">Crear Estatus</el-button>
<!--  <el-radio-group v-model="direction" style="margin-left: 10%;" @change="filtroStatusChange()">
        <el-radio-button label="Aprobado" />
        <el-radio-button label="Pendiente" />
        <el-radio-button label="Cancelado" />
      </el-radio-group> -->
    </div>
    <div class="filter-container" />
    <el-table
      v-loading="listLoading"
      :data="HorariosList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%;"
      border
    >

      <!--<el-table-column align="center" label="No Empleado" width="115">
        <template slot-scope="scope">
          {{ scope.row.personal_id }}
        </template>
      </el-table-column>-->
      <el-table-column  align="center" label="Nombre" width="250">
        <template slot-scope="scope">
          {{ scope.row.name  }}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="Status" width="160">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status=='Aprobado'" type="success" effect="dark">Aprobado</el-tag>
          <el-tag v-else-if="scope.row.status == 'Rechazado'" type="danger" effect="dark">Rechazado</el-tag>
          <el-tag v-else type="warning" effect="dark">No Asignado</el-tag>
        </template>
      </el-table-column>
      
      <el-table-column  align="center" label="Horas semanales" width="140">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.hours_week >= 40" type="success">{{ scope.row.hours_week }}</el-tag>
          <el-tag v-else type="danger">{{ scope.row.hours_week }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="Comentarios" width="150">
        <template slot-scope="scope">
          {{ scope.row.special_situation }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="Fecha Inicio" width="130" prop="vigencia"></el-table-column>
      <el-table-column align="center" label="Lunes" width="220" prop="lunes">
        <el-table-column label="Entrada">
          <template v-if="scope.row.lunes[0]" slot-scope="scope">
            {{ scope.row.lunes[0].entrada }}
          </template>
        </el-table-column>
        <el-table-column label="Comida">
          <template v-if="scope.row.lunes[0]" slot-scope="scope">
            {{ scope.row.lunes[0].comida1 }}<br>
            {{ scope.row.lunes[0].comida2 }}
          </template>
        </el-table-column>
        <el-table-column label="Salida">
          <template v-if="scope.row.lunes[0]" slot-scope="scope">
            {{ scope.row.lunes[0].salida }}
          </template>
        </el-table-column>

      </el-table-column>

      <el-table-column align="center" label="Martes" width="220" prop="martes">
        <el-table-column label="Entrada">
          <template v-if="scope.row.martes[0]" slot-scope="scope">
            {{ scope.row.martes[0].entrada }}
          </template>
        </el-table-column>
        <el-table-column label="Comida">
          <template v-if="scope.row.martes[0]" slot-scope="scope">
            {{ scope.row.martes[0].comida1 }}<br>
            {{ scope.row.martes[0].comida2 }}
          </template>
        </el-table-column>
        <el-table-column label="Salida">
          <template v-if="scope.row.martes[0]" slot-scope="scope">
            {{ scope.row.martes[0].salida }}
          </template>
        </el-table-column>

      </el-table-column>

      <el-table-column align="center" label="Miercoles" width="220" prop="miercoles">
        <el-table-column label="Entrada">
          <template v-if="scope.row.miercoles[0]" slot-scope="scope">
            {{ scope.row.miercoles[0].entrada }}
          </template>
        </el-table-column>
        <el-table-column label="Comida">
          <template v-if="scope.row.miercoles[0]" slot-scope="scope">
            {{ scope.row.miercoles[0].comida1 }}<br>
            {{ scope.row.miercoles[0].comida2 }}
          </template>
        </el-table-column>
        <el-table-column label="Salida">
          <template v-if="scope.row.miercoles[0]" slot-scope="scope">
            {{ scope.row.miercoles[0].salida }}
          </template>
        </el-table-column>

      </el-table-column>
      <el-table-column align="center" label="Jueves" width="220" prop="jueves">
        <el-table-column label="Entrada">
          <template v-if="scope.row.jueves[0]" slot-scope="scope">
            {{ scope.row.jueves[0].entrada }}
          </template>
        </el-table-column>
        <el-table-column label="Comida">
          <template v-if="scope.row.jueves[0]" slot-scope="scope">
            {{ scope.row.jueves[0].comida1 }}<br>
            {{ scope.row.jueves[0].comida2 }}
          </template>
        </el-table-column>
        <el-table-column label="Salida">
          <template v-if="scope.row.jueves[0]" slot-scope="scope">
            {{ scope.row.jueves[0].salida }}
          </template>
        </el-table-column>

      </el-table-column>
      <el-table-column align="center" label="Viernes" width="220" prop="viernes">
        <el-table-column label="Entrada">
          <template v-if="scope.row.viernes[0]" slot-scope="scope">
            {{ scope.row.viernes[0].entrada }}
          </template>
        </el-table-column>
        <el-table-column label="Comida">
          <template v-if="scope.row.viernes[0]" slot-scope="scope">
            {{ scope.row.viernes[0].comida1 }}<br>
            {{ scope.row.viernes[0].comida2 }}
          </template>
        </el-table-column>
        <el-table-column label="Salida">
          <template v-if="scope.row.viernes[0]" slot-scope="scope">
            {{ scope.row.viernes[0].salida }}
          </template>
        </el-table-column>

      </el-table-column>

      <el-table-column align="center" label="Sabado" width="220" prop="sabado">
        <el-table-column label="Entrada">
          <template v-if="scope.row.sabado[0]" slot-scope="scope">
            {{ scope.row.sabado[0].entrada }}
          </template>
        </el-table-column>
        <el-table-column label="Comida">
          <template v-if="scope.row.sabado[0]" slot-scope="scope">
            <div v-if="scope.row.sabado[0]!==null"> {{ scope.row.sabado[0].comida1 }}<br>
              {{ scope.row.sabado[0].comida2 }}</div>

          </template>
        </el-table-column>
        <el-table-column label="Salida">
          <template v-if="scope.row.sabado[0]" slot-scope="scope">
            {{ scope.row.sabado[0].salida }}
          </template>
        </el-table-column>

      </el-table-column>

      <el-table-column align="center" label="Domingo" width="220" prop="domingo">
        <el-table-column label="Entrada">
          <template v-if="scope.row.domingo[0]" slot-scope="scope">
            {{ scope.row.domingo[0].entrada }}
          </template>
        </el-table-column>
        <el-table-column label="Comida">
          <template v-if="scope.row.domingo[0]" slot-scope="scope">
            {{ scope.row.domingo[0].comida1 }}<br>
            {{ scope.row.domingo[0].comida2 }}
          </template>
        </el-table-column>
        <el-table-column label="Salida">
          <template v-if="scope.row.domingo[0]" slot-scope="scope">
            {{ scope.row.domingo[0].salida }}
          </template>
        </el-table-column>

      </el-table-column>

    </el-table>

    <ModalCrearUsuario ref="ModalCrearUsuario" />
    <ModalCatStatus ref="ModalCatStatus" />
  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { deepClone } from '@/utils'
import ModalCrearUsuario from './components/ModalCrearUsuario'
import ModalCatStatus from './components/ModalCatStatus'
export default {
  components: {
    ModalCrearUsuario,
    ModalCatStatus
  },
  data() {
    return {
      HorariosList: [],
      search: '',
      direction: 'Aprobado'
    }
  },
  beforeMount() {
    this.$root.$refs.ViewHorariosPersonal = this
  },
  created() {
    this.getHorariosPersonal()
  },

  methods: {

    async getHorariosPersonal() {
      this.listLoading = true
      const currentObj = this
      await Api.get('/controlAsistencia/getHorariosPersonal').then(res => {
        currentObj.data = res.data
        this.HorariosList = res.data
        this.listLoading = false
      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })
    },
    filtroStatusChange() {
      console.log(this.direction)
    },
    handleAddHorario() {
      this.$root.$refs.ModalCrearUsuario.ClearModal();
      this.$root.$refs.ModalCrearUsuario.getPersonalIntelisis()
      this.$root.$refs.ModalCrearUsuario.dialogType = 'new'
      this.$root.$refs.ModalCrearUsuario.dialogVisible = true
    },
    handleCrearPermisos() {
      this.$refs.ModalCatStatus.getCatTimeStatus()
      this.$refs.ModalCatStatus.dialogVisible = true
    },

    assignModalNewSchedule(_Schedule){
      this.$root.$refs.ModalCrearUsuario.ClearModal();
      this.$root.$refs.ModalCrearUsuario.assignScheduleReject(_Schedule);
      this.$root.$refs.ModalCrearUsuario.getPersonalIntelisis()
      this.$root.$refs.ModalCrearUsuario.dialogType = 'new'
      this.$root.$refs.ModalCrearUsuario.dialogVisible = true
    },

  }
}
</script>

<style lang="scss" scoped>

</style>
