import Vue from 'vue'
import App from './App'
import router from './router'
import coreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'

Vue.config.performance = true
Vue.use(coreuiVue)
Vue.use(require('vue-moment'))
Vue.prototype.$log = console.log.bind(console)


new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
