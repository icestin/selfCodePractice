//var isDilogTitle=null;
var draggingObj=null;
var diffX=0, diffY=0;

function down(e){
    if(e.target.className.indexOf('dialog-title')!=-1)
    {
        draggingObj = e.target.offsetParent;        
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


// 注销备份
// var down =  function down(e){
      
//     if(DIV.currentDragObj && e.target.classList.contains("dragZone"))
//       {   
//           DIV.tempMoveFlag = true ;
//           DIV.diffX = e.clientX - DIV.currentDragObj.offsetLeft;
//           DIV.diffY = e.clientY - DIV.currentDragObj.offsetTop;
//       }
//   }
//   var move = function move(e) {
//       var obj = DIV.currentDragObj, objStyle = obj.style ;
      
//       if(obj &&  DIV.tempMoveFlag){
//           objStyle.left = e.clientX - DIV.diffX + 'px';
//           objStyle.top = e.clientY - DIV.diffY + 'px';
//       }
//   }

//   var up = function up(e) {
//       DIV.tempMoveFlag = false;
//       DIV.diffY = 0;
//       DIV.diffX = 0;
//   }