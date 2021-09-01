<template>
  <div class="jjcc-loader-circle" v-show="isRun">
    <canvas
      id="loading-canvas"
      ref="jjcccanvas"
      width="120"
      height="120"
    ></canvas>
  </div>
</template>

<script>
export default {
  name: "CanvasLoading01",
  data() {
    return {
      circlecount: 6,
      isRun: false,
      ctx: null,
      canvasbox: null,
      curReg: 0,
      startTimer: 0,
    };
  },
  mounted() {
    //全局事件总线，所有组件都可控制此组件
    this.$vmbox.$on("showLoading", this.showLoading);
    this.$vmbox.$on("hideLoading", this.hideLoding);
    this.canvasbox = this.$refs.jjcccanvas;
    this.ctx = this.canvasbox.getContext("2d");
  },
  methods: {
    showLoading() {
      this.isRun = true;
      this.ctx.clearRect(0, 0, 120, 120);
      this.createGraph();
      requestAnimationFrame(this.reqframe);
    },
    hideLoding() {
      this.isRun = false;
    },
    reqframe(stamp) {
      if (!this.startTimer) {
        this.startTimer = stamp;
      }

      if (stamp - this.startTimer > 64) {
        this.startTimer = stamp;
        this.curReg += 4;
        this.ctx.clearRect(0, 0, 120, 120);
        this.createGraph();
      }
      if (this.isRun) {
        requestAnimationFrame(this.reqframe);
      }
    },
    createGraph() {
      //绘制轮廓
      this.ctx.save();
      this.ctx.translate(10, 10);
      this.ctx.beginPath();
      this.ctx.arc(50, 50, 50, 0, Math.PI * 2, false);
      this.ctx.stroke();

      //绘制文字
      this.ctx.save();
      this.ctx.fillStyle="orange";
      this.ctx.shadowColor = "#333";
      this.ctx.shadowOffsetX = 1;
      this.ctx.shadowOffsetY = 1;
      this.ctx.shadowBlur = 10;
      this.ctx.textBaseline = "middle";
      this.ctx.textAlign = "center";
      this.ctx.font = "20px bold 微软雅黑";
      this.ctx.fillText("Loading", 50, 50);
      this.ctx.restore();

      //绘制中间主要内容
      this.fillContent();
      this.ctx.restore();
    },
    fillContent() {
      //绘制左右双眼
      this.ctx.beginPath();
      this.ctx.arc(25, 30, 14, 0, Math.PI * 2, false);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(75, 30, 14, 0, Math.PI * 2, false);
      this.ctx.stroke();

      //绘制眼珠
      this.ctx.save();
      this.ctx.translate(25, 30);
      this.ctx.rotate((this.curReg * Math.PI) / 180);
      this.ctx.fillStyle = "#000";
      this.ctx.beginPath();
      this.ctx.arc(-3.5, -3.5, 4, 0, Math.PI * 2, false);
      this.ctx.fill();
      this.ctx.restore();

      this.ctx.save();
      this.ctx.translate(75, 30);
      this.ctx.rotate((this.curReg * Math.PI) / 180);
      this.ctx.fillStyle = "#000";
      this.ctx.beginPath();
      this.ctx.arc(-3.5, -3.5, 4, 0, Math.PI * 2, false);
      this.ctx.fill();
      this.ctx.restore();

      //绘制外围
      this.ctx.save();
      this.ctx.fillStyle = "#aaa";
      this.ctx.translate(50, 50);
      for (let i = 0; i < this.circlecount; i++) {
        this.ctx.save();
        this.ctx.rotate(((this.curReg + i * 8) * Math.PI) / 180);
        this.ctx.beginPath();
        this.ctx.arc(
          -50 / Math.sqrt(2),
          -50 / Math.sqrt(2),
          4,
          0,
          Math.PI * 2,
          false
        );

        this.ctx.fill();
        this.ctx.restore();
      }

      this.ctx.restore();

      //绘制嘴巴
      this.ctx.fillStyle = "#f00";
      this.ctx.beginPath();
      this.ctx.moveTo(34, 62);
      this.ctx.arcTo(38, 70, 56, 72, 22);
      this.ctx.fill();

      this.ctx.fillStyle = "#f00";
      this.ctx.beginPath();
      this.ctx.moveTo(66, 62);
      this.ctx.arcTo(62, 70, 40, 72, 22);
      this.ctx.fill();
    },
  },
};
</script>

<style scoped>
div.jjcc-loader-circle {
  position: fixed;
  width: 140px;
  height: 140px;
  padding: 10px;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
</style>