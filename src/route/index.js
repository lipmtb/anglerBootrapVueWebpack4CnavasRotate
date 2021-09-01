import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router=new VueRouter({
    mode:"history",
    routes:[{
        path:"",
        redirect:"/talk"
    },{
        path:"/talk",
        component:()=>import("views/talk/talkpage.vue"),
        meta:{
            title:"钓友圈"
        }
    },{
        path:"/tip",
        component:()=>import("views/tip/tippage.vue"),
        meta:{
            title:"技巧"
        }
    },{
        path:"/profile",
        component:()=>import("views/profile/profile.vue"),
        meta:{
            title:"我的"
        },
        children:[{
                path:"",
                redirect:"myhist"
        },{
            path:"mycollect",
            component:()=>import("views/profile/collect/collect.vue"),
            meta:{
                title:"我的收藏"
            }
        },{
            path:"myhist",
            component:()=>import("views/profile/hist/hist.vue"),
            meta:{
                title:"浏览历史"
            }
        },{
            path:"mymsg",
            component:()=>import("views/profile/msg/msg.vue"),
            meta:{
                title:"我的消息"
            }
        }]
    }]
})

export default router;