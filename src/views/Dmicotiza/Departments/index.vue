<template>
  <div id="tabla_dep" class="mt-5 mb-5 ml-3 mr-3" v-if="data">
    <div v-if="data.length == 0" class="text-center mt-5 w-100">
      <h2 class="font-weight-bold">
        Actualmente no existe información de los departamentos.
      </h2>
    </div>
    <table class="w-100 mb-4">
      <tr>
        <td
          v-for="item in data"
          :key="item.path"
          :colspan="item.cantSubdivision"
          class="text-center name_view"
        >
          {{ item.name }}
        </td>
      </tr>
      <tr>
        <td
          v-for="item in data"
          :key="item.path"
          :colspan="item.cantSubdivision"
          class="text-center"
        >
          <table class="w-100 contenido_dep">
            <tr class="name_view" v-if="item.grupo">
              <td class="text-center border-right" width="70px">
                <div v-if="item.viewSubdivision">#</div>
              </td>
              <td
                v-for="group in item.subdivisionGroups"
                :key="group.path"
                class="text-center border-right"
                :colspan="group.column"
              >
                <span v-if="group.name != ''">{{ group.name }}</span>
                <span class="group" v-else>.</span>
              </td>
            </tr>
            <tr class="name_view" v-if="!item.viewSubdivision">
              <td class="text-center border-right" width="70px">#</td>
              <td
                v-for="subdivision in item.subdivision"
                :key="subdivision.path"
                class="text-center border-right"
                width="170px"
              >
                {{ subdivision.name }}
              </td>
            </tr>

            <tr v-for="department in item.department" :key="department.path">
              <td class="text-center border">
                {{ department.level }}
              </td>
              <td
                v-for="info in department.department"
                :key="info.path"
                class="text-center border depas"
                :colspan="info.column"
                :rowspan="info.row"
                :style="
                  'background:' + info.background + '; color:' + info.color
                "
              >
                <div v-if="info.info" class="h-100">
                  <div
                    class="cursor-pointer h-100 d-flex align-items-center justify-content-center"
                    v-if="info.amenidad"
                    @click="
                      editAmenities(info.id, info.data, info.row, info.column)
                    "
                  >
                    {{ info.data }}
                  </div>
                  <div
                    v-else
                    :title="info.department.colorStatus.title"
                    class="pt-2 cursor-pointer h-100" @click="editDeparment(info.department.id)"
                  >
                    <div>{{ info.department.type }}</div>
                    <div>
                      <strong>{{(info.department.level==0)? 'PG': info.department.level}}{{ info.department.number }} </strong
                      ><span
                        class="circle"
                        :style="
                          'background:' +
                          info.department.colorStatus.background +
                          '; color:' +
                          info.department.colorStatus.background
                        "
                        >.</span
                      >
                    </div>
                    <div><strong>Total</strong></div>
                    <div>{{ info.department.m2 }} m<sup>2</sup></div>
                    <div>
                      <strong>{{ info.department.price }}</strong>
                    </div>
                  </div>
                </div>
                <div class="w-100 h-100" v-else>
                  <div
                    class="w-100 h-100 cursor-pointer"
                    @click="
                      addDepartment(
                        info.level,
                        info.subdivision,
                        item.projectId,
                        item.viewId
                      )
                    "
                  >
                    &nbsp;
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <ModalDepartment ref="ModalDepartment" />
    <ModalAmenities ref="ModalAmenities" />
  </div>
</template>
<script>
import Api from "@/store/modules/Api";
import { mapGetters } from "vuex";
import ModalDepartment from "./components/ModalDepartment";
import ModalAmenities from "./components/EditAmenities";

export default {
  name: "Department",
  components: {
    ModalDepartment,
    ModalAmenities,
  },
  data() {
    return {
      data: null,
    };
  },
  created() {
    this.$root.$refs.Department = this;
    this.getDepartments(this.$route.params.id);
  },
  methods: {
    editAmenities(id, data, row, column) {
      this.$root.$refs.ModalAmenities.form.reset();
      this.$root.$refs.ModalAmenities.form.id = id;
      this.$root.$refs.ModalAmenities.form.name = data;
      this.$root.$refs.ModalAmenities.form.row = row;
      this.$root.$refs.ModalAmenities.form.column = column;
      this.$root.$refs.ModalAmenities.centerDialogVisible = true;
    },
    editDeparment(id){
      this.$router.push({
        path: "/detail/" + id,
      });
    },
    addDepartment(level, id, projectId, viewId) {
      this.$root.$refs.ModalDepartment.form.reset();
      this.$root.$refs.ModalDepartment.centerDialogVisible = true;
      this.$root.$refs.ModalDepartment.form.project = projectId;
      this.$root.$refs.ModalDepartment.form.view = viewId;
      this.$root.$refs.ModalDepartment.form.subdivision = id;
      this.$root.$refs.ModalDepartment.form.level = level;
    },
    async getDepartments(id) {
      Api.get("/department/" + id)
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
<style >
 #tabla_dep{
   width: auto !important;
   overflow-x: auto;
 }
 td div{
   min-width: 100px;
 }
</style>