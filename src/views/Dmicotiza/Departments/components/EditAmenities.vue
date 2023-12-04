<template>
  <el-dialog
    title="Amenidad"
    :visible.sync="centerDialogVisible"
    width="70%"
    top="3vh"
  >
    <el-form ref="form" :rules="rules" :model="form">
      <div class="row">
        <div class="col-12 col-md-6">
          <el-form-item label="Nombre" prop="name">
            <el-input v-model="form.name" clearable />
          </el-form-item>
        </div>
        <div class="col-12 col-md-6"></div>
        <div class="col-12 col-md-6">
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
        <div class="col-12 col-md-6">
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
      <el-button type="danger" @click="Confirmar(form.id)"> Eliminar </el-button>
      <el-button type="primary" @click="onSubmit"> Actualizar </el-button>
    </span>
  </el-dialog>
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
      form: new Form({
        id: "",
        name: "",
        column: 1,
        row: 1,
      }),
      rules: {
        column: [
          {
            required: true,
            message: "Por favor Ingresa un número de columnas",
            trigger: "blur",
            validator: validate,
          },
        ],
        name: [
          {
            required: true,
            message: "Por favor Ingresa un nombre",
            trigger: "change",
          },
        ],
        row: [
          {
            required: true,
            message: "Por favor Ingresa un número de filas",
            trigger: "change",
          },
        ]
      },
    };
  },
  beforeMount() {
    this.$root.$refs.ModalAmenities= this;
  },
  methods: {
    Confirmar(id) {
      this.$confirm('Estas seguro de eliminar la amenidad?')
        .then(_ => {
          this.Eliminar(id)
        }).catch(_ => {})
    },
    async Eliminar(id){
         Api.get("destroyAmenity/"+id)
        .then((res) => {
          if (res.status === 200) {
            this.refresh();
            this.$message({
              message: "Se ha eliminado correctamente",
              type: "success",
            });
          } else {
            this.$message({
              message: "Ocurrio un error en el proceso",
              type: "error",
            });
          }
        })
    },
    refresh() {
      this.$root.$refs.Department.getDepartments(this.$route.params.id);
      this.centerDialogVisible = false;
    },
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.editAmenity();
        } else {
          this.$message.warning("Falta capturar Informacion");
          return false;
        }
      });
    },
    async editAmenity() {
      await Api.post("updateAmenity", this.form)
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
  },
};
</script>
