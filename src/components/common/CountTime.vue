<template>
    <button class="counter-btn">
        {{currentTime}}s
    </button>
</template>

<script>
// 倒计时
export default {
    name:"CountTimer",
    data(){
        return {
            currentTime:60
        }
    },
    mounted() {
        this.timer=setInterval(()=>{
                this.currentTime--;
                if(this.currentTime<50){
                    this.$emit("endCounter");
                }
        },996)
    },
    beforeDestroy() {
        // console.log("destroyed button");
            clearInterval(this.timer);
    }
}
</script>

<style scoped>
    button.counter-btn{
        background-color: #dddddd;
    width: 80%;
    padding: 0.4em 2em;
    border: 0;
    border-radius: 4px;
}
</style>