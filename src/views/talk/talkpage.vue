<template>
  <div class="talkpage">
  
    <!-- 钓友圈帖子列表 -->
    <div class="container talk-lists clearfix">
      <TalkBrief
        v-for="talkitem of newTalkLists"
        :key="talkitem._id"
        :talkItemData="talkitem"
      />
    </div>

    <!-- 新收藏固定盒子 -->
    <div id="collected-fixed">
      <h4>新收藏:{{ collectTalkLists.length }}</h4>
      <ul class="collectnew-lists">
        <li
          class="newcollectitem"
          v-for="newitem in collectTalkLists"
          :key="newitem._id"
        >
          <span>{{ newitem.title }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TalkBrief from "./talkcpn/TalkBrief.vue";
import { getNewTalk } from "network/talk/talk";
import { mapState } from "vuex";
// import jieliu from "util/jieliu";
  import fandou from "util/fandou";

export default {
  name: "talkpage",
  data() {
    return {
      newTalkLists: [],
      hasMoreTalk: true,
      canGetMore: true, //防止重复key
    };
  },
  computed: {
    ...mapState("talkCollect", ["collectTalkLists"]),
  },
  components: {
    TalkBrief,
  },
  mounted() {
    this.getNewTalkListsBySkip();
   this.fandouReachBottom=fandou(this.getNewTalkListsBySkip,500,this);
    document.defaultView.addEventListener("scroll", this.onTalkPageSroll);
  },
  beforeDestroy() {
    document.defaultView.removeEventListener("scroll", this.onTalkPageSroll);
  },
  methods: {
    onTalkPageSroll(e) {
      // console.log(e);
      // console.log(e.currentTarget,e.currentTarget.scrollY,document.body.scrollHeight);
      let contentHeight = document.body.scrollHeight;
      let viewHeight = document.documentElement.clientHeight;
      if (e.currentTarget.scrollY + viewHeight >= contentHeight) {
        // console.log("reached bottom");
        this.fandouReachBottom();
      }
    },
    getNewTalkListsBySkip() {
      if (this.hasMoreTalk && this.canGetMore) {
        this.canGetMore = false;
         this.$vmbox.$emit("showLoading");
        getNewTalk(this.newTalkLists.length, 4)
          .then((talklists) => {
            // console.log("获取最新talk", talklists);
            if (talklists.length < 4) {
              this.hasMoreTalk = false;
            }
            this.newTalkLists.push(...talklists);
          })
          .finally(() => {
            this.$nextTick(() => {
              this.canGetMore = true;
            });
            setTimeout(()=>{

              this.$vmbox.$emit("hideLoading");
            },1000);
          });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.talkpage {
  background-color: #fff;
}
#collected-fixed {
  position: fixed;
  bottom: 200px;
  right: 0.1em;
  background-color: tomato;
  border-radius: 22px 4px;
  padding: 0.2em;
  max-width: 0;
  overflow: hidden;
  transition: max-width 1s;
  cursor: pointer;
  &:hover {
    max-width: 100px;
  }
  h4 {
    font-size: 0.6em;
    color: #ff0;
  }
}
</style>