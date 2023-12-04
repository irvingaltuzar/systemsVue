<template>
  <div>
    <el-dialog
      :title="title + ' subdivisiones'"
      :visible.sync="centerDialogVisible"
      width="70%"
      height="100%"
      top="3vh"
    >
      <el-form ref="form" :rules="rules" :model="form">
        <div class="row">
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
            <el-form-item label="Subdivision" prop="name">
                <el-input v-model="form.name" clearable />
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
        position: 0,
        name:"",
        view: "",
      }),
      rules: {
        position: [
          {
            required: true,
            message: "Por favor Ingresa la posisción",
            trigger: "change",
          },
        ],
        name: [
          {
            required: true,
            message: "Por favor Ingresa el nombre de la subdivisión",
            trigger: "change",
          },
        ],
      },
    };
  },
  beforeMount() {
    this.$root.$refs.ModalSubdivision = this;
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.AddSubdivision();
        } else {
          this.$message.warning("Falta capturar Informacion");
          return false;
        }
      });
    },
    async AddSubdivision() {
      await Api.post("storeSubdivision", this.form)
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
      this.$root.$refs.ProjectView.getViewProject(this.$route.params.idView);
      this.centerDialogVisible = false;
    },
  },
};
</script>