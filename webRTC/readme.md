# WebRTC
getUserMedia()与WebRTC相关，提供了访问用户本地相机/麦克风流媒体的手段。

* 功能检测  查看本地是否存在navigator.getUserMedia
```
  function hasGetUserMedia() {
      return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
      navigator.msGetUserMedia);
  }

```
* 获取输入设备的访问权限
getUserMedia()的第一个参数用于指定要访问的媒体类型。 请求网络摄像头 "video" ;
要同时使用麦克风和相机 则传入 "video, audio"
```
 <video autoplay> </video>
 <script> 
 var onFailSoHard = function(e) {
     console.log('Rejected !', e);
 }
 navigator.getUserMedia({audio: true, video: true}, function(localMediaStream) {
     var video = document.querySelector('video');
     video.src = window.URL.createObjectURL(localMediaStream);
     video.onloadedmetadata = function(e) {
         console.log('loademetadata e',e);
     }
 }, onFailSoHard);
 </script>
```
## Rejected ! DOMException: Only secure origins are allowed  需要搭建https服务器来进行webRTC的本地测试

 ### HTTPS搭建过程记录 SSL
[https://blog.csdn.net/zhaotengfei36520/article/details/41962077]  win64使用openssl生成ca证书

* http-server 启动https服务器
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
 http-server -S -C cert.pem -o

 ### 截取屏幕截图
  <canvas> API的ctx.drawImage(video, 0, 0)可以将<video>帧绘制到<canvas>上
