<template>
  <div class="main-conten-wrapper" @scroll="onMainContentScroll">
    <div
      ref="mainMidLists"
      class="hiddleBox"
      style="width: 100%; height: 0px"
    ></div>
    <NavLists
      :lists="navDataLists"
      :class="{ fixedStick: isFixstick }"
      v-if="$route.matched[0]"
    />
    <router-view></router-view>

  </div>
</template>

<script>
import NavLists from "components/common/NavLists";
import jieliu from "util/jieliu";
import fandou from "util/fandou";
export default {
  name: "mainConten",
  components: {
    NavLists,
  },
  data() {
    return {
      isFixstick: false,
      navDataLists: [
        {
          path: "/talk",
          title: "钓友圈",
        },
        {
          path: "/tip",
          title: "技巧",
        },
        {
          path: "/profile",
          title: "我的",
          childs: [
            {
              path: "/profile/myhist",
              title: "浏览历史",
            },
            {
              path: "/profile/mycollect",
              title: "我的收藏",
            },
            {
               path: "/profile/mymsg",
              title: "我的消息", 
            }
          ],
        },
      ],
    };
  },
  mounted() {
    this.mainScrollJieliu = jieliu(this.onMainContentScroll, 500, this);
    this.fandouMainScroll = fandou(this.onMainContentScroll, 500, this);
    document.defaultView.addEventListener(
      "scroll",
      this.mainScrollJieliu,
      false
    );
    document.defaultView.addEventListener(
      "scroll",
      this.fandouMainScroll,
      false
    );
  },
  beforeDestroy() {
    document.defaultView.removeEventListener("scroll", this.mainScrollJieliu);
    document.defaultView.removeEventListener("scroll", this.fandouMainScroll);
  },
  methods: {
    onMainContentScroll() {
      let tmp = null;
      if ((tmp = this.$refs.mainMidLists)) {
        if (tmp) {
          let bounding = tmp.getBoundingClientRect();
          // console.log(bounding.y);
          if (bounding.y < 4) {
            this.isFixstick = true;
          } else {
            this.isFixstick = false;
          }
        }
      }
    },
  },
};
</script>

<style>
.fixedStick {
  position: fixed;
  top: 2px;
  left: 0;
  right: 0;
  margin: auto;
  background-color:rgba(255, 255, 255, 0.438);
}
</style>