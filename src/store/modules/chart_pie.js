import Api from './Api' // Clase Api donde se declara Axios y la ruta al servidor
import moment from 'moment'

export default {
  namespaced: true,
  state: {
		url: '/building/chart/cash-flow-bar',
		year: moment().format('YYYY'),
		cash_flow_bar: false,
		cash_flow_bar_chartdata: {
			labels: [],
			datasets: [{
				label: 'Ingresos',
				backgroundColor: ''
			},
			{
				label: 'Egresos',
				backgroundColor: '',
			}]
		},
		cash_flow_bar_options: {
			scales: {
				yAxes: [{
					ticks: {
						callback: function (value) {
							return new Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD'
							}).format(value)
						}
					}
				}]
			},
			responsive: true,
			maintainAspectRatio: false,
			tooltips: {
				enabled: false
			},
			legend: {
				display: true,
				position: 'bottom'
			},
			plugins: {
				datalabels: {
					color: 'rgba(0, 0, 0, 0.34)',
					textAlign: 'top',
					anchor: 'end',
					align: 'top',
					rotation: '270',
					font: {
						weight: 'bold'
					},
					formatter (value) {
						return new Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD'
						}).format(value)
					}
				}
			},
			layout: {
				padding: {
					top: 30
				},
			}
		}
  },
  mutations: {
		fetchCashFlowBar(state, year) {
			state.cash_flow_bar_chartdata.datasets[0].backgroundColor = red
			state.cash_flow_bar = false
			state.year = year
			axios.post(state.url, {
				year: state.year
			}).then(response => {
				state.cash_flow_bar_chartdata.datasets[0].backgroundColor = red
				state.cash_flow_bar_chartdata.labels = response.data.labels
				state.cash_flow_bar_chartdata.datasets[0].data = []
				state.cash_flow_bar_chartdata.datasets[1].data = []
				state.cash_flow_bar = true

				for (let month = 1; month <= 12; month++) {
					if (response.data.cash_ins[month])
						state.cash_flow_bar_chartdata.datasets[0].data.push(response.data.cash_ins[month])
					else
						state.cash_flow_bar_chartdata.datasets[0].data.push(0)

					if (response.data.cash_outs[month])
						state.cash_flow_bar_chartdata.datasets[1].data.push(response.data.cash_outs[month])
					else
						state.cash_flow_bar_chartdata.datasets[1].data.push(0)
				}
			}).catch(error => {
				console.log(error)
			})
		}
  }
}
