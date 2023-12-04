<template>
  <div>
    <el-dialog
      :title="title + ' solicitud'"
      :visible.sync="centerDialogVisible"
      width="70%"
      height="100%"
      top="3vh"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :rules="rules" :model="form" enctype="multipart/form-data">
        <div class="row">
          <div class="col-12">
            <el-form-item label="Ubicacción" prop="location">
              <el-select
                v-model="form.location"
                placeholder="Selecciona"
                class="w-100"
                clearable
                filterable
                @change="onChange($event)"
              >
                <el-option
                  v-for="item in locations"
                  :key="item.id"
                  :label="item.location"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="col-12">
            <el-form-item label="Área" prop="area">
              <el-select
                v-model="form.area"
                placeholder="Selecciona"
                class="w-100"
                clearable
                filterable
                @change="onChangeArea($event)"
              >
                <el-option
                  v-for="item in areas"
                  :key="item.id"
                  :label="item.area"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-12">
            <el-form-item label="Sub-área" prop="sub_area">
              <el-select
                v-model="form.sub_area"
                placeholder="Selecciona"
                class="w-100"
                clearable
                filterable
                @change="onChangeSubArea($event)"
              >
                <el-option
                  v-for="item in sub_areas"
                  :key="item.path"
                  :label="item.sub_area"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-12">
            <el-form-item label="Destinatario" prop="addressee">
              <el-select
                v-model="form.addressee"
                placeholder="Selecciona"
                class="w-100"
                clearable
                filterable
              >
                <el-option
                  v-for="item in addressee"
                  :key="item.personal_intelisis_id"
                  :label="item.nombre + ' ' + item.apellidos"
                  :value="item.personal_intelisis_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
         <div class="col-12">
            <el-form-item label="CC" prop="addressee_secundary">
              <el-select
                v-model="form.addressee_secundary"
                placeholder="Selecciona"
                class="w-100"
                clearable
                multiple
                filterable
              >
                <el-option
                  v-for="item in addressee_secundaries"
                  :key="item.personal_intelisis_id"
                  :label="item.nombre + ' ' + item.apellidos"
                  :value="item.personal_intelisis_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="col-12 col-md-12">
            <el-form-item label="Asunto" prop="affair">
              <el-input v-model="form.affair" clearable />
            </el-form-item>
          </div>
          <div class="col-12">
            <label prop="description" for="description"
              ><span id="description"></span>Descripción</label
            >
            <quill-editor
              prop="description"
              ref="myQuillEditor"
              v-model="form.description"
              :options="editorOption"
              @change="onEditorChange($event)"
            />
          </div>
          <div class="col-12 mt-4">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="#"
              :auto-upload="false"
              multiple
              :file-list="fileList"
            >
              <el-button type="info"
                ><i class="fas fa-plus"></i> Adjuntar archivo</el-button
              >
            </el-upload>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refresh"> Cancelar </el-button>
        <el-button type="primary" @click="submit"> Enviar </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Api from "@/store/modules/Api";
import Form from "vform";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor,
  },
  data() {
    var validate = (rule, value, callback) => {
      callback();
    };
    return {
      centerDialogVisible: false,
      title: "",
      items: [],
      locations: [],
      areas: [],
      sub_areas: [],
      addressee: [],
      addressee_secundaries:[],
      fileList: [],
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "image"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ header: [1, 2, 3, 4, 5, 6, 7, false] }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
          ],
        },
        placeholder: "Descripción de la solicitud.",
      },
      form: new Form({
        addressee: "",
        description: "",
        location: "",
        area: "",
        sub_area: "",
        addressee_secundary: [],
        affair: "",
        file: [],
      }),
      rules: {
        affair: [
          {
            required: true,
            message: "Por favor ingresa el asunto.",
            trigger: "change",
          },
        ],
        addressee: [
          {
            required: true,
            message: "Por favor ingresa el destinatario.",
            trigger: "change",
          },
        ],
        location: [
          {
            required: true,
            message: "Por favor selecciona una ubicación.",
            trigger: "change",
          },
        ],
        area: [
          {
            required: true,
            message: "Por favor selecciona el área.",
            trigger: "change",
          },
        ],
        sub_area: [
          {
            required: true,
            message: "Por favor selecciona la sub-área.",
            trigger: "change",
          },
        ],
        description: [
          {
            required: true,
            message: "Por favor ingresa una descripción.",
            trigger: "change",
          },
        ],
      },
    };
  },
  beforeMount() {
    this.$root.$refs.ModalTicket = this;
  },
  created() {
    this.getUsuarios();
    this.getLocations();
  },
  methods: {
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.description == "" || this.form.description == null) {
            this.$message.warning("Falta capturar la descripción");
            return false;
          }
          this.addTicket();
        } else {
          this.$message.warning("Falta capturar Informacion");
          return false;
        }
      });
    },
    async addTicket() {
      this.form.file=[];
      
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      const formData = new FormData()
      var contador=null;
      this.$refs.upload.uploadFiles.forEach((value, index) => {
         formData.append('file'+index, value.raw)
         contador=index;
      });
      formData.append('contador',contador)
      formData.append('addressee',this.form.addressee)
      formData.append('description',this.form.description)
      formData.append('location',this.form.location)
      formData.append('area',this.form.area)
      formData.append('sub_area',this.form.sub_area)
      formData.append('addressee_secundary',JSON.stringify(this.form.addressee_secundary))
      formData.append('affair',this.form.affair)
      await Api.post("storeSolicitud", formData,config)
        .then((res) => {
          if (res.status === 200) {
            this.refresh();
            this.$message({
              message: "Se ha agregado correctamente",
              type: "success",
            });
          } else {
            this.$message({
              message: res.data.error,
              type: "warning",
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    onChange(event) {
      this.form.area = null;
      this.areas = [];
      if (event != "" && event != null) {
        Api.get("/getAreaLocation/" + event)
          .then((res) => {
            this.areas = res.data;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    onChangeArea(event) {
      this.form.sub_area = null;
      this.sub_areas = [];
      if (event != "" && event != null) {
        Api.get("/getSubAreaArea/" + event)
          .then((res) => {
            this.sub_areas = res.data;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    onChangeSubArea(event){
      this.form.addressee=null;
      this.addressee=[];
      if (event != "" && event != null) {
        Api.get("/getUserSubArea/" + event)
          .then((res) => {
            this.addressee = res.data;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    onEditorChange({ quill, html, text }) {
      this.form.description = html;
    },
    refresh() {
      this.$root.$refs.ticket;
      this.centerDialogVisible = false;
    },
    async getUsuarios() {
      await Api.get("/getUserView")
        .then((res) => {
          this.addressee_secundaries = res.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    async getLocations() {
      await Api.get("/getLocations")
        .then((res) => {
          this.locations = res.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>
<style>
#description::before {
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}
.ql-container {
  min-height: 200px;
}
</style>