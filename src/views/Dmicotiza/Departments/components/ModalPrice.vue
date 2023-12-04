<template>
  <div>
    <el-dialog
      :title=" title +' precio'"
      :visible.sync="centerDialogVisible"
      width="40%"
      top="3vh"
    >
      <el-form ref="form" :rules="rules" :model="form">
        <div class="row">
          <div class="col-12 ">
            <el-form-item label="Etapa" prop="stage">
              <el-input-number
                controls-position="right"
                v-model="form.stage"
                :min="0"
                disabled
                class="w-100 text-left"
                clearable
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-12 ">
            <el-form-item label="Precio" prop="price">
              <money
              v-model="form.price"
              v-bind="money"
              class="form-control"
            ></money>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="refresh"> Cancelar </el-button>
      <el-button type="primary" @click="onSubmit"> Guardar </el-button>
    </span>
    </el-dialog>
  </div>
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
      title: "",
      form: new Form({
        id:"",
        stage: "",
        price: 1,
        department_id:""
      }),
       money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      rules: {
        stage: [
          {
            required: true,
            message: "Por favor Ingresa etapa",
            trigger: "change",
          },
        ],
        price: [
          {
            required: true,
            message: "Por favor Ingresa el precio",
            trigger: "change",
          },
        ]
      },
    };
  },
  beforeMount() {
    this.$root.$refs.ModalPrice = this;
  },
  methods: {
    onSubmit(){
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.addPrice();
        } else {
          this.$message.warning("Falta capturar Informacion");
          return false;
        }
      });
    },
    async addPrice(){
       await Api.post("storeStagePrice", this.form)
        .then((res) => {
          if (res.status === 200) {
            this.refresh();
            this.$message({
              message: res.data.success,
              type: "success",
            });
          } else if(res.status === 202){
            this.$message({
              message: "Ya existe un registro con esa etapa",
              type: "error",
            });
          }else {
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
      this.$root.$refs.detailDepartment.getDepartments(this.$route.params.idDepartment);
      this.centerDialogVisible = false;
    },
  },
};
</script>
