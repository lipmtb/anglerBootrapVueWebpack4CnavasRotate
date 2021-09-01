<template>
  <div id="angler-app">
    <nav-top></nav-top>
    <info-top></info-top>
    <main-conten></main-conten>
    <login-reg></login-reg>
    <my-loading></my-loading>
  </div>
</template>


<script>
import NavTop from "./views/NavTop.vue";
import InfoTop from "./views/InfoTop.vue";
import MainConten from "views/MainConten.vue";
import LoginReg from "components/content/UserLogReg.vue";

import MyLoading from "components/common/CanvasLoading01";

import { isLogin } from "network/loginReg/isLogin";
import { mapMutations } from "vuex";

export default {
  name: "App",
  mounted() {
    isLogin().then((res) => {
      console.log("是否登录", res);
      if (res.errCode === 401) {
        localStorage.clear();
        this.clearLoginInfo();
        this.$nextTick(()=>{
          this.$vmbox.$emit("openLoginMod");
        })
      }
    });
  },
  components: {
    NavTop,
    InfoTop,
    MainConten,
    LoginReg,
    MyLoading,
  },
  methods: {
    ...mapMutations("users", ["clearLoginInfo"]),
  },
};
</script>

<style>
#angler-app {
  padding-bottom: 400px;
}
</style>