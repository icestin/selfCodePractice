//var isDilogTitle=null;
var draggingObj=null;
var diffX=0,diffY=0;

function down(e){
    if(e.target.className.indexOf('dialog-title')!=-1)
    {
        //isDilogTitle=true;
        draggingObj=e.target.offsetParent;
        console.log('对象事件',e);
        
        diffX=e.clientX-draggingObj.offsetLeft;
        diffY=e.clientY-draggingObj.offsetTop;
    }
}
function move(e){
    var diag=document.getElementById('dlgTest');
    if(draggingObj){
        diag.style.left=e.clientX-diffX+'px';
        diag.style.top=e.clientY-diffY+'px';
    }
}
function up(e){
    draggingObj=null;
}
document.addEventListener('mousedown',down);
document.addEventListener('mousemove',move);
document.addEventListener('mouseup',up);