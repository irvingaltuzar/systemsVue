<template>
  <div class="app-container">

    <div>
      <h2 class="heading text-center">Mi reloj <span style="color: #3d90fb">checador</span></h2><br>
      <center>
        <el-tag type="success" effect="dark" style="margin-left: 15px">Puntualidad</el-tag>
        <el-tag type="info" effect="dark" style="margin-left: 15px">Tolerancia</el-tag>
        <el-tag type="warning" effect="dark" style="margin-left: 15px">Retardo</el-tag>
        <el-tag type="danger" effect="dark" style="margin-left: 15px">Suspensión</el-tag>
        <el-tag effect="dark" style="margin-left: 15px">Día Justificado</el-tag>
      </center><br>
    </div>
    <div id="app2">

      <div class="calendar-parent">
        <calendar-view
          :events="events"
          :show-date="showDate"
          :time-format-options="{hour: 'numeric', minute:'2-digit'}"
          :enable-drag-drop="true"
          :disable-past="disablePast"
          :disable-future="disableFuture"
          :show-event-times="showEventTimes"
          :display-period-uom="displayPeriodUom"
          :display-period-count="displayPeriodCount"
          :starting-day-of-week="startingDayOfWeek"
          :class="themeClasses"
          :weekday-name-format="weekdayNameFormat"
          :locale="lang"
          :period-changed-callback="periodChanged"
          :current-period-label="useTodayIcons ? 'icons' : ''"
          event-top="2.5em"
          event-content-height="1.4em"
          event-border-height="2px"
          @click-date="onClickDay"
          @click-event="onClickEvent"
        >
          <calendar-view-header
            slot="header"
            slot-scope="{ headerProps }"
            :header-props="headerProps"
            @input="setShowDate"
          />
        </calendar-view>
      </div>
    </div>
     <ModalJustification ref="ModalJustification" />

  </div>
  
</template>
<script>
import { CalendarView, CalendarViewHeader, CalendarMathMixin } from 'vue-simple-calendar'
import fecha from 'element-ui/src/utils/date'
import ModalJustification from './components/ModalJustification'

// require("vue-simple-calendar/dist/style.css")
// The next two lines are optional themes
// require("vue-simple-calendar/static/css/default.css")
require('./static/css/default.css')
require('vue-simple-calendar/static/css/holidays-us.css')

export default {
  name: 'App',
  components: { CalendarView, CalendarViewHeader,ModalJustification
  },
  mixins: [CalendarMathMixin],
  data: function() {
    return {
      showDate: this.thisMonth(1),
      message: '',
      startingDayOfWeek: 0,
      disablePast: false,
      disableFuture: true,
      displayPeriodUom: 'month',
      displayPeriodCount: 1,
      showEventTimes: true,
      weekdayNameFormat: 'long',
      newEventTitle: '',
      newEventStartDate: '',
      newEventEndDate: '',
      useDefaultTheme: true,
      useHolidayTheme: true,
      useTodayIcons: false,
      lang: 'es',
      value: fecha.format(new Date(), 'yyyy-MM'),
      events: []
    }
  },
  computed: {

    userLocale() {
      // console.log(this.getDefaultBrowserLocale)
      return this.getDefaultBrowserLocale
    },
    dayNames() {
      return this.getFormattedWeekdayNames(this.userLocale, 'long', 0)
    },
    themeClasses() {
      return {
        'theme-default': this.useDefaultTheme,
        // 'holiday-us-traditional': this.useHolidayTheme,
        'holiday-us-official': this.useHolidayTheme,
        // 'holiday-us-official': this.useHolidayTheme
      }
    }
  },
  created() {
    this.getPersonalAttendance()
  },
  mounted() {
    this.newEventStartDate = this.isoYearMonthDay(this.today())
    this.newEventEndDate = this.isoYearMonthDay(this.today())
  },
  methods: {

    getPersonalAttendance() {
      const formData = new FormData()
      formData.append('date', this.value)

      this.$store.dispatch('getPersonalAttendance', formData).then(res => {
        this.events = res
      })
    },
    setShowDate(d) {
      this.showDate = d
    },
    periodChanged(range, eventSource) {
      // Demo does nothing with this information, just including the method to demonstrate how
      // you can listen for changes to the displayed range and react to them (by loading events, etc.)
      // console.log(eventSource)
      // console.log(range)
      this.value = fecha.format(range.periodStart, 'yyyy-MM'),
      this.getPersonalAttendance()
    },
    thisMonth(d, h, m) {
      const t = new Date()
      return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
    },
    onClickDay(d) {
      // console.log(`You clicked: ${d.toLocaleDateString()}`)
    },
    onClickEvent(e) {
      // this.message = `You clicked: ${e.title}`
      if(e.title =="Justificado"){
         this.$root.$refs.ModalJustification.getPersonalIntelisis()
      this.$root.$refs.ModalJustification.ruleForm.userAd = e.originalEvent.obj.user
      this.$root.$refs.ModalJustification.ruleForm.typeJus = e.originalEvent.obj.type_id
      this.$root.$refs.ModalJustification.ruleForm.Comentarios = e.originalEvent.obj.description
      this.$root.$refs.ModalJustification.ruleForm.FechaInicio = e.originalEvent.obj.date
      this.$root.$refs.ModalJustification.filename =e.originalEvent.obj.file
      this.$root.$refs.ModalJustification.isDisabled =true;
      this.$root.$refs.ModalJustification.dialogType = 'edit'
      this.$root.$refs.ModalJustification.dialogVisible = true
      }
       if(e.title =="Vacaciones"){
      window.open(e.originalEvent.obj, "_blank");
       }
       if(e.title =="Permiso"){
        window.open(e.originalEvent.obj , "_blank");
       }
    },
    setShowDate(d) {
      this.message = `Changing calendar view to ${d.toLocaleDateString()}`
      this.showDate = d
    },
    onDrop(event, date) {
      this.message = `You dropped ${event.id} on ${date.toLocaleDateString()}`
      // Determine the delta between the old start date and the date chosen,
      // and apply that delta to both the start and end date to move the event.
      const eLength = this.dayDiff(event.startDate, date)
      event.originalEvent.startDate = this.addDays(event.startDate, eLength)
      event.originalEvent.endDate = this.addDays(event.endDate, eLength)
    },
  //    handleDetailJustification(scope){
  //  this.$root.$refs.ModalJustification.getPersonalIntelisis()
  //     this.$root.$refs.ModalJustification.ruleForm.userAd = scope.row.justification.user
  //     this.$root.$refs.ModalJustification.ruleForm.typeJus = scope.row.justification.type_id
  //     this.$root.$refs.ModalJustification.ruleForm.Comentarios = scope.row.justification.description
  //     this.$root.$refs.ModalJustification.ruleForm.FechaInicio = scope.row.justification.date
  //     this.$root.$refs.ModalJustification.filename = scope.row.justification.file
  //     this.$root.$refs.ModalJustification.isDisabled =true;
  //     this.$root.$refs.ModalJustification.dialogType = 'edit'
  //     this.$root.$refs.ModalJustification.dialogVisible = true
  //   },
    clickTestAddEvent() {
      // console.log('test')
      this.events.push({
        startDate: this.newEventStartDate,
        endDate: this.newEventEndDate,
        title: this.newEventTitle,
        id:
					'e' +
					Math.random()
					  .toString(36)
					  .substr(2, 10)
      })
      this.message = 'You added an event!'
    }

  }
}
</script>
<style>

#app2 {
	display: flex;
	flex-direction: row;
	font-family: Calibri, sans-serif;
	width: 95vw;
	min-width: 30rem;
	max-width: 100rem;
	min-height: 33rem;
	margin-left: auto;
	margin-right: auto;
}
  .calendar-controls {
	margin-right: 1rem;
	min-width: 14rem;
	max-width: 14rem;
}
.calendar-parent {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow-x: hidden;
	overflow-y: hidden;
	max-height: 100vh;
	background-color: white;
}
/* For long calendars, ensure each week gets sufficient height. The body of the calendar will scroll if needed */
.cv-wrapper.period-month.periodCount-2 .cv-week,
.cv-wrapper.period-month.periodCount-3 .cv-week,
.cv-wrapper.period-year .cv-week {
	min-height: 6rem;
}
/* These styles are optional, to illustrate the flexbility of styling the calendar purely with CSS. */
/* Add some styling for events tagged with the "birthday" class */
.theme-default .cv-event.birthday {
	background-color: #e0f0e0;
	border-color: #d7e7d7;
}
.theme-default .cv-event.birthday::before {
	content: "\1F382"; /* Birthday cake */
	margin-right: 0.5em;
}
</style>
