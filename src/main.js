import Vue from 'vue'
import App from './App.vue'
// import state from './state/index'
import '@/assets/css/reset.css'


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // state
}).$mount('#app')
