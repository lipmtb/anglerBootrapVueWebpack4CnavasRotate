<template>
  <div class="tip-item col-sm-6 col-md-4 col-lg-3">
    <div class="tip-item-wrapper">
      <div class="tip-main clearfix">
        <div class="tipitem-left">
          <h4 class="tip-title">{{ tipData.title }}</h4>
          <p class="tip-conten">{{ tipData.content }}</p>
        </div>
        <div class="tipitem-right" v-if="tipData.imgArr.length">
          <img :src="tipData.imgArr[0]" alt="垂钓技巧" />
        </div>
      </div>

      <div class="tipitem-footer">
        <span>{{ tipData.publishTime | filterTimer }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TipItem",
  props: {
    tipData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="less" scoped>
div.tip-item-wrapper {
  border: 1px solid rgba(238, 238, 238, 0.774);
  margin-right:-10px;
  margin-bottom:10px;
  padding-left:10px;
}
div.tip-main {
  height: 160px;

  div.tipitem-left,
  div.tipitem-right {
    float: left;
    width: 40%;
  }
  div.tipitem-right {
    width: 60%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>