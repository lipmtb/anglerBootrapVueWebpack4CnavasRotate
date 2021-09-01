import axios from "axios";
import serverUrl from "../server";
import {hasCollectedTalk} from "./collectTalk";

let talkIns=axios.create({
    timeout:5000,
    baseURL:serverUrl
});

talkIns.interceptors.response.use((res)=>{
    let datalists=res.data;
    
    for(let talkitem of datalists){
        if(talkitem.imgArr.length>0){
            for(let i=0;i<talkitem.imgArr.length;i++){
                talkitem.imgArr[i]=serverUrl+"/images/talk/"+talkitem.imgArr[i];
            }
        }
        let talkId=talkitem._id;
        talkitem.hasCollect=0;//默认未收藏
        talkitem.showFly=false;//不显示飞机，默认
        talkitem.nologincollect="";
        hasCollectedTalk(talkId).then((res)=>{
            // console.log("是否收藏"+talkId,res);
            if(res.errCode==0){

                talkitem.hasCollect=res.collectId;
            }else{
                talkitem.nologincollect=res.errCode;
                // console.log("是否收藏error");
            }
        })
    }
    return datalists;
})
//获取热门帖子
export function getNewTalk(skip,limit){
    return talkIns.get("/talk/newTalk",{
        params:{
            skip,
            limit
        }
    })
}