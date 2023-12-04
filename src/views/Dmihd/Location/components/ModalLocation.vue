<template>
  <div>
    <el-dialog
      :title="title + ' ubicación'"
      :visible.sync="centerDialogVisible"
      width="50%"
      height="100%"
      top="3vh"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :rules="rules" :model="form">
        <el-form-item label="Ubicación" prop="location">
          <el-input v-model="form.location" clearable />
        </el-form-item>
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
        location: "",
      }),
      rules: {
        location: [
          {
            required: true,
            message: "Por favor Ingresa la ubicación",
            trigger: "change",
          },
        ],
      },
    };
  },
  beforeMount() {
    this.$root.$refs.ModalLocation = this;
  },
  methods: {
    onSubmit() {
         this.$refs["form"].validate((valid) => {
        if (valid) {
            if(this.form.id==""||this.form.id==null){
                this.AddLocation();
            }else{
              this.EditLocation();
            }
        } else {
          this.$message.warning("Falta capturar Informacion");
          return false;
        }
      });
    },
    async EditLocation(){
      const currentObj = this
      currentObj.status=""
      await Api.post("updateLocation", this.form)
      .then(function(response) {
          currentObj.success = response.data.success
          currentObj.status = response.statusText
        })
        .catch(function(error) {
          currentObj.output = error.response.data.error.validator.customMessages["location.unique"]
        })
        if (currentObj.status === 'OK') {
            this.$message.success(currentObj.success)
            this.refresh()
        }else{
            this.$message.warning(currentObj.output)
        }
    },
     async AddLocation() {
         const currentObj = this
         currentObj.status=""
      await Api.post("storeLocation", this.form)
      .then(function(response) {
          currentObj.success = response.data.success
          currentObj.status = response.statusText
        })
        .catch(function(error) {
          currentObj.output = error.response.data.error.validator.customMessages["location.unique"]
        })
        if (currentObj.status === 'OK') {
            this.$message.success(currentObj.success)
            this.refresh()
        }else{
            this.$message.warning(currentObj.output)
        }
    },
    refresh() {
      this.$root.$refs.Locations.getLocations();
      this.centerDialogVisible = false;
    },
  }
};
</script>