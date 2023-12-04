<template>
  <div class="app-container">
    <md-content class="p-3">
      <div class="nine">
        <h1>Solicitar Cambio Horario<span>Mi Horario</span></h1>
      </div>

      <el-form :key="renderKey" ref="ruleForm" :model="ruleForm" label-width="40px" :rules="rules" label-position="top" :disabled="disForm">

        <el-form-item label="Jornada:" style="display: flex;margin-left: 6%;" prop="arrJornada">
          <el-row>
            <el-checkbox-group v-model="ruleForm.arrJornada" class="ml-5" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :key="city" :label="city">{{ city }}</el-checkbox>
              <el-button v-if="btnAdd" class="ml-5" type="primary" :loading="btnloading" @click="submitForm('ruleForm')">Guardar Horario</el-button>
              <el-button v-if="btnUpdate" class="ml-5" type="primary" :loading="btnloading" plain @click="submitForm('ruleForm')">Actualizar Horario</el-button>

            </el-checkbox-group>
          </el-row>
        </el-form-item>

        <md-content class="m-5">
          <el-card v-if="vLunes" class="box-card d-inline-block">
            <div slot="header" class="clearfix ">
              <span>LUNES</span>
            </div>
            <div>
              <el-form-item label="Hora Entrada:" prop="HourEntrance" class="form-item">

                <el-select v-model="ruleForm.HourEntrance" placeholder="Entrada" class="form-item" clearable @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in HoursEntrance"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 1:" prop="HourFood1" class="form-item">

                <el-select v-model="ruleForm.HourFood1" placeholder="Comida 1" class="form-item" clearable @change="ChangeHoursFood($event)">
                  <el-option
                    v-for="item in HoursFood"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 2:" prop="HourFood2" class="form-item">

                <el-select v-model="ruleForm.HourFood2" placeholder="Comida 2" class="form-item" clearable :disabled="disFood2" @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in arrHourFood2"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Salida:" prop="arrJornada" class="form-item">

                <el-select v-model="HourExit" placeholder="Salida" class="form-item" clearable disabled>
                  <el-option
                    v-for="item in HoursExit"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-card>
          <el-card v-if="vMartes" class="box-card d-inline-block">
            <div slot="header" class="clearfix">
              <span>MARTES</span>
            </div>
            <div>
              <el-form-item label="Hora Entrada:" prop="HourEntrance" class="form-item">

                <el-select v-model="ruleForm.HourEntrance" placeholder="Entrada" class="form-item" clearable @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in HoursEntrance"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 1:" prop="HourFood1" class="form-item">

                <el-select v-model="ruleForm.HourFood1" placeholder="Comida 1" class="form-item" clearable @change="ChangeHoursFood($event)">
                  <el-option
                    v-for="item in HoursFood"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 2:" prop="HourFood2" class="form-item">

                <el-select v-model="ruleForm.HourFood2" placeholder="Comida 2" class="form-item" clearable :disabled="disFood2" @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in arrHourFood2"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Salida:" prop="arrJornada" class="form-item">

                <el-select v-model="HourExit" placeholder="Salida" class="form-item" clearable disabled>
                  <el-option
                    v-for="item in HoursExit"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-card>
          <el-card v-if="vMiercoles" class="box-card d-inline-block">
            <div slot="header" class="clearfix">
              <span>MIERCOLES</span>
            </div>
            <div>
              <el-form-item label="Hora Entrada:" prop="HourEntrance" class="form-item">

                <el-select v-model="ruleForm.HourEntrance" placeholder="Entrada" class="form-item" clearable @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in HoursEntrance"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 1:" prop="HourFood1" class="form-item">

                <el-select v-model="ruleForm.HourFood1" placeholder="Comida 1" class="form-item" clearable @change="ChangeHoursFood($event)">
                  <el-option
                    v-for="item in HoursFood"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 2:" prop="HourFood2" class="form-item">

                <el-select v-model="ruleForm.HourFood2" placeholder="Comida 2" class="form-item" clearable :disabled="disFood2" @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in arrHourFood2"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Salida:" prop="arrJornada" class="form-item">

                <el-select v-model="HourExit" placeholder="Salida" class="form-item" clearable disabled>
                  <el-option
                    v-for="item in HoursExit"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-card>
          <el-card v-if="vJueves" class="box-card d-inline-block">
            <div slot="header" class="clearfix">
              <span>JUEVES</span>
            </div>
            <div>
              <el-form-item label="Hora Entrada:" prop="HourEntrance" class="form-item">

                <el-select v-model="ruleForm.HourEntrance" placeholder="Entrada" class="form-item" clearable @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in HoursEntrance"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 1:" prop="HourFood1" class="form-item">

                <el-select v-model="ruleForm.HourFood1" placeholder="Comida 1" class="form-item" clearable @change="ChangeHoursFood($event)">
                  <el-option
                    v-for="item in HoursFood"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 2:" prop="HourFood2" class="form-item">

                <el-select v-model="ruleForm.HourFood2" placeholder="Comida 2" class="form-item" clearable :disabled="disFood2" @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in arrHourFood2"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Salida:" prop="arrJornada" class="form-item">

                <el-select v-model="HourExit" placeholder="Salida" class="form-item" clearable disabled>
                  <el-option
                    v-for="item in HoursExit"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-card>
          <el-card v-if="vViernes" class="box-card d-inline-block">
            <div slot="header" class="clearfix">
              <span>VIERNES</span>
            </div>
            <div>
              <el-form-item label="Hora Entrada:" prop="HourEntrance" class="form-item">

                <el-select v-model="ruleForm.HourEntrance" placeholder="Entrada" class="form-item" clearable @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in HoursEntrance"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 1:" prop="HourFood1" class="form-item">

                <el-select v-model="ruleForm.HourFood1" placeholder="Comida 1" class="form-item" clearable @change="ChangeHoursFood($event)">
                  <el-option
                    v-for="item in HoursFood"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 2:" prop="HourFood2" class="form-item">

                <el-select v-model="ruleForm.HourFood2" placeholder="Comida 2" class="form-item" clearable :disabled="disFood2" @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in arrHourFood2"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Salida:" prop="arrJornada" class="form-item">

                <el-select v-model="HourExit" placeholder="Salida" class="form-item" clearable disabled>
                  <el-option
                    v-for="item in HoursExit"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-card>
          <el-card v-if="vSabado" class="box-card d-inline-block">
            <div slot="header" class="clearfix">
              <span>SABADO</span>
            </div>
            <div>
              <el-form-item label="Hora Entrada:" prop="HourEntrance" class="form-item">

                <el-select v-model="ruleForm.HourEntrance" placeholder="Entrada" class="form-item" clearable @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in HoursEntrance"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 1:" prop="HourFood1" class="form-item">

                <el-select v-model="ruleForm.HourFood1" placeholder="Comida 1" class="form-item" clearable @change="ChangeHoursFood($event)">
                  <el-option
                    v-for="item in HoursFood"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 2:" prop="HourFood2" class="form-item">

                <el-select v-model="ruleForm.HourFood2" placeholder="Comida 2" class="form-item" clearable :disabled="disFood2" @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in arrHourFood2"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Salida:" prop="arrJornada" class="form-item">

                <el-select v-model="HourExit" placeholder="Salida" class="form-item" clearable disabled>
                  <el-option
                    v-for="item in HoursExit"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-card>

          <el-card v-if="vDomingo" class="box-card d-inline-block">
            <div slot="header" class="clearfix">
              <span>DOMINGO</span>
            </div>
            <div>
              <el-form-item label="Hora Entrada:" prop="HourEntrance" class="form-item">

                <el-select v-model="ruleForm.HourEntrance" placeholder="Entrada" class="form-item" clearable @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in HoursEntrance"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 1:" prop="HourFood1" class="form-item">

                <el-select v-model="ruleForm.HourFood1" placeholder="Comida 1" class="form-item" clearable @change="ChangeHoursFood($event)">
                  <el-option
                    v-for="item in HoursFood"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Comida 2:" prop="HourFood2" class="form-item">

                <el-select v-model="ruleForm.HourFood2" placeholder="Comida 2" class="form-item" clearable :disabled="disFood2" @change="HandleCalculateHourExit()">
                  <el-option
                    v-for="item in arrHourFood2"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="Hora Salida:" prop="arrJornada" class="form-item">

                <el-select v-model="HourExit" placeholder="Salida" class="form-item" clearable disabled>
                  <el-option
                    v-for="item in HoursExit"
                    :key="item.id"
                    :label="item.description"
                    :value="item.hour"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-card>

        </md-content>
      </el-form>
    </md-content>

  </div>
</template>

<script>
import Api from '@/store/modules/Api' // Clase Api donde se declara Axios y la ruta al servidor
import { deepClone } from '@/utils'
import moment from 'moment'

export default {
  components: {
  },
  data() {
    var ValidateCheck = (rule, value, callback) => {
      if (value.length == 0) {
        return callback(new Error('Por favor Ingresa jornada'))
      } else {
        return callback()
      }
    }
    var validate = (rule, value, callback) => {
      if (value.trim() == '') {
        return callback(new Error('Por favor Ingresa titulo'))
      } else {
        return callback()
      }
    }
    const cityOptions = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
    return {
      renderKey: 0,
      checkAll: false,
      arrHourFood2: [],
      btnAdd: true,
      timeId: '',
      btnUpdate: false,
      disForm: false,
      status: '',
      arrHorarioPendiente: [],
      disFood2: true,
      cities: cityOptions,
      vLunes: false,
      vMartes: false,
      vMiercoles: false,
      vJueves: false,
      vViernes: false,
      vSabado: false,
      vDomingo: false,
      HourFood2: '',
      HourExit: '',
      HoursExit: '',
      ruleForm: {
        arrJornada: [],
        HourEntrance: '',
        HourFood1: '',
        HourFood2: ''
      },
      rules: {
        arrJornada: [
          { required: true, message: 'Ingresa Jornada', trigger: 'change', validator: ValidateCheck }
        ],
        HourEntrance: [
          { required: true, message: 'Ingresa Entrada', trigger: 'change', validator: validate }
        ],
        HourFood1: [
          { required: true, message: 'Ingresa Comida 1', trigger: 'change', validator: validate }
        ],
        HourFood2: [
          { required: true, message: 'Ingresa Comida 2', trigger: 'change', validator: validate }
        ]
      },
      btnloading: false

    }
  },
  computed: {
    HoursEntrance() {
      return this.$store.getters.HoursEntrance
    },
    HoursFood() {
      return this.$store.getters.HoursFood
    }


  },
  async beforeMount() {
    this.$root.$refs.AdminUsuarios = this

  },
  async created() {
    try {
   await this.$store.dispatch('getHorarioPendiente').then(res => {
     this.getHorarioPendiente()
   })

      this.$store.dispatch('getHourEntrance')
      this.$store.dispatch('getHourFood')

    } catch (error) {
      console.error(error)
    }
  },

  methods: {
    methodThatForcesUpdate() {
      // ...
      this.renderKey += 1
      // this.$nextTick(this.$forceUpdate())
      // ...
    },
    async getHorarioPendiente() {
      //  this.methodThatForcesUpdate()

      if (this.$store.getters.HorarioPendiente != '') {
        this.arrHorarioPendiente = this.$store.getters.HorarioPendiente
        this.btnUpdate = true
        this.btnAdd = false
        for (let i = 0; i < this.arrHorarioPendiente.length; i++) {
          if (this.arrHorarioPendiente[i].week_day == 1) {
            this.vLunes = true
            this.ruleForm.arrJornada.push('Lunes')
          } else if (this.arrHorarioPendiente[i].week_day == 2) {
            this.vMartes = true
            this.ruleForm.arrJornada.push('Martes')
          } else if (this.arrHorarioPendiente[i].week_day == 3) {
            this.vMiercoles = true
            this.ruleForm.arrJornada.push('Miercoles')
          } else if (this.arrHorarioPendiente[i].week_day == 4) {
            this.vJueves = true
            this.ruleForm.arrJornada.push('Jueves')
          } else if (this.arrHorarioPendiente[i].week_day == 5) {
            this.vViernes = true
            this.ruleForm.arrJornada.push('Viernes')
          } else if (this.arrHorarioPendiente[i].week_day == 6) {
            this.vSabado = true
            this.ruleForm.arrJornada.push('Sabado')
          } else if (this.arrHorarioPendiente[i].week_day == 7) {
            this.vDomingo = true
            this.ruleForm.arrJornada.push('Domingo')
          }
          this.timeId = this.arrHorarioPendiente[i].dmirh_personal_time_id
          this.ruleForm.HourEntrance = moment(this.arrHorarioPendiente[i].entry_hour, 'HH:mm').format('HH:mm')
          this.ruleForm.HourFood1 = moment(this.arrHorarioPendiente[i].exit_food_hour, 'HH:mm').format('HH:mm')
          this.ChangeHoursFood()
          this.ruleForm.HourFood2 = moment(this.arrHorarioPendiente[i].entry_food_hour, 'HH:mm').format('HH:mm')
          this.HoursExit = [{ 'id': 1, 'hour': moment(this.arrHorarioPendiente[i].exit_hour, 'HH:mm').format('HH:mm'), 'description': moment(this.arrHorarioPendiente[i].exit_hour, 'hh:mm').format('hh:mm') + ' pm' }]
          this.HourExit = moment(this.arrHorarioPendiente[i].exit_hour, 'HH:mm').format('HH:mm')
          this.status = this.arrHorarioPendiente[i].description
        }
        if (this.status == 'Autorizado') {
          this.disForm = true
        }
      }
    },
    disabledForm() {

    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length
      this.vLunes = false
      this.vMartes = false
      this.vMiercoles = false
      this.vJueves = false
      this.vViernes = false
      this.vSabado = false
      this.vDomingo = false
      // console.log(value)
      value.forEach(row => {
        if (row == 'Lunes') {
          this.vLunes = !this.vLunes
        } else if (row == 'Martes') {
          this.vMartes = !this.vMartes
        } else if (row == 'Miercoles') {
          this.vMiercoles = !this.vMiercoles
        } else if (row == 'Jueves') {
          this.vJueves = !this.vJueves
        } else if (row == 'Viernes') {
          this.vViernes = !this.vViernes
        } else if (row == 'Sabado') {
          this.vSabado = !this.vSabado
        } else if (row == 'Domingo') {
          this.vDomingo = !this.vDomingo
        }
      })
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },

    submitForm(formName) {
      this.btnloading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.btnAdd) {
            this.addCambioHorario()
          } else {
            this.updateCambioHorario()
          }
        } else {
          this.$message.warning('Falta capturar Informacion')
          this.btnloading = false

          return false
        }
      })
    },
    async addCambioHorario() {
      this.btnloading = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('jornada', this.ruleForm.arrJornada)
      formData.append('HourEntrance', this.ruleForm.HourEntrance)
      formData.append('HourFood1', this.ruleForm.HourFood1)
      formData.append('HourFood2', this.ruleForm.HourFood2)
      formData.append('HourExit', this.HourExit)

      await Api.post('/controlAsistencia/addCambioHorarioPersonal', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se realiza cambio de Horario->' + this.$store.getters.user + ' Detalles: ' + JSON.stringify(this.ruleForm.arrJornada) +
        ' Hora Entrada:' + this.ruleForm.HourEntrance + ' HoraComida1: ' + this.ruleForm.HourFood1 + ' HoraComida2: ' + this.ruleForm.HourFood2 + ' HoraSalida: ' + this.HourExit)
        formAut.append('evento', 'addCambioHorario()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$notify({
          title: 'Proceso Exitoso',
          message: 'Se ha guardado correctamente horario.',
          type: 'success'
        })
        this.btnloading = false
       await this.$store.dispatch('getHorarioPendiente').then(res => {
           this.getHorarioPendiente()
   })
      }
    },
    async updateCambioHorario() {
      this.btnloading = true
      const currentObj = this
      const config = { headers: { 'content-type': 'multipart/form-data' }}
      const formData = new FormData()
      formData.append('jornada', this.ruleForm.arrJornada)
      formData.append('HourEntrance', this.ruleForm.HourEntrance)
      formData.append('HourFood1', this.ruleForm.HourFood1)
      formData.append('HourFood2', this.ruleForm.HourFood2)
      formData.append('HourExit', this.HourExit)
      formData.append('timeId', this.timeId)

      await Api.post('/controlAsistencia/updateCambioHorarioPersonal', formData, config).then(res => {
        currentObj.res = res.data
        currentObj.status = res.status
      }).catch(function(error) {
        console.log(error)
      })

      if (currentObj.status === 200) {
        const formAut = new FormData()
        formAut.append('name_view', this.$route.name)
        formAut.append('comentarios', 'Se realiza cambio de Horario->' + this.$store.getters.user + ' Detalles: id:' + this.timeId + ' ' + JSON.stringify(this.ruleForm.arrJornada) +
        ' Hora Entrada:' + this.ruleForm.HourEntrance + ' HoraComida1: ' + this.ruleForm.HourFood1 + ' HoraComida2: ' + this.ruleForm.HourFood2 + ' HoraSalida: ' + this.HourExit)
        formAut.append('evento', 'updateCambioHorario()')

        this.$store.dispatch('auditoria/addEventAuditoria', formAut)
        this.$notify({
          title: 'Proceso Exitoso',
          message: 'Se ha guardado correctamente horario.',
          type: 'success'
        })
        this.btnloading = false
        // this.getHorarioPendiente();
      }
    },
    ChangeHoursFood(event) {
      if (this.ruleForm.HourFood1 != '') {
        this.disFood2 = false
      } else {
        this.disFood2 = true
      }
      let arrTemp = []
      this.ruleForm.HourFood2 = ''
      this.arrHourFood2 = []
      arrTemp = this.$store.getters.HoursFood
      for (let i = 0; i < arrTemp.length; i++) {
        if (arrTemp[i].hour <= this.ruleForm.HourFood1) {
          this.arrHourFood2.push({ 'id': arrTemp[i].id, 'hour': arrTemp[i].hour, 'description': arrTemp[i].description, 'disabled': true })
        } else {
          this.arrHourFood2.push({ 'id': arrTemp[i].id, 'hour': arrTemp[i].hour, 'description': arrTemp[i].description, 'disabled': false })
        }
      }
    },

    HandleCalculateHourExit() {
      if (this.ruleForm.HourEntrance != '' && this.ruleForm.HourFood1 != '' && this.ruleForm.HourFood2 != '') {
        var h1 = this.toDate(this.ruleForm.HourEntrance,'h:m')
        var h2 = this.toDate(this.ruleForm.HourFood1,'h:m')
        var h3 = this.toDate(this.ruleForm.HourFood2,'h:m')
        // Configurar la zona horaria a México
let zonaHorariaMexico = "America/Mexico_City";

// Obtener la fecha y hora actual en la zona horaria de México
let fh1 = h1.toLocaleString('es-MX', { timeZone: zonaHorariaMexico });
        console.log(this.ruleForm.HourEntrance);
        const b1 = moment(h1)
        const b2 = moment(h2)
        const b3 = moment(h3)
          console.log(b1);
        var duration = b3.diff(b2, 'hours')
        b1.add(8, 'h').format('HH:mm')
        b1.add(duration, 'h').format('HH:mm')
        console.log(b1);
        this.HoursExit = []
        this.HourExit = ''
        this.HoursExit = [{ 'id': 1, 'hour': b1.format('HH:mm'), 'description': b1.format('hh:mm') + ' pm' }]
        this.HourExit = b1.format('HH:mm')
        console.log(this.HourExit);
      }
    },
    toDate(dStr, format) {
      var now = new Date()
      if (format == 'h:m') {
 		now.setHours(dStr.substr(0, dStr.indexOf(':')))
 		now.setMinutes(dStr.substr(dStr.indexOf(':') + 1))
 		now.setSeconds(0)
 		return now
      } else { return 'Invalid Format' }
    }
  }
}
</script>

<style scoped>

.box-card {
    width: 11.5vw;
  }
  .form-item {
    bottom: 20px !important;
    margin-bottom: 2px;
}
 .el-form-item__error {
    color: #ff4949;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 40% !important;
    left: 0;
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
