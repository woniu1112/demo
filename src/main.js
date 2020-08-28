import "@/assets/css/base.less";
import "@/assets/js/rem";
import global_ from "@/global/global";
import App from "./App";
import router from "./router";
import * as filters from "@/filters/commonFilters";
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

Vue.config.productionTip = false;
Vue.prototype.GLOBAL = global_;
Vue.prototype.wxEnvFlag = navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1;
Vue.prototype.html5PlusEnvFlag = navigator.userAgent.indexOf("Html5Plus") > -1;
Vue.prototype.isIosEnvFlag = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
