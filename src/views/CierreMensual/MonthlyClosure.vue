<template>
    <div>
      <transition name="fade-transform" mode="out-in">
        <monthly-closure-list-component />
      </transition>
      <transition name="fade-transform" mode="out-in">
        <monthly-closure-charts-component />
      </transition>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MonthlyClosure',
    data: () => ({
    })
  }
  </script>
  
  <style lang="scss" scoped>
  
  </style>
  