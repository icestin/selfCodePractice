(async () => {
    async function forPro( ) {
        
        return new Promise((resolve, reject) => {
            for(let i = 0; i < 10; i++) {
               if(i === 5) {
                   reject('err');
               }
               console.log('次数', i);
            }
            resolve('finesh')
        })
    }

    try {
        let res = await forPro ();
    } catch (error) {
        console.error(error);
    }
    
    


})()