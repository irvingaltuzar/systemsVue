<template>
  <div>
    <el-dialog
      :title="title + ' etapas'"
      :visible.sync="centerDialogVisible"
      width="70%"
      height="100%"
      top="3vh"
    >
      <el-form ref="form" :rules="rules" :model="form">
        <div class="row">
          <div class="col-12 col-md-6">
            <el-form-item label="Clasificación" prop="name">
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
            <el-form-item label="Etapa" prop="stage">
              <el-input-number
                controls-position="right"
                v-model="form.stage"
                class="w-100 text-left"
                disabled
                clearable
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-12 col-md-6">
            <el-form-item label="Cantidad de departamentos" prop="quantity_department">
              <el-input-number
                controls-position="right"
                v-model="form.quantity_department"
                class="w-100 text-left"
                :min="1"
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
  </div>
</template>
<script>
import Api from "@/store/modules/Api";
import Form from "vform";
export default {
  data() {
    var validate = (rule, value, callback) => {
      callback();
    };
    return {
      centerDialogVisible: false,
      title: "",
      classifications: [],
      form: new Form({
        id: "",
        stage: 0,
        quantity_department: "",
        classification: [],
        project: "",
      }),
      rules: {
        stage: [
          {
            required: true,
            message: "Por favor Ingresa la etapa",
            trigger: "change",
          },
        ],
        quantity_department: [
          {
            required: true,
            message: "Por favor Ingresa el número de departamentos",
            trigger: "change",
          },
        ],
        classification: [
          {
            required: true,
            message: "Por favor elija la clasificación",
            trigger: "change",
          },
        ],
      },
    };
  },
  beforeMount() {
    this.$root.$refs.ModalStage = this;
  },
  created() {
    this.getClassifications();
  },
  methods: {
    onChange(event) {
        console.log(event);
        Api.get("/getCountStage/"+event+"/"+this.form.project)
        .then((res) => {
          this.form.stage = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.AddStage();
        } else {
          this.$message.warning("Falta capturar Informacion");
          return false;
        }
      });
    },
    async AddStage() {
      await Api.post("storeStage", this.form)
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
    refresh() {
      this.$root.$refs.DetailProject.getProject(this.$route.params.idProject);
      this.centerDialogVisible = false;
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
};
</script>
