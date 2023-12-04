<template>
  <div>
    <el-dialog
      :title=" title+' proyecto'"
      :visible.sync="centerDialogVisible"
      width="70%"
      height="100%"
      top="3vh"
    >
      <el-form ref="form" :rules="rules" :model="form">
        <div class="row">
          <div class="col-12 col-md-6">
            <el-form-item label="Nombre del proyecto" prop="project">
              <el-input v-model="form.project" clearable />
            </el-form-item>
          </div>
          <div class="col-12 col-md-6">
            <el-form-item label="Enganche" prop="hitch">
              <money
                v-model="form.hitch"
                v-bind="money"
                class="form-control"
              ></money>
            </el-form-item>
          </div>
          <div class="col-12 col-md-6">
            <el-form-item label="Número de niveles" prop="level">
              <el-input-number
                controls-position="right"
                v-model="form.level"
                :min="1"
                class="w-100 text-left"
                clearable
              ></el-input-number>
            </el-form-item>
          </div>
          <div class="col-12 col-md-6"></div>
          <div class="col-12 col-md-6">
            <el-form-item label="Cuenta con PG" prop="low_level">
              <el-checkbox v-model="form.low_level" clearable></el-checkbox>
            </el-form-item>
          </div>
          <div class="col-12 col-md-6">
            <el-form-item
              label="Ocultar subdiviciones"
              prop="hidden_subdivision"
            >
              <el-checkbox
                v-model="form.hidden_subdivision"
                clearable
              ></el-checkbox>
            </el-form-item>
          </div>
          <div class="col-12">
            <el-container>
              <el-upload
                ref="uploadico"
                class="upload-demo"
                action="#"
                id="inputFileUpload"
                :auto-upload="false"
                v-model="form.logo"
                accept="image/png, image/jpeg"
                :on-preview="handlePreview"
                :on-exceed="handleExceed"
                :on-success="handleSucces"
                :thumbnail-mode="true"
                :on-change="handleChange"
                list-type="picture"
                :limit="1"
                :file-list="form.IconoList"
              >
                <el-button size="medium" type="info">
                  Clic para subir Icono
                </el-button>
                <div slot="tip" class="el-upload__tip">
                  Solo archivos png con un tamaño menor de 2MB
                </div>
              </el-upload>
              <br />
            </el-container>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refresh"> Cancelar </el-button>
        <el-button type="primary" @click="submit()"> Guardar </el-button>
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
      title:'',
      form: new Form({
        id: "",
        project: "",
        logo: [],
        IconoList: [],
        hitch: "",
        level: 1,
        low_level: 0,
        file:[],
        hidden_subdivision: 0,
      }),
      money: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false,
      },
      rules: {
        project: [
          {
            required: true,
            message: "Por favor Ingresa el nombre del proyecto",
            trigger: "change",
          },
        ],
        hitch: [
          {
            required: true,
            message: "Por favor Ingresa el monto del enganche",
            trigger: "change",
          },
        ],
        level: [
          {
            required: true,
            message: "Por favor Ingresa el número de niveles",
            trigger: "change",
          },
        ],
      },
    };
  },
  beforeMount() {
    this.$root.$refs.ModalProject = this;
  },
  methods: {
    submit(){
       this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.file=this.$refs.uploadico.uploadFiles
          if(this.form.hitch<=0){
            this.$message.warning('Ingresar un enganche mayor a 0')
             return false
          }
          if(this.form.level<=0){
            this.$message.warning('Ingresar el número de niveles mayor a 0')
             return false
          }
          if (this.form.file.length > 0) {
            this.addProject()
          } else {
            this.$message.warning('Falta subir imagen')
            return false
          }
        } else {
          this.$message.warning('Falta capturar Informacion')
          return false
        }
      })

    },
    async addProject(){
      const config = {
        headers: {
          'content-type': 'multipart/form-data'

        }
      }
        await Api.post("storeProject",this.form)
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
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `El límite es de un solo archivo intentas seleccionar ${files.length} archivo esta vez`
      );
    },
    handleSucces(response, file, fileList) {
      this.$message.success(`Archivo Cargado correctamente`);
    },
    handleChange(file) {
      this.beforeUpload(file)
    },
    beforeUpload(file) {
      const isPNG = file.raw.type === 'image/png'
      const isJPG = file.raw.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('La imagen debe estar en formato PNG / JPG!')
      }
      if (!isLt2M) {
        this.$message.error('La imagen excede los 2MB!')
      }

      return isPNG && isLt2M
    },
    refresh() {
      this.$root.$refs.Projects.getProjects();
      this.centerDialogVisible = false;
    },
  },
};
</script>
