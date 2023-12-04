<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme

export default {
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  beforeMount() {
    this.$root.$refs.GraficaStatusTicket = this;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");

      this.chart.setOption({
        title: {
          text: "Gráfica de solicitudes",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          left: "center",
          bottom: "0",
          data: [
            "Solicitudes cerradas",
            "Solicitudes canceladas",
            "Solicitudes retrasadas",
            "Solicitudes sin leer",
          ],
        },
        series: [
          {
            name: "Gráfica de solicitudes",
            type: "pie",
            radius: [4, 120],
            center: ["50%", "50%"],
            data: [
              { value: 1, name: "Solicitudes cerradas" },
              { value: 1, name: "Solicitudes canceladas" },
              { value: 1, name: "Solicitudes retrasadas" },
              { value: 10, name: "Solicitudes sin leer" },
            ],
            animationEasing: "cubicInOut",
            animationDuration: 2600,
          },
        ],
      });
    },
  },
};
</script>
