import axios from "axios";
import serverUrl from "../server";

let AUTH_TOKEN=localStorage.getItem("jjccToken");

if(AUTH_TOKEN){
//请求头带上token
    axios.defaults.headers.common['Authorization'] = "Bearer "+AUTH_TOKEN;

}
let isLoginins=axios.create({
    baseURL:serverUrl,
    timeout:5000
});
// isLoginins.interceptors.request.use((req)=>{
//     req.headers["Authorization"]= "Bearer "+localStorage.getItem("jjccToken")
//     return req;
// })  
isLoginins.interceptors.response.use((res)=>{
 
    
    return res.data;
})

//是否登录
export function isLogin(){
    return isLoginins.get("/isLogin");
}