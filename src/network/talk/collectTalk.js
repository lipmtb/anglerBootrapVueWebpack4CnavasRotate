import axios from "axios";
import serverUrl from "../server";
let talkIns=axios.create({
    timeout:5000,
    baseURL:serverUrl
});

talkIns.interceptors.response.use((res)=>{
    
    return res.data;
})

//是否收藏过帖子
export function hasCollectedTalk(talkId){
    return talkIns.get("/talk/hasCollectTalk",{
        params:{
           talkId:talkId
        }
    })
}

//添加收藏
export function collectTalk(talkId){
    return talkIns.get("/talk/collectTalk",{
        params:{
           talkId:talkId
        }
    })
}

//取消收藏
export function cancelCollectTalk(collectId){
    return talkIns.get("/talk/cancelCollectTalk",{
        params:{
            collectId:collectId
        }
    })
}