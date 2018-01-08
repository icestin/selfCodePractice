//摘录自MDN示例
var gl;//webgl的全局变量
function start(){
    document.getElementById('glcanvas');
    var canvas=document.getElementById('glcanvas');
    //初始化WebGL上下文
    gl=initWebGL(canvas);
    //只有在WebGL可用的时候才继续
    if(gl){
        //设置清除颜色为黑色，不透明
        gl.clearColor(0.0,0.0,0.0,1.0);
        //开启‘深度测试’，Z-缓存
        gl.enable(gl.DEPTH_TEST);
        //设置深度测试，近的物体遮挡远的物体
        gl.depthFunc(gl.LEQUAL);
        //清除颜色和深度缓存
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    }
}

/**
 * 创建WebGL上下文
 * @param {} canvas 
 */
function initWebGL(canvas){
    //一个新的 WebGL 上下文，
    //会在它被获得时设置它自己的视窗分辨率为 canvas 元素的高度和宽度，而不是根据其 CSS 样式。
   //创建全局变量 gl.viewport(0, 0, canvas.width, canvas.height);来改变WebGL的视窗分辨率
  // window.gl=null;
   try{
      //尝试获取标准上下文，如果事变回退到实验性上下文
      gl=canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
   }
   catch(e){}
   //如果没有GL上下文，马上放弃
   if(!gl){
       alert('WebGL初始化失败，可能是因为您的浏览器不支持。');
       gl=null;
   }
   return gl;
}

/**
 * 初始化着色器
 */
function initShaders(){
    var fragmentShader=getShader(gl,'shader-fs'); //片段着色器从 ID为 ‘shader-fs’中的script标签元素加载
    var vertexShader=getShader(gl,'shader-vs'); //顶点着色器

    //创建着色器
    shaderProgram=gl.createProgram();
    gl.attachShader(shaderProgram,vertexShader);
    gl.attachShader(shaderProgram,fragmentShader);
    gl.linkProgram(shaderProgram);
    //如果创建着色器失败
    if(!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS)){
        alert('未能初始化着色器程序');
    }
    gl.useProgram(shaderProgram);

    vertexPositionAttribute=gl.getAttribLocation(shaderProgram,'aVertexPosition');
    gl.enableVertexAttribArray(vertexPositionAttribute);

}

function getShader(gl,id){
    var shaderScript,theSource,currentChild,shader;
    shaderScript=document.getElementById(id);
    if(!shaderScript){
        return null;
    }
    theSource='';
    currentChild=shaderScript.firstChild;
    while(currentChild){
        if(currentChild.nodeType==currentChild.TEXT_NODE){
            theSource+=currentChild.textContent;
        }
        currentChild=currentChild.nextSibling;
    }
    //片段着色器 
    // WebGL中的多边形中的每一个像素都叫做一个片段 
    // 片段着色器的工作就是建立每个像素的色彩    
    //顶点着色器定义了每个定点的未知和形状
    if(shaderScript.type=="x-shader/x-fragment"){
        shader=gl.createShader(gl.FRAGMENT_SHADER);
    }else if (shaderScript.type=='x-shader/x-vertex'){        
        shader=gl.createShader(gl.VERTEX_SHADER);
    } else {
        //未知的 着色器类型
        return null;
    }

    gl.shaderSource(shader,theSource);
    //编译着色器程序
    gl.compileShader(shader);

    //查看是否编译成功
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
        alert('编译着色器出现问题'+gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;

}

var horizAspect=480.0/640.0;
function initBuffers(){
    squareVerticesBuffer=gl.createBuffer(); //得到了缓冲对象并存储顶点缓冲器
    gl.bindBuffer(gl.ARRAY_BUFFER,squareVerticesBuffer);//绑定上下文
    var vertices=[
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0,-1.0,0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    
}

/**
 * 绘制场景
 */
function drawScene(){
   gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);//用背景色擦除上线问
   //建立相机透视矩阵 设置45度视图角度 宽高比设置为640/480（画布尺寸）。指定相机距离在 0.1 到100单位长度范围内，物体可见
   //
   perspectiveMatrix=makePerspective(45,640.0/480,0.1,100.0);
   loadIdentity(); //接着加载特定位置
   //并把正方形放在距离摄像机6个单位的的位置。
   mvTranslate([-0.0,0.0,-6.0]);
   gl.bindBuffer(gl.ARRAY_BUFFER,squareVerticesBuffer);
   gl.vertexAttribPointer(vertexPositionAttribute,3,gl.FLOAT,false,0,0);
   setMatrixUniforms();
   gl.drawArrays(gl.TRIANGLE_STRIP,0,4);

}
function loadIdentity(){
    mvMatrix=Matrix.I(4);
}
function multMatrix(m){
    mvMatrix=mvMatrix.x(m);
}
function mvTranslate(v) {
    multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
  }
  
  function setMatrixUniforms() {
    var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
  
    var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
  }
  start();
  drawScene();