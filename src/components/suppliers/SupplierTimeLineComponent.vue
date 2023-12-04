<template>
	<div>
		<md-dialog :md-active.sync="showDialog">
			<md-dialog-title>Historial</md-dialog-title>

			<md-dialog-content class="md-scrollbar">
				<el-timeline :reverse="reverse">
					<el-timeline-item v-for="(activity, index) in logs" :key="index" :timestamp="activity.seg_auditorium.fechaHora | moment('ddd Do MMM YYYY  hh:mm:ss')">
							<template v-if="activity.comentarios.startsWith('Edit')">
								<b>
									{{ activity.seg_auditorium.responsable_name }}
								</b>
								<br>
								<b>
									{{ activity.comentarios.substr(0,18) }}
									<br>
									Se realizaron actualizaciones sobre el registro de proveedor
								</b>
								<br>
							</template>
							<template v-else>
								<b>
									{{ activity.seg_auditorium.responsable_name }}
								</b>
								<br>
									{{	activity.comentarios.split('&&')[0]	}} <br>
								<b>
									{{	activity.comentarios.split('&&')[1]	}}
								</b>
								<br>
								<b>
									{{	activity.comentarios.split('&&')[2]	}}
								</b>
								<br>
								<b>{{ logs[index-1] ? diffSeconds([logs[index].seg_auditorium.fechaHora, logs[index-1].seg_auditorium.fechaHora]) : diffSeconds([0, 0])}}<br></b>

							</template>
						<br>
					</el-timeline-item>
				</el-timeline>
				<!-- <p>
					<template v-for="()">
					</template>
				</p> -->
			</md-dialog-content>
		</md-dialog>

		<el-button size="mini" type="warning" circle @click="activate()">
			<md-icon class="size-xsmall">history</md-icon>
		</el-button>
	</div>
</template>

<script>
import moment from 'moment'

import imageCompression from 'browser-image-compression'
import { mapMutations, mapState } from 'vuex'
import Api from '@/store/modules/Api'

export default {
	name: 'SupplierTimeLineComponent',
	props: {
		logs: {
			required: true
		},
	},
	data: () => ({
		reverse: true,
		activities: [{
			content: 'Success',
			timestamp: '2018-04-11'
		}, {
			content: 'Approved',
			timestamp: '2018-04-13'
		}, {
			content: 'Event start',
			timestamp: '2018-04-15'
		}],
		img_preview: null,
		array_specialties: [],
		is_loaded: null,
		showDialog: false,
		v: new Object(),
		sending: false,
		disabled: false
	}),
	watch: {
		'data'(val) {
			console.log()
		},
	},
	computed: {
		...mapState('suppliers_tools', ['specialties']),
		data() {
			return this.logs
		}
	},
	methods: {
		...mapMutations('suppliers_tools', ['fetchCatSpecialties', 'changeValue']),
		activate () {
			this.showDialog = true
		},
		diffHours (value) {
			var [first_date, second_date] = value
			return moment(second_date, "YYYY-MM-DD HH:mm:ss").diff(moment(first_date, "YYYY-MM-DD HH:mm:ss"), "h")
		},
		diffMinutes (value) {
			var [first_date, second_date] = value
			return moment(first_date, "YYYY-MM-DD HH:mm:ss").diff(moment(second_date, "YYYY-MM-DD HH:mm:ss"), "m")
		},
		diffSeconds (value) {
			var [first_date, second_date] = value

			
			var msecPerMinute = 1000 * 60;
			var msecPerHour = msecPerMinute * 60;
			var msecPerDay = msecPerHour * 24;
			
			var second_parse_date = new Date(first_date);
			var first_parse_date = new Date(second_date);
			
			var interval = second_parse_date.getTime() - first_parse_date.getTime();

			var days = Math.floor(interval / msecPerDay );
			interval = interval - (days * msecPerDay );

			
			var hours = Math.floor(interval / msecPerHour );
			interval = interval - (hours * msecPerHour );

			var minutes = Math.floor(interval / msecPerMinute );
			interval = interval - (minutes * msecPerMinute );

			var seconds = Math.floor(interval / 1000 );

			return " Han transcurrido: " +days + " días, " + hours + " horas, " + minutes + " minutos, " + seconds + " segundos."


			var hours = moment(second_date, "YYYY-MM-DD HH:mm:ss").diff(moment(first_date, "YYYY-MM-DD HH:mm:ss"), "h")

			var minutes = moment(second_date, "YYYY-MM-DD HH:mm:ss").diff(moment(first_date, "YYYY-MM-DD HH:mm:ss"), "m")

			var seconds = moment(first_date, "YYYY-MM-DD HH:mm:ss").diff(moment(second_date, "YYYY-MM-DD HH:mm:ss"), "s")

			var min = hours*60

			var res = minutes - min

			return res
		}
	}
}
</script>

<style lang="scss" scoped>
		.md-dialog {
				max-width: 70%;
				margin-left: auto;
				margin-right: auto;
		}

		.dropzone-container {
				cursor: pointer;
				min-height: 180px;
				border: 2px dashed rgba(0,0,0,.54);
		}
		.dropzone-content{
				text-align: center;
				margin-top: 4rem;
				color: #777;
		}

		.v-list__tile__title {
				text-align: center!important;
		}

	.md-drawer {
		width: 230px;
		max-width: calc(100vw - 125px);
	}

	.md-field {
		max-width: 300px;
	}

		.size-xsmall {
				width: 10px;
		min-width: 10px;
		height: 10px;
		font-size: 17px!important;

		}

</style>
