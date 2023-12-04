<template>
  <el-dialog
    title="Crear Departamento"
    :visible.sync="centerDialogVisible"
    width="70%"
    top="3vh"
  >
    <el-form ref="form" :rules="rules" :model="form">
      <div class="row">
        <div class="col-12 col-md-12">
          <el-form-item label="Amenidades" prop="amedidad">
            <el-checkbox v-model="form.amedidad" clearable></el-checkbox>
          </el-form-item>
        </div>
        <div class="col-12 col-md-6" v-show="!isAmenities">
          <el-form-item label="Número de departamento" prop="number">
            <div class="row w-100 pr-0 mr-0 ml-0">
              <div class="col-1 font-weight-bold text-left pr-0">{{(form.level==0)? 'PG': form.level}}</div>
              <div class="col-11 pl-0 pr-0">
                <el-input v-model="form.number" clearable />
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="col-12 col-md-6" v-show="!isAmenities">
          <el-form-item label="Número de cajones" prop="drawers">
            <el-input-number
              controls-position="right"
              v-model="form.drawers"
              :min="0"
              class="w-100 text-left"
              clearable
            ></el-input-number>
          </el-form-item>
        </div>
        <div class="col-12 col-md-6" v-show="!isAmenities">
          
          <el-form-item label="Metros cuadrados" prop="m2">
              <money v-model="form.m2" v-bind="money" class="form-control"></money>
          </el-form-item>
        </div>
        <div class="col-12 col-md-6" v-show="!isAmenities">
          <el-form-item label="Precio por metro cuadrado" prop="price_m2">
            <money v-model="form.price_m2" v-bind="money" class="form-control"></money>
          </el-form-item>
        </div>
        <div class="col-12 col-md-6" v-show="!isAmenities">
          <el-form-item
            label="Clasificación del departamento"
            prop="classification"
          >
            <el-select
              v-model="form.classification"
              placeholder="Selecciona"
              class="w-100"
              clearable
              @change="onChange($event)"
            >
              <el-option
                v-for="item in classifications"
                :key="item.path"
                :label="item.classification"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="col-12 col-md-6" v-show="!isAmenities">
          <el-form-item label="Tipo de departamento" prop="type">
            <el-select
              v-model="form.type"
              placeholder="Selecciona"
              class="w-100"
              clearable
            >
            <el-option
                v-for="item in type"
                :key="item.path"
                :label="item.type"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="col-12 col-md-6" v-show="isAmenities">
          <el-form-item label="Nombre" prop="name">
            <el-input v-model="form.name" clearable />
          </el-form-item>
        </div>
        <div class="col-12 col-md-6"></div>
        <div class="col-12 col-md-6" v-show="isAmenities">
          <el-form-item label="Columnas" prop="column">
            <el-input-number
              controls-position="right"
              v-model="form.column"
              :min="1"
              class="w-100 text-left"
              clearable
            ></el-input-number>
          </el-form-item>
        </div>
        <div class="col-12 col-md-6" v-show="isAmenities">
          <el-form-item label="Filas" prop="row">
            <el-input-number
              controls-position="right"
              v-model="form.row"
              :min="1"
              class="w-100 text-left"
              clearable
            ></el-input-number>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="refresh"> Cancelar </el-button>
      <el-button type="primary" @click="onSubmit"> Guardar </el-button>
    </span>
  </el-dialog>
</template>
<script>
import Api from "@/store/modules/Api";
import Form from "vform";
import {Money} from 'v-money'
export default {
  components: {Money},
  data() {
    var validate = (rule, value, callback) => {
      callback();
    };
    return {
      centerDialogVisible: false,
      classifications: "",
      type:"",
      form: new Form({
        amedidad: false,
        number: "",
        m2: 1,
        price_m2: 1,
        drawers: 0,
        type: "",
        classification: "",
        project: "",
        view: "",
        subdivision: "",
        level: "",
        name: "",
        column: 1,
        row: 1,
      }),
      money: {
          decimal: '.',
          thousands: ',',
          precision: 2,
          masked: false
        },
      rules: {
        column: [
          {
            required: false,
            message: "Por favor Ingresa un número de columnas",
            trigger: "blur",
            validator: validate,
          },
        ],
        name: [
          {
            required: false,
            message: "Por favor Ingresa un nombre",
            trigger: "change",
          },
        ],
        row: [
          {
            required: false,
            message: "Por favor Ingresa un número de filas",
            trigger: "change",
          },
        ],
        number: [
          {
            required: true,
            message: "Por favor Ingresa el núimero de departamento",
            trigger: "change",
          },
        ],
        price_m2: [
          {
            required: true,
            message: "Por favor Ingresa los metros cuadrados",
            trigger: "change",
          },
        ],
        m2: [
          {
            required: true,
            message: "Por favor Ingresa el precio por metro cuadrado",
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: "Por favor seleccione el tipo de departamento",
            trigger: "change",
          },
        ],
        classification: [
          {
            required: true,
            message: "Por favor seleccione la clasificación del departamento",
            trigger: "change",
          },
        ],
      },
    };
  },
  beforeMount() {
    this.$root.$refs.ModalDepartment = this;
  },
  created() {
    this.getClassifications();
  },
  methods: {
    onChange(event){
      this.form.type=null;
      this.type=null
      if(event!="" && event!=null ){
        Api.get("/getType/"+event)
        .then((res) => {
          this.type = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
      }
    },
    refresh() {
      this.$root.$refs.Department.getDepartments(this.$route.params.id);
      this.centerDialogVisible = false;
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.addDerparment();
        } else {
          this.$message.warning("Falta capturar Informacion");
          return false;
        }
      });
    },
    async addDerparment() {
      await Api.post("department/store", this.form)
        .then((res) => {
          if (res.status === 200) {
            this.refresh();
            this.$message({
              message: "Se ha agregado correctamente",
              type: "success",
            });
          } else {
            this.$message({
              message: "Ocurrio un error en el proceso",
              type: "error",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async getClassifications() {
      Api.get("/getClassification")
        .then((res) => {
          this.classifications = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    isAmenities() {
      if (this.form.amedidad) {
        this.rules.row[0].required = true;
        this.rules.name[0].required = true;
        this.rules.column[0].required = true;
        this.rules.m2[0].required = false;
        this.rules.number[0].required = false;
        this.rules.price_m2[0].required = false;
        this.rules.type[0].required = false;
        this.rules.classification[0].required = false;
      } else {
        this.rules.row[0].required = false;
        this.rules.name[0].required = false;
        this.rules.column[0].required = false;
        this.rules.m2[0].required = true;
        this.rules.number[0].required = true;
        this.rules.price_m2[0].required = true;
        this.rules.type[0].required = true;
        this.rules.classification[0].required = true;
      }
      return this.form.amedidad;
    },
  },
};
</script>
