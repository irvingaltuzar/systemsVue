<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-documentation">
          <svg-icon icon-class="BOTON_DOCUMENTOS" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Documentos
          </div>
          <!-- <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-pictures">
          <svg-icon icon-class="BOTON_IMAGENES" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Imagenes
          </div>
          <!-- <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-videos">
          <svg-icon icon-class="BOTON_VIDEOS" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Videos
          </div>
          <!-- <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-Politics">
          <svg-icon icon-class="BOTON_FORMATOS" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Formatos
          </div>
          <!-- <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" /> -->
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 0px;

  .card-panel-col {
    margin-bottom: 32px;
  }

 .card-panel {
    height: 110px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    border-radius:50px;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .20);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-documentation {
        background: #0072bc;
      }
      .icon-pictures{
        background:#389701;
      }

      .icon-videos {
        background:#ff482c;
      }

      .icon-Politics {
        background: #ffbe00
      }
    }

    .icon-documentation {
      color:#0072bc;
    }

    .icon-pictures {
      color: #4ea400;
    }

    .icon-videos {
      color: #f4516c;
    }

    .icon-Politics {
      color: #34bfa3
    }

   .card-panel-icon-wrapper {
      float: left;
    margin: 8px 0px 0 11px;
    padding: 10px;
    -webkit-transition: all 0.38s ease-out;
    transition: all 0.38s ease-out;
    border-radius: 50px;
    }

    .card-panel-icon {
      float: left;
      font-size: 65px;
    }

    .card-panel-description {
         float: left;
    font-weight: bold;
    margin: 30px;
    margin-left: 10px;

      .card-panel-text {
        line-height: 45px;
        color: rgb(10 0 0 / 67%);
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 25px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
