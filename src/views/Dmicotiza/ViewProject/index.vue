<template>
  <div class="container" v-if="data">
    <h4 class="text-center pt-4">{{ data.view }}</h4>
    <div class="mt-4">
      <el-button type="primary" size="large" class="mt-2" @click="addSubdivicion()" v-if="data.subdivisions.length< data.subdivision">
        Agregar subdiviciones
      </el-button>
      <table class="table table-lg mt-3 mb-3">
        <thead>
          <tr>
            <th>Subdivisión</th>
            <th>Posición</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-if="data.subdivisions">
          <tr v-for="(item, index) in data.subdivisions" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ item.position }}</td>
            <td>
              <el-button type="primary" icon="el-icon-edit" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4">
      <el-button type="primary" size="large" class="mt-2">
        Agregar grupos
      </el-button>
      <table class="table table-lg mt-3 mb-4">
        <thead>
          <tr>
            <th>Grupo</th>
            <th>Subdivición</th>
            <th>Columnas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody v-if="data.subdivisions">
          <template v-for="item in data.subdivisions">
            <tr v-for="(group,index) in item.subdivision_group" :key="index">
              <td>{{ group.group }}</td>
              <td>{{ item.name  }}</td>
              <td>{{ group.column }}</td>
              <td>
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <ModalSubdivision ref="ModalSubdivision" />
  </div>
</template>
<script>
import Api from "@/store/modules/Api";
import ModalSubdivision from "./components/ModalSubdivision";
export default {
  name: "ProjectView",
  components: {
    ModalSubdivision
  },
  data() {
    return {
      data: null,
    };
  },
  created() {
    this.$root.$refs.ProjectView = this;
    this.getViewProject(this.$route.params.idView);
  },
  methods: {
    addSubdivicion(){
      this.$root.$refs.ModalSubdivision.form.reset();
      this.$root.$refs.ModalSubdivision.centerDialogVisible = true;
      this.$root.$refs.ModalSubdivision.form.view=this.data.id;
      this.$root.$refs.ModalSubdivision.form.position=this.data.subdivisions.length
      this.$root.$refs.ModalSubdivision.title="Agregar";
    },
    async getViewProject(id) {
      Api.get("getViewProject/" + id)
        .then((res) => {
          this.data = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
