import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import wysiwyg from 'vue-wysiwyg'
Vue.config.productionTip = false
export const bus = new Vue();

Vue.use(wysiwyg, {});
require("../node_modules/vue-wysiwyg/dist/vueWysiwyg.css");

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
