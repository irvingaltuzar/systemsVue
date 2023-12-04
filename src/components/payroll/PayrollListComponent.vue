<template>
  <el-container>
    <el-dialog :visible.sync="dialogVisible" width="85%" top="0vh" @close="url= ''">
      <iframe id="fred" style="border:1px solid #666CCC" title="" :src="base_embed+url" frameborder="0" scrolling="auto" height="700" width="100%" />
    </el-dialog>
    <md-card class="md-layout-item  md-small-size-100">
      <md-card-header>
        <div class="md-title">Recibos de nómina </div>
        <el-select v-model="tmp_year" placeholder="Año">
          <el-option :label="year" :value=year selected/>
          <el-option label="2022" value=2022 />
          <el-option label="2021" value=2021 />
          <el-option label="2020" value=2020 />
          <el-option label="2019" value=2019 />
          <el-option label="2018" value=2018 />
        </el-select>
      </md-card-header>
      <md-progress-bar v-if="is_loading" md-mode="indeterminate" />

    <md-card-content v-else>
      <el-container>
        <el-row :gutter="25">
          <el-col :span="12"  v-for="(item, index) in months" :key="`d-${index}`" :offset="index > 0 ? 0 : 0" style="padding: 8px">
            <el-card style="height: 200px;">
              <el-container>
                <el-col>
                  <div class="mx-auto text-center">
                    <h4><b>{{item.name}}</b></h4>
                  </div>
                </el-col>
              </el-container>
              <el-divider ><i class="el-icon-star-on"></i></el-divider>
              <el-container>
                <el-row :gutter="100" class="mx-auto">
                  <el-col :span="12" v-for="(payroll, index) in payrolls">
                    <template v-if="payroll.month === item.name">
                      <span class="span-file"><b>{{payroll.comments}}</b> </span>
                      <div class="md-layout md-gutter mt-3">
                        <div class="md-layout-item md-small-size-50">
                          <el-button size="mini" type="danger" circle @click="getPdf(payroll)">
                            <md-icon class="size-xsmall">picture_as_pdf</md-icon>
                          </el-button>
                        </div>
                        <div class="md-layout-item md-small-size-50">
                          <el-button size="mini" type="warning" circle @click="downloadXml(payroll)">
                            <md-icon class="size-xsmall">file_download</md-icon>
                          </el-button>
                        </div>
                      </div>
                      <el-divider ><i class="el-icon-star-on"></i></el-divider>
                      <!-- <el-button type="primary mb-2" icon="el-icon-view" @click="preview(payroll.pdf_url)" round>Visualizar</el-button> -->
                    </template>
                  </el-col>
                </el-row>
              </el-container>
              <el-row>
              </el-row><br>
            </el-card>
          </el-col>
        </el-row>
      </el-container>
    </md-card-content>

      <md-progress-bar v-if="disabled" md-mode="indeterminate" />
    </md-card>
  </el-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { saveAs } from 'file-saver'
import moment from 'moment'
import Api from '@/store/modules/Api'

export default {
  name: 'PayrollListComponent',

  data: () => ({
    disabled: false,
    dialogVisible:false,
    tmp_year: '',
    pdf_url: process.env.VUE_APP_URL_PDF,
    url: '',
    base_embed: 'data:application/pdf;base64,',
    year:moment(new Date()).format('YYYY'),
    currentDate: '2021-06-01'
  }),
  watch: {
    'tmp_year' (val) {
      this.getPayroll(this.tmp_year)
    }
  },
  computed: {
    ...mapState('tools', ['payrolls', 'months', 'is_loading']),
    is_now() {
      return moment().year()
    }
  },
  methods: {
    ...mapMutations('tools', ['getPayroll']),
    preview(value) {
      this.url = value

      setTimeout(() => {
        this.dialogVisible = true
      }, 50)
    },
    getPdf(value) {
      Api.post('tools/payroll/get-pdf', {
        payroll: value,
        type: 1
      })
      .then(response => {
        this.preview(response.data)
      })
      .catch(error => {
        this.$notify({
          title: 'Oops!',
          message: 'No se localizó la nómina del periodo seleccionado, contacte al departamento de nóminas.',
          type: 'info'
        })
      })
    },
    downloadXml(value) {
      Api.post('tools/payroll/get-xml', {
        payroll: value,
        type: 2
      })
      .then(response => {
        var FileSaver = require('file-saver');
        var blob = new Blob([response.data], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, `${value.payroll_code}.xml`);
      })
      .catch(error => {
        console.log(error)
        this.$notify({
          title: 'Oops!',
          message: 'No se localizó la nómina del periodo seleccionado, contacte al departamento de nóminas.',
          type: 'info'
        })
      })
    }
  },
  mounted() {
    this.getPayroll(this.is_now)
  }
}

</script>

<style lang="scss" scoped>
  .phone-viewport {
    width: 322px;
    height: 200px;
    display: inline-flex;
    align-items: flex-end;
    overflow: hidden;
    border: 1px solid rgba(#000, .26);
    background: rgba(#000, .06);
  }
  iframe {
    display: block;
    background: #000;
    border: none;
    height: 83vh;
     width: 100vw;
  }
</style>
