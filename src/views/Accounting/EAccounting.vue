<template>
  <div>
    <transition name="fade-transform" mode="out-in">
      <add-e-accounting-component />
    </transition>
    <transition name="fade-transform" mode="out-in">
      <e-accounting-charts-component />
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import Api from '@/store/modules/Api'
import moment from 'moment'

export default {
  name: 'EAccounting',
  data: () => ({
  })
}
</script>

<style lang="scss" scoped>

</style>
