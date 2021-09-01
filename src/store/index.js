import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

let userName=localStorage.getItem("userName");
let userId=localStorage.getItem("userId");
console.log("store vuex localstore  get userinfo",userName,userId);
//用户模块的vuex
let users = {
    namespaced:true,
    state: {
        userInfo: {
            userName: userName,
            userId: userId,
            userAvatar: {}
        }

    },
    getters: {
        userInfo(state) {
            return state.userInfo;
        }
    },
    mutations:{
        loginInfoAdd(state,payload){
            state.userInfo.userName=payload.userName;
            state.userInfo.userId=payload.userId;
        },
        clearLoginInfo(state){
       
            state.userInfo.userId=null;
        }
    }
}


let talkCollect={
    namespaced:true,
    state:{
        collectTalkLists:[]
    },
    mutations:{
        addNewCollectTalk(state,newTalk){
          
            state.collectTalkLists.unshift(newTalk);
        },
        removeCollectTalk(state,oldTalk){
                let talkId=oldTalk._id;
                state.collectTalkLists=state.collectTalkLists.filter((item)=>{
                    return item._id!==talkId;
                })
        }
    }
}
export default new Vuex.Store({
    modules: {
        users,
        talkCollect
    }
})