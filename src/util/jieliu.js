export default function jieliu(fn,delay,ctx){
    let canRun=true;
    return (e)=>{
        if(canRun){
            fn.call(ctx,e);
            setTimeout(()=>{
                canRun=true;
            },delay) 
        }
        canRun=false;
    }
}