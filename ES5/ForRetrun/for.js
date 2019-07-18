/**
 *  for 循环中包含return语句
 */

function con(count) {
    console.log(count);
}

(()=>{
    for(let i = 0; i < 10; i++) {
        return con(i);
    }
})()