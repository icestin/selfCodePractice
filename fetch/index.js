console.log('执行了');

window.onload = function () {
    getData1();
}
function getData0 () {
    var myImage = document.querySelector('img');
    fetch('http://127.0.0.1:8080/fetch/2.jpg').then(function(response){
        return response.blob()
    }).then(function(myBlob){
        var objectUrl = URL.createObjectURL(myBlob);
        myImage.src = objectUrl;
    })
}

function getData1 () {
    var myImage = document.querySelector('img');
    var myHeader = new Headers();
    var myInit = {
           method: 'GET',
           headers: myHeader,
           mode: 'cors',
           cache: 'default'
    };
    fetch('http://127.0.0.1:8080/fetch/2.jpg',myInit).then(function(response){
        return response.blob()
    }).then(function(myBlob){
        var objectUrl = URL.createObjectURL(myBlob);
        myImage.src = objectUrl;
    })
}