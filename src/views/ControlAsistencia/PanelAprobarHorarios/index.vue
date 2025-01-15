<template>

  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div class="nine">
        <h1>Panel Aprobar Horarios<span>{{ Ubicacion }}</span></h1>
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

        <el-table-column fixed align="center" label="Acciones" width="150">
          <template slot-scope="scope">
            <el-tooltip content="Autorizar" placement="top">
              <el-button type="success" icon="el-icon-check"  circle :loading="btnloading" @click="autorizarHorario(scope.row.Idtime)" />
            </el-tooltip>
            <el-tooltip content="Rechazar" placement="top">
              <el-button type="danger" icon="el-icon-close" circle :loading="btnloading2" @click="rechazarHorario(scope.row.Idtime)" />
            </el-tooltip>
            <el-tooltip content="Editar" placement="bottom">
              <el-button
                
                circle
                @click="assignModalNewSchedule(scope.row)">
                  <i class="fa-solid fa-edit"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column  align="center" label="Nombre" width="250">
          <template slot-scope="scope">
            {{ scope.row.name +" "+scope.row.last_name }}
          </template>
        </el-table-column>
        <el-table-column  align="center" label="Estatus" width="110">
          <template slot-scope="scope">
            <el-tooltip :content="'por: '+scope.row.approved_by" placement="top">
              <el-tag type="primary" effect="dark">{{ scope.row.status }}</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column  align="center" label="Horas semanales" width="140">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.hours_week >= 40" type="success">{{ scope.row.hours_week }}</el-tag>
            <el-tag v-else type="danger">{{ scope.row.hours_week }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="Comentarios" width="160">
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
    <ModalCrearUsuario ref="ModalCrearUsuario" />
  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { deepClone } from '@/utils'

import ModalCrearUsuario from '../HorariosPersonal/components/ModalCrearUsuario.vue'

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
  computed: {
    Ubicacion() {
      return this.$store.getters.ubicacion
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
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('location', this.$store.getters.ubicacion)

      await Api.post('/controlAsistencia/getHorariosPersonalAprobar', formData, config).then(res => {
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
      this.btnloading = true
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('IdTime', id)

      await Api.post('/controlAsistencia/autorizarHorarioPersonalPanel', formData, config).then(res => {
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
      this.btnloading2 = true
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('IdTime', id)

      await Api.post('/controlAsistencia/rechazarHorarioPersonalPanel', formData, config).then(res => {
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
        this.btnloading2 = false
        this.getHorariosPersonal()
      }
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

<style  scoped>

h1 {
  position: relative;
  padding: 0;
  margin: 0;
  font-family: "Raleway", sans-serif;
  font-weight: 300;
  font-size: 40px;
  color: #080808;
  -webkit-transition: all 0.4s ease 0s;
  -o-transition: all 0.4s ease 0s;
  transition: all 0.4s ease 0s;
}

h1 span {
  display: block;
  font-size: 0.5em;
  line-height: 1.3;
}
h1 em {
  font-style: normal;
  font-weight: 600;
}
/* === HEADING STYLE #2 === */
.two h1 {
  text-transform: capitalize;
}
.two h1:before {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 60px;
  height: 2px;
  content: "";
  background-color: #c50000;
}

.two h1 span {
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 4px;
  line-height: 3em;
  padding-left: 0.25em;
  color: rgba(0, 0, 0, 0.4);
  padding-bottom: 10px;
}
.alt-two h1 {
  text-align:center;
}
.alt-two h1:before {
  left:50%; margin-left:-30px;
}
/* === HEADING STYLE #4 === */
.four h1 {
  text-align: center;
  padding-bottom: 0.7em;
}
.four h1 span {
  font-weight: 300;
  word-spacing: 3px;
  line-height: 2em;
  padding-bottom: 0.35em;
  color: rgba(0, 0, 0, 0.5);
}
.four h1:before {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 60px;
  height: 1px;
  content: "";
  left: 50%;
  margin-left: -30px;
  background-color: #777;
}
/* === HEADING STYLE #5 === */
.five h1 {
  text-align: center;
  font-size: 35px;
  font-weight: 700; color:#202020;
  text-transform: uppercase;
  word-spacing: 1px; letter-spacing:2px;
}
.five h1 span {
  margin-top: 40px;
  text-transform: none;
  font-size:.75em;
  font-weight: normal;
  font-style: italic; font-family: "Playfair Display","Bookman",serif;
  color:#999; letter-spacing:-0.005em; word-spacing:1px;
  letter-spacing:none;
}
.five h1:before {
  position: absolute;
  left: 0;
  bottom: 38px;
  width: 60px;
  height: 4px;
  content: "";
  left: 50%;
  margin-left: -30px;
  background-color: #dfdfdf;
}

/* Style 7
   ----------------------------- */
.seven h1 {
text-align: center;
    font-size:30px; font-weight:300; color:#222; letter-spacing:1px;
    text-transform: uppercase;

    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    grid-template-rows: 27px 0;
    grid-gap: 20px;
    align-items: center;
}
.seven h1:after,.seven h1:before {
    content: " ";
    display: block;
    border-bottom: 1px solid #c50000;
    border-top: 1px solid #c50000;
    height: 5px;
  background-color:#f8f8f8;
}
/* Style 8
   ----------------------------- */
.eight h1 {
  text-align:center;

  text-transform:uppercase;
  font-size:26px; letter-spacing:1px;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 16px 0;
  grid-gap: 22px;
}

.eight h1:after,.eight h1:before {
  content: " ";
  display: block;
  border-bottom: 2px solid #ccc;
  background-color:#f8f8f8;
}

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

</style>
