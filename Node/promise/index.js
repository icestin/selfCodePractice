(() => {
    console.log('a');
    console.log('ccc');
})()
// console.log('insert into file before this file 1');
// console.log('new branch content change at the same line 2');
// console.log('add new line to the file 3');
// console.log('new branch content change at the same line 4');
// console.log('add new line to the file 5');
// console.log('new branch content change at the same line 6' );
// console.log('add new line to the file 7');

async function getMes() {
    return new Promise((resolve, reject) => {
       return reject({
            code: '2001',
            msg: 'message'
        })
        console.log('after reject hou 再执行该语句');
    }).catch(re=>{
        console.log("catch…… ", re);
        // return 'req '; // 如果不添加 return 默认返回 undefined

    })
}

(async () => {
    try {
        let res =  await getMes();
        console.log('after await ',res);
    } catch (error) {
        console.log("after await catch");
        console.log(error)
    }
   
})();