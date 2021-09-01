<template>
  <div class="tip-page">
    <div class="type-lists" :class="{ fixtype: isFixType }">
      <span
        class="typespantext"
        v-for="(tipClassItem, idx) of tipAllLists"
        @click="toType(idx)"
        :key="tipClassItem._id"
        :class="{ activeType: idx === curType }"
        >{{ tipClassItem.className }}</span
      >
    </div>
    <div class="tip-lists container-fluid" ref="tiplistsref">
      <div
        v-for="tipClassItem of tipAllLists"
        :key="tipClassItem._id"
        class="tip-class-item"
      >
        <h2 class="type-text">{{ tipClassItem.className }}</h2>
        <div class="tip-type-lists clearfix">
          <tip-item
            v-for="tipitem of tipClassItem.tipLists"
            :tipData="tipitem"
            :key="tipitem._id"
          ></tip-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllTip } from "network/tip/tip.js";
import TipItem from "./TipItem";
export default {
  name: "tippage",
  components: {
    TipItem,
  },
  data() {
    return {
      tipAllLists: [],
      compareLists: [],
      isFixType: false,
      curType: 0,
    };
  },
  mounted() {
    this.getAllTipFn();
    document.defaultView.addEventListener(
      "scroll",
      this.onScrollTipLists,
      false
    );
  },
  beforeDestroy() {
    document.defaultView.removeEventListener(
      "scroll",
      this.onScrollTipLists,
      false
    );
  },
  methods: {
    getAllTipFn() {
      getAllTip().then((lists) => {
        console.log("获取到所有tip", lists);
        this.tipAllLists = lists;
        this.$nextTick(() => {
          let classItemArr = document.querySelectorAll(".tip-class-item");
          let tiplisttop=document.querySelector(".tip-lists").offsetTop;
         this.tipAllLists.reduce((prev,__,idx) => {
            let offsetHeight = classItemArr[idx].offsetHeight;
            this.compareLists.push(prev);
            return prev+offsetHeight+20;
          },tiplisttop);
          // console.log(this.compareLists);
        });
      });
    },
    onScrollTipLists() {
      let tiplists = this.$refs.tiplistsref;
      let bounding = tiplists.getBoundingClientRect();
      let curScrollTop=document.defaultView.scrollY;
      
      let idx=this.compareLists.findIndex((item,idx,arr)=>{
        if(curScrollTop<arr[0]||idx===arr.length-1){
          return true;
        }
        return curScrollTop<arr[idx+1]-108-68-40;
      })
      // console.log("scrollTop",curScrollTop,idx);
      this.curType=idx;
      if (bounding.y < 4) {
        this.isFixType = true;
      } else {
        this.isFixType = false;
      }
    },
    toType(idx) {
      this.curType = idx;
      let that=this;
      document.defaultView.scrollTo({
          left:0,
          top:that.compareLists[idx]-108-68,
            behavior: 'smooth'
      })
    },
  },
};
</script>

<style scoped lang="less">
.tip-class-item {
  box-shadow: 1px 0.4px 20px 2px rgba(34, 34, 34, 0.658);
  padding-right: 10px;
}

h2.type-text {
  padding-left: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  margin-right: -10px;
  background-image: -webkit-linear-gradient(
    left,
    #faf74d,
    rgb(0, 255, 0),
    rgb(0, 123, 0)
  );
}

div.type-lists {
  display: flex;
  justify-content: space-around;

  @media screen and (min-width: 768px) {
    display: none;
  }
  span.typespantext {
    padding: 4px 6px;
    background-color: rgb(255, 222, 180);
    flex: 1;
    margin: 0 4px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: rgb(250, 174, 74);
    }
  }
  span.typespantext.activeType {
    color: #fff;
    background-color: rgb(250, 174, 74);
  }
}

div.type-lists.fixtype {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px 0;
  background-color: #fff;
  z-index: 666;
  border-radius: 6px;
  // margin:auto;
}
</style>