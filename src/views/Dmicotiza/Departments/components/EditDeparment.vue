<template>
  <el-dialog
    title="Departamento"
    :visible.sync="centerDialogVisible"
    width="70%"
    top="3vh"
  >
    <el-form ref="form" :rules="rules" :model="form">
      <div class="row">
        <div class="col-12 col-md-6">
          <el-form-item label="Número de departamento" prop="number">
            <div class="row w-100 pr-0 mr-0 ml-0">
              <div class="col-1 font-weight-bold text-left pr-0">
                {{ form.level == 0 ? "PG" : form.level }}
              </div>
              <div class="col-11 pl-0 pr-0">
                <el-input v-model="form.number" clearable />
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="col-12 col-md-6">
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
        <div class="col-12 col-md-6">
          <el-form-item label="Metros cuadrados" prop="m2">
            <money
              v-model="form.m2"
              v-bind="money"
              class="form-control"
            ></money>
          </el-form-item>
        </div>
        <div class="col-12 col-md-6">
          <el-form-item label="Precio por metro cuadrado" prop="price_m2">
            <money
              v-model="form.price_m2"
              v-bind="money"
              class="form-control"
            ></money>
          </el-form-item>
        </div>
        <div class="col-12 col-md-6">
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
        <div class="col-12 col-md-6">
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
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="refresh"> Cancelar </el-button>
      <el-button type="primary" @click="onSubmit"> Actualizar </el-button>
    </span>
  </el-dialog>
</template>
<script>
import Api from "@/store/modules/Api";
import Form from "vform";
import { Money } from "v-money";
export default {
  components: { Money },
  data() {
    var validate = (rule, value, callback) => {
      callback();
    };
    return {
      centerDialogVisible: false,
      classifications: "",
      type:"",
      form: new Form({
        id: "",
        level: "",
        number: "",
        m2: 0,
        price_m2: 0,
        drawers: 0,
        type: "",
        classification: "",
      }),
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      rules: {
        number: [
          {
            required: true,
            message: "Por favor Ingresa el número de departamento",
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
    this.$root.$refs.EditDeparment = this;
  },
  created() {
    this.getClasifications();
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
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.editDepartment();
        } else {
          this.$message.warning("Falta capturar Informacion");
          return false;
        }
      });
    },
    async editDepartment() {
      await Api.post("updateDeparment", this.form)
        .then((res) => {
          if (res.status === 200) {
            this.refresh();
            this.$message({
              message: "Se edito correctamente",
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
    refresh() {
      this.$root.$refs.detailDepartment.getDepartments(
        this.$route.params.idDepartment
      );
      this.centerDialogVisible = false;
    },
    async getClasifications() {
      Api.get("/getClassification")
        .then((res) => {
          this.classifications = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>