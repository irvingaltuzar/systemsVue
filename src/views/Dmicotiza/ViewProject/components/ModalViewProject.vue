<template>
  <div>
    <el-dialog
      :title="title + ' vistas'"
      :visible.sync="centerDialogVisible"
      width="70%"
      height="100%"
      top="3vh"
    >
      <el-form ref="form" :rules="rules" :model="form">
        <div class="row">
          <div class="col-12 col-md-6">
            <el-form-item label="Nombre de la vista" prop="name">
              <el-input v-model="form.name" clearable />
            </el-form-item>
          </div>
          <div class="col-12 col-md-6">
            <el-form-item label="Posición" prop="position">
              <el-input-number
                controls-position="right"
                v-model="form.position"
                class="w-100 text-left"
                disabled
                clearable
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-12 col-md-6">
            <el-form-item label="Subdivisones" prop="subdivision">
              <el-input-number
                controls-position="right"
                v-model="form.subdivision"
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
      form: new Form({
        id: "",
        position: 0,
        name: "",
        subdivision: 1,
        project: "",
      }),
      rules: {
        position: [
          {
            required: true,
            message: "Por favor Ingresa la posición",
            trigger: "change",
          },
        ],
        name: [
          {
            required: true,
            message: "Por favor Ingresa el nombre",
            trigger: "change",
          },
        ],
        subdivision: [
          {
            required: true,
            message: "Por favor Ingresa el número de subdivisiones",
            trigger: "change",
          },
        ],
      },
    };
  },
  beforeMount() {
    this.$root.$refs.ModalViewProject = this;
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.subdivision <= 0) {
            this.$message.warning(
              "Ingresar el número de subdivisiones mayor a 0"
            );
            return false;
          }
          this.AddViewProject();
        } else {
          this.$message.warning("Falta capturar Informacion");
          return false;
        }
      });
    },
    async AddViewProject() {
      await Api.post("storeViewProject", this.form)
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
  },
};
</script>
