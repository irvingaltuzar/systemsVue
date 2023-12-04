<template>
	<div class="app-container">
		<el-card class="box-card" shadow="always">
      <div slot="header" class="clearfix text-center">
        <h3>Gráficas por contador</h3>
      </div>
			<div class="md-layout md-gutter mt-3">
				<div class="md-layout-item md-small-size-25">
					<el-select class="input-autocomplete" v-model="f.accountant_id" filterable placeholder="Selecciona un contador" @change="getList()">
						<el-option v-for="item in accountants" :key="item.id" :label="item.full_name " :value="item.usuario_ad"></el-option>
					</el-select>
					<span v-if="v.accountant_id" class="md-danger" style="color:red;">*{{ v.accountant_id[0] }}</span>
				</div>
				<div class="md-layout-item md-small-size-25">
          <el-select v-model="f.month" placeholder="Mes" @change="getList()">
            <el-option label="Enero" value="01"></el-option>
            <el-option label="Febrero" value="02"></el-option>
            <el-option label="Marzo" value="03"></el-option>
            <el-option label="Abril" value="04"></el-option>
            <el-option label="Mayo" value="05"></el-option>
            <el-option label="Junio" value="06"></el-option>
            <el-option label="Julio" value="07"></el-option>
            <el-option label="Agosto" value="08"></el-option>
            <el-option label="Septiembre" value="09"></el-option>
            <el-option label="Octubre" value="10"></el-option>
            <el-option label="Noviembre" value="11"></el-option>
            <el-option label="Diciembre" value="12"></el-option>
            <el-option label="Anual" value="14"></el-option>
          </el-select>
				</div>
				<div class="md-layout-item md-small-size-25">
					<el-input placeholder="Año" v-model="f.year" @input="getList()"></el-input>
				</div>
			</div>
			<br>
			<md-progress-bar v-if="loading_get_list" md-mode="indeterminate" />
			<div v-if="hasData">
				<Pie :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey" :plugins="plugins" :css-classes="cssClasses" :styles="styles" :width="width" :height="height"/>
			</div>
		</el-card>
	</div>
</template>

<script>
import { Pie } from 'vue-chartjs/legacy'
import moment from 'moment'
import '@/styles/global_styles.css'
import { mapMutations, mapState } from 'vuex'
import Api from '@/store/modules/Api'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

export default {
	name: 'MonthlyClosureChartsComponent',
  components: {
    Pie
  },
  props: {
    chartId: {
      type: String,
      default: 'pie-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartData: {
        labels: ['A tiempo', 'Fuera de tiempo'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651'],
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      chart: null,
			hasData: false,
			general_data:{},
			headers:{
				limit:20,
				page:1,
				order_by:'desc',
				search:"",
				month:moment(new Date()).format('MM'),
				year:moment(new Date()).format('YYYY'),
			},
			has_data: false,
			loading_get_list:true,
			f: {
				accountant_id: '',
				month:moment(new Date()).format('MM'),
				year:moment(new Date()).format('YYYY'),
			},
			v: new Object(),
			days: [
				/* { id: "01", value: '2023-01-12' },
				{ id: "02", value: '2023-02-10' },
				{ id: "03", value: '2023-03-10' },
				{ id: "04", value: '2023-04-12' },
				{ id: "05", value: '2023-05-12' },
				{ id: "06", value: '2023-06-12' },
				{ id: "07", value: '2023-07-12' },
				{ id: "08", value: '2023-08-11' },
				{ id: "09", value: '2023-09-12' },
				{ id: "10", value: '2023-10-12' },
				{ id: "11", value: '2023-11-10' },
				{ id: "12", value: '2023-12-12' }, */
				// { id: 14, value: 'Sábado' },
			],
      cutting_day:0,
    }
  },
  created(){
    //this.getCuttingDay();
    this.getCutOffDates();
  },
  computed: {
    ...mapState('accounting', ['accounting_companies', 'e_accounting_statues', 'accountants'])
  },
	methods: {
		...mapMutations('accounting', ['getAllCompanies', 'getEAccountingStatues', 'changeValue', 'getAccountantPersonal']),
		async getList(){
			this.hasData = false

    	//var founded = this.days.find( e => e.id == this.f.month)
      let key_month= 0;
       this.days.forEach((value,key) => {
        if(value.id == this.f.month){
          key_month = key
        }
      });

      // si es key= 12 es seleccionado para el anual
      let founded = key_month == 12 ? this.days[key_month] : this.days[key_month+1];


			this.loading_get_list= true;
			await Api.post('/accounting/monthly-closure/graphic',{
				month: this.f.month == 14 ? "00" : this.f.month,
				year: this.f.year,
				finish_date: founded,
				accountant_id: this.f.accountant_id
			})
			.then(response =>{
				this.chartData.datasets[0].data = response.data

				this.hasData = true
			})
			.catch(error =>{
				console.log(error," => ",'/accounting/monthly-closure/graphic');
				this.loading_get_list= false
			})
			.finally (() => {
				this.loading_get_list= false
			})
		},

    /* async getCuttingDay(){
      this.fullscreenLoading= true;

      await Api.get('/accounting/monthly-closure/get-cutting-day')
      .then(response =>{
        if(response.data.success == 1){
          this.cutting_day = response.data.data;
          this.calculateCuttingDay();
        }else{
          this.$notify({
            title: 'Error',
            message: response.data.message,
            type: 'error'
          });
        }

      })
      .catch(error =>{
        this.fullscreenLoading = false;
        this.$notify({
            title: 'Error',
            message: 'Error al conectarse con el servidor, vuelva a intentarlo de nuevo',
            type: 'error'
          });
        console.log('request error => /accounting/monthly-closure/get-cutting-day',error);

      });
    }, */
    async getCutOffDates(){
      this.fullscreenLoading= true;

      await Api.get('/accounting/monthly-closure/cutoff-date-graphics')
      .then(response =>{
        this.days = response.data;
        this.fullscreenLoading = false;
      })
      .catch(error =>{
        this.fullscreenLoading = false;
        this.$notify({
            title: 'Error',
            message: 'Error al conectarse con el servidor, vuelva a intentarlo de nuevo',
            type: 'error'
          });
        console.log('request error => /accounting/monthly-closure/cutoff-date-graphics',error);

      });
    },

    /* calculateCuttingDay(){

      let fecha = "";
      let final_dates=[];
      for (let month = 1; month <= 12; month++) {
        let _day = this.cutting_day;
        fecha = (new Date().getFullYear())+"-"+(month)+"-"+_day;
        let number_day = moment(fecha).day();

        if(number_day == 0){
          _day = _day-2;
        }else if(number_day == 6){
          _day = _day-1;
        }

        fecha = moment((new Date().getFullYear())+"-"+(month)+"-"+_day).format("YYYY-MM-DD");
        final_dates.push({
          id:moment((new Date().getFullYear())+"-"+(month)+"-"+_day).format("MM"),
          value:fecha
        });

      }

      final_dates.push({
        id:14,
        value:"2023-00-31"
      });

      this.days = final_dates;

    } */

	},
	mounted() {
    this.getAccountantPersonal()
	},
}
</script>
