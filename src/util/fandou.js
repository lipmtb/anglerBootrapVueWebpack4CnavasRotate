export default function (fn, delay, ctx) {
    let timer = null;
    return () => {
        if (timer) {

            clearTimeout(timer);
        }
        timer = setTimeout(fn.bind(ctx), delay);
    }
}