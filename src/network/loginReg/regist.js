import axios from "axios";
import serverUrl from "../server";
let registIns=axios.create({
    baseURL:serverUrl,
    timeout:5000,
    withCredentials:true
});
registIns.interceptors.response.use((res)=>{
    let data=res.data;
    if(data.jjccToken){//注册成功保留token在本地存储
        localStorage.setItem("jjccToken",data.jjccToken);
    }
    if(data.userInfo){
        localStorage.setItem("userName",data.userInfo.userName);
        localStorage.setItem("userId",data.userInfo.userId);
    }
    
    return data;
})

//注册
export function registSendWithPhone(userName,userPsw,phoneNum){
    return registIns.post("/regist",{
        username:userName,
        userpassword:userPsw,
        phoneNum:phoneNum
    })
}