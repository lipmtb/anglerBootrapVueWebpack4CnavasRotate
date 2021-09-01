import axios from "axios";
import serverUrl from "../server";


let tipIns = axios.create({
    timeout: 5000,
    baseURL: serverUrl
});

tipIns.interceptors.response.use((res) => {
    let datalists = res.data;
    if (datalists.length) {
        for (let tipClassItem of datalists) {
            for (let tipitem of tipClassItem.tipLists) {
                if (tipitem.imgArr.length > 0) {
                    for (let i = 0; i < tipitem.imgArr.length; i++) {
                        tipitem.imgArr[i] = serverUrl + "/images/tip/" + tipitem.imgArr[i];
                    }
                }
            }
        }
    }

    return datalists;
})
//获取所有tip
export function getAllTip(skip, limit) {
    return tipIns.get("/tip/tipClassSomeEssays");
}