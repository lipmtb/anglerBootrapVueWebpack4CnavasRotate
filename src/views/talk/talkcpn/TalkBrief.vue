<template>
  <div class="talk-brief col-sm-6 col-md-4">
    <div class="left-img" v-if="talkItemData.imgArr.length">
      <img :src="talkItemData.imgArr[0]" alt="钓鱼" />
    </div>
    <div class="right-textcontent">
      <h3 class="talk-title">{{ talkItemData.title }}</h3>
      <p class="talk-content">{{ talkItemData.content }}</p>

      <div class="footer-extra">
        <span class="author-name">作者:{{ talkItemData.anglerName }}</span>
        <transition-group name="collectrun" type="animation" tag="div" v-show="talkItemData.nologincollect!==401">
          <span
            class="glyphicon glyphicon-heart"
            v-show="!talkItemData.hasCollect"
            @click="collectTalk"
            key="notcollectedaaa"
          ></span>
          <span
            class="glyphicon glyphicon-heart collected"
            v-show="talkItemData.hasCollect"
            @click="cancelCollect"
            key="collectedbbb"
          ></span>
        </transition-group>
      </div>
    </div>
    <i
      class="glyphicon glyphicon-send"
      ref="flyicon"
      :style="flyStyle"
      v-show="talkItemData.hasCollect && talkItemData.showFly"
    ></i>
  </div>
</template>

<script>
import { collectTalk, cancelCollectTalk } from "network/talk/collectTalk.js";
import { mapMutations,mapState } from "vuex";
export default {
  name: "TalkBrief",
  data() {
    return {
      canCollect: true, //防止重复收藏取消收藏
      x: 0,
      y: 0,
      start: 0, //控制requestAnimationFrame
      t: 4, //移动总时间,假的
      detat: 0.1, //每次间隔的时间
      frequentnum: 64,
    };
  },
  props: {
    talkItemData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    flyStyle() {
      return {
        //   left:this.x+"px"
        transform: `translate(${this.x}px,${this.y}px)`,
      };
    },
    ...mapState("users",["userInfo"])
  },
  methods: {
    ...mapMutations("talkCollect", ["addNewCollectTalk", "removeCollectTalk"]),
    collectTalk() {
      if (!this.canCollect||this.talkItemData.hasCollect) {
        return;
      }
      this.canCollect = false;

      collectTalk(this.talkItemData._id)
        .then((res) => {
          // console.log("收藏结果", res);
          if (res.errCode === 0) {
            this.talkItemData.hasCollect = res.collectId;
            this.talkItemData.showFly = true;
            setTimeout(() => {
              this.runFly();
            });
            this.addNewCollectTalk(this.talkItemData);
          }
        })
        .finally(() => {
          this.canCollect = true;
        });
    },
    cancelCollect() {
      if (!this.canCollect||!this.talkItemData.hasCollect) {
        return;
      }
      this.canCollect = false;
      cancelCollectTalk(this.talkItemData.hasCollect).then((res) => {
        // console.log("取消收藏结果", res);
        if (res.errCode === 0) {
          this.talkItemData.hasCollect = "";
          this.removeCollectTalk(this.talkItemData);
        }
      }).finally(() => {
          this.canCollect = true;
      });
    },
    runFly() {
      let targetIcon = this.$refs.flyicon;
      let fixbox = document.getElementById("collected-fixed");
      //  console.log(fixbox.getBoundingClientRect());
      //y位移
      let ymove =
        fixbox.getBoundingClientRect().y -
        targetIcon.getBoundingClientRect().y +
        fixbox.getBoundingClientRect().height / 2;
      //x位移
      let xmove =
        fixbox.getBoundingClientRect().x -
        targetIcon.getBoundingClientRect().x -
        6;
      if (xmove < 200) {
        this.t = 2;
        this.detat = 0.05;
        this.frequentnum = 32;
        ymove=ymove-60;
      }
      // console.log(xmove, ymove);
      this.count = Math.floor(this.t / this.detat);//分多少次走完
      this.i = 0;
      this.xStep = xmove / this.count; //x每次移动的距离

      //y ，先根据水平速度计算出末y速度，加速度和垂直初速度
      let vYend = xmove / this.t; //垂直末速度

      if (ymove < 0 && xmove < 200) {
        vYend = -vYend;
      }
      this.yjia =
        (ymove - vYend * this.t) / (-4 * this.t + (1 / 2) * this.t * this.t); //加速度

      this.vY0 = vYend - this.yjia * this.t; //垂直初始速度

      requestAnimationFrame(this.reqframe);
    },
    reqframe(stamp) {
      if (!this.start) {
        this.start = stamp;
      }

      if (stamp - this.start > this.frequentnum) {
        this.start = stamp;
        this.i++; //一个detat
        this.x += this.xStep; //移动x
        this.y =
          this.vY0 * this.i * this.detat +
          (1 / 2) * this.yjia * (this.i * this.detat) * (this.i * this.detat);
        // console.log(this.y);
      }

      if (this.i < this.count) {
        requestAnimationFrame(this.reqframe);
      }
      if (this.i >= this.count) {
        this.resetFly();
      }
    },
    resetFly() {
      this.x = 0;
      this.y = 0;
      this.t = 4;
      this.detat = 0.1;
      this.start = 0;
      this.frequentnum = 64;
      this.talkItemData.showFly = false;
    },
  },
};
</script>

<style scoped lang="less">
.glyphicon-send {
  position: absolute;
  width: 12px;
  height: 12px;
  z-index: 999;
  right: 10px;
  top: 193px;
  transition: all 200ms;
}
// .glyphicon-heart {
//   transition: all 4s;
// }
// .collectrun-enter,
// .collectrun-leave-to {
//   opacity: 0;
//   transform: scale(0);
// }

// .collectrun-enter-to,
// .collectrun-leave {
//   opacity: 1;
//   transform: scale(1);
// }

.collectrun-leave-active {
  animation: leaving 1s ease-in 0s 1 normal forwards;
}
.collectrun-enter-active {
  animation: leaving 1s ease-in 0s 1 reverse forwards;
}

@keyframes leaving {
  0% {
    transform: scale(1);
  }

  30% {
    transform: scale(1.4);
  }

  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.2);
  }
}

.glyphicon-heart.collected {
  color: tomato;
}

.talk-brief {
  position: relative;
  height: 260px;
  transition:width 1s;
  @media (min-width: 768px) and (max-width: 992px) {
    height: 220px;
  }
  @media (min-width: 992px) {
    height: 200px;
  }
  box-shadow: 1px 1px 6px 4px #eee;
}
.left-img {
  float: left;
  width: 60%;
  height: 100%;
  img {
    width: 100%;
    height: 100%;
  }
}

.right-textcontent {
  overflow: hidden;
  text-align: center;
  padding-left: 0.2em;
  height: 100%;
  position: relative;
  p.talk-content {
    text-indent: 1em;
    word-break: break-all;
    text-align-last: left;
  }
  div.footer-extra {
    position: absolute;
    right: 0.2em;
    bottom: 0.6em;
    span.author-name {
      color: #ddd;
      font-size: 0.6em;
    }
    div {
      float: right;
    }
  }
}
</style>
