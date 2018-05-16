window.onload = function () {
    waterfall ('main', 'box');
    var mockData = [
        {
        src: '21.jpg'
    },
        {
        src: '22.jpg'
    },
        {
        src: '23.jpg'
    },
        {
        src: '24.jpg'
    },
        {
        src: '25.jpg'
    }
]
window.onscroll = function() {
    if(checkCanLoad()) {
        var oParent = document.getElementById('main');
           console.log('加载数据');
        for(var ii=0;ii < mockData.length; ii++) {
                var obx= document.createElement("div");
                obx.className='box';
                obx.innerHTML = " <div class='pic'>"
                +"<img src='images/"+mockData[ii].src+"' /> </div>";
                oParent.appendChild(obx);
            }
            waterfall('main', 'box');
        }
    }

}
function checkCanLoad() {
    var oParent = document.getElementById('main');
    var oBox = oParent.querySelectorAll('.box');
    var lastBoxH = oBox[oBox.length -1].scrollHeight + Math.floor(oBox[oBox.length -1].clientHeight/2) ;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    var viewHeitht = document.body.clientHeight || document.documentElement.clientHeight;
    // console.log("scrollTop", scrollTop,'viewheight', viewHeitht);
    return lastBoxH < scrollTop + viewHeitht;
}

function waterfall(parent, box) {
    var oParent = document.getElementById(parent);
    var oBox = oParent.querySelectorAll('.box');
    console.log("o", oBox);
    // 获取列数  页面宽度/box的宽度
    var oBoxW = oBox[0].offsetWidth;
    var cols =Math.floor(document.documentElement.clientWidth / oBoxW); 
    console.log('盒宽度',oBoxW, '\n 列数', cols);
    oParent.style.width = oBoxW * cols + 'px';
    oParent.style.margin = '0 auto';

    var hArr = [];
    for (var i=0; i < oBox.length; i++) {
        if (i < cols) {
            hArr.push(oBox[i].clientHeight);
        } else {
            var min = Math.min.apply(null, hArr);
            var minIndex = getMinIndex(hArr, min);
            oBox[i].style.position = 'absolute';
            oBox[i].style.top = min + 'px';
            oBox[i].style.left = oBoxW *  minIndex + 'px';
            hArr[minIndex] += oBox[i].clientHeight;
        }
    }
    console.log('harr', hArr);

}
function getMinIndex(Arr, value) {
    for (var v in Arr) {
        if(Arr[v] === value) {
            return v;
        }
    }
}