import axios from "axios";
import serverUrl from "../server";
let loginIns=axios.create({
    baseURL:serverUrl,
    timeout:5000,
    withCredentials:true
});
loginIns.interceptors.response.use((res)=>{
    let data=res.data;
    if(data.jjccToken){//登录成功保留token在本地存储
        localStorage.setItem("jjccToken",data.jjccToken);
    }
    if(data.userInfo){
        localStorage.setItem("userName",data.userInfo.userName);
        localStorage.setItem("userId",data.userInfo.userId);
    }
    
    return data;
})

//登录
export function login(userName,userPsw){
    return loginIns.post("/login",{
        username:userName,
        userpassword:userPsw
    })
}