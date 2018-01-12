console.log('执行了');

window.onload = function () {
    getData();
}
function getData () {
    var myImage = document.querySelector('img');
    fetch('http://127.0.0.1:8080/fetch/2.jpg').then(function(response){
        return response.blob()
    }).then(function(myBlob){
        var objectUrl = URL.createObjectURL(myBlob);
        myImage.src = objectUrl;
    })
}