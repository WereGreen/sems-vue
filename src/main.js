import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'echarts'

import ECharts from 'vue-echarts'
Vue.component('v-chart', ECharts)

import moment from "moment";
Vue.prototype.$moment = moment;
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from './axios'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

// require("./mock/index.js")

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
