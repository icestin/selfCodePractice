
console.log('client to request');
(function client() {
    console.log('start to send ');
    var url = 'serverData.json';
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function read(e) {
        console.log('on ready state change:',e);
        if(ajax.readyState == 4) {
            if(ajax.status == 200) {
                console.log("ajax 对象",ajax);
                console.log(ajax.response,ajax.responseText, ajax.responseType);
            }
        }
    }
    ajax.open('GET',url,true);
    ajax.send(null);
})()