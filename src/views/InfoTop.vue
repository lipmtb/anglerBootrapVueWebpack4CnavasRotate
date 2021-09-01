<template>
    <div class="container-fluid info-wrapper">
        <div class="bread-line" v-if="$route.matched">
            <span>垂钓&nbsp;&gt;</span>&nbsp;
            <span v-for="(routeitem,idx) in $route.matched" :key="routeitem.path">{{routeitem.meta.title}}{{idx===$route.matched.length-1?"":"&nbsp;&gt;&nbsp;"}}</span>
        </div>
    </div>  
</template>

<script>
export default {
    name:"infotop",
 
}
</script>

<style scoped lang="less">
    .info-wrapper{
        position:relative;
        height:200px;
        background:url("~assets/imgs/diaoyu.jpg") no-repeat;
        background-size: 100% 100%;
        div.bread-line{
            position:absolute;
            left:1em;
            top:2em;
        }
    }
</style>