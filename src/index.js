import Vue from "vue";

import "assets/css/normalize.css";
import "assets/fonts/iconfont.css";

import router from "route";
import store from "store";


import App from "./App.vue";

Vue.config.productionTip=false;
Vue.filter("filterTimer",(timestr)=>{
    return new Date(timestr).toLocaleDateString();
})
new Vue({
    router,
    store,
    beforeCreate(){
        Vue.prototype.$vmbox=this;
    },
    render(h){
        return h(App);
    }
}).$mount("#root")



