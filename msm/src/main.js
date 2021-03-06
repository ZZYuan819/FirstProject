import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './premission.js'

Vue.use(ElementUi);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
