<template>
    <div>
      <transition name="fade-transform" mode="out-in">
        <overviews-activities-list-component />
      </transition>
    </div>
  </template>
  
  <script>
  import { mapMutations, mapState } from 'vuex'
  import Api from '@/store/modules/Api'
  import moment from 'moment'
  
  export default {
    name: 'OverviewsActivities',
    data: () => ({
    })
  }
  </script>
  
  <style lang="scss" scoped>
  
  </style>
  