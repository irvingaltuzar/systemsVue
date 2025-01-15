<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div class="nine">
        <h1>Autorizar Horarios Area<span>Mi Personal</span></h1>
      </div>
      <div class="filter-container">
        <el-input v-model="search" clearable style="width: 30%;" class="filter-item" placeholder="Buscar">  <i slot="prefix" class="el-input__icon el-icon-search" /></el-input>
      </div>
      <div class="filter-container" />
      <el-table
        v-loading="listLoading"
        :data="HorariosList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) ||
          data.last_name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;"
        border
      >

        <el-table-column  align="center" label="Acciones" width="115">
          <template slot-scope="scope">
            <el-tooltip content="Autorizar" placement="top">
              <el-button type="success" icon="el-icon-check" circle :loading="btnloading" @click="autorizarHorario(scope.row.Idtime)" />
            </el-tooltip>
            <el-tooltip content="Rechazar" placement="top">
              <el-button type="danger" icon="el-icon-close" circle :loading="btnloading2" @click="rechazarHorario(scope.row.Idtime)" />
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column  align="center" label="Nombre" width="250">
          <template slot-scope="scope">
            {{ scope.row.name +" "+scope.row.last_name }}
          </template>
        </el-table-column>
        <el-table-column  align="center" label="Status" width="110">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status=='Pendiente'" type="warning" effect="dark">Pendiente</el-tag>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="Horas semanales" width="140">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.hours_week >= 40" type="success">{{ scope.row.hours_week }}</el-tag>
            <el-tag v-else type="danger">{{ scope.row.hours_week }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="Comentarios" width="130">
          <template slot-scope="scope">
            {{ scope.row.special_situation }}
          </template>
        </el-table-column>

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
    </el-card>

  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { deepClone } from '@/utils'

export default {
  components: {

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
    this.getHorariosPersonal()
  },

  methods: {

    async getHorariosPersonal() {
      this.listLoading = true
      const currentObj = this
      await Api.get('/controlAsistencia/getHorariosMiPersonalAutorizar').then(res => {
        currentObj.data = res.data
        this.HorariosList = res.data
        this.listLoading = false
      }).catch(function(error) {
        currentObj.error = error
        console.log(error)
      })
    },

    async autorizarHorario(Idtime) {
      const currentObj = this
      console.log(Idtime)
      const id = Idtime
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('IdTime', id)

      await Api.post('/controlAsistencia/autorizarHorarioPersonal', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se autorizo Horario con Id' + id)
        formAut.append('evento', 'autorizarHorario()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$notify({
          title: 'Proceso Exitoso',
          message: currentObj.res['success'],
          type: 'success'
        })
        this.btnloading = false
        this.getHorariosPersonal()
      }
    },
    async rechazarHorario(IdTime) {
      const currentObj = this
      const id = IdTime
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('IdTime', id)

      await Api.post('/controlAsistencia/rechazarHorarioPersonal', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se rechazó Horario con Id' + id)
        formAut.append('evento', 'autorizarHorario()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$notify({
          title: 'Proceso Exitoso',
          message: currentObj.res['success'],
          type: 'success'
        })
        this.btnloading = false
        this.getHorariosPersonal()
      }
    }

  }
}
</script>

<style lang="scss" scoped>
/* Style 9
   ----------------------------- */
.nine h1 {
  text-align:center; font-size:40px; text-transform:uppercase; color:#222; letter-spacing:1px;
  font-family:Helvetica,Arial,sans-serif; font-weight:400;
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

.cell{
  word-break: break-word!important;
}

</style>
