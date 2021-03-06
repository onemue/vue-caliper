import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import Bus from './bus'
// import state from './state/index'
import '@/assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);


Vue.config.productionTip = false
Vue.prototype.Bus = Bus

new Vue({
  render: h => h(App),
  // state
}).$mount('#app')
