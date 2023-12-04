<template>
  <div class="app-container">
    <el-card class="box-card" shadow="always">
      <div class="nine">
        <h1>Requisiciones de<span>mi Personal</span></h1>
      </div>
        <tableMiPersonal  />

    </el-card>
        <ModalRequisition ref="ModalRequisition" />
          <viewFile  ref="viewFile" />

  </div>
</template>

<script>
import { mapGetters} from 'vuex'
import { deepClone } from '@/utils'
import ModalRequisition from './components/ModalRequisition'
import tableValidation from './components/tableMiPersonal'
import viewFile from '../components/viewFile'
export default {
  components: { ModalRequisition,viewFile },
  data() {
    return {
      search: '',
      btnloading: false,
      btnloading2: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
    }
  },
  beforeMount() {
    this.$root.$refs.ViewHorariosPersonal = this
  },
   computed: {
    // mix the getters into computed with object spread operator

  },

}
</script>

<style lang="scss" scoped>
/* Style 9
   ----------------------------- */
.nine h1 {
  text-align:center; font-size:25px; text-transform:uppercase; color:#222; letter-spacing:1px;
  font-family:Helvetica,Arial,sans-serif; font-weight:400;
}
.nine h1 span {
  margin-top: 5px;
    font-size:13px; color:#444; word-spacing:1px; font-weight:normal; letter-spacing:2px;
    text-transform: uppercase; font-family:"Raleway", sans-serif; font-weight:500;

    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    grid-template-rows: 27px 0;
    grid-gap: 20px;
    align-items: center;
}

.nine h1 span:after,.nine h1 span:before {
    content: " ";
    display: block;
    border-bottom: 1px solid #ccc;
    border-top: 1px solid #ccc;
    height: 5px;
  background-color:#f8f8f8;
}

</style>
