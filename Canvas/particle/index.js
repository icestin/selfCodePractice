var c1 = document.getElementById('c1');
var w = c1.width = window.innerWidth,
    h = c1.height = window.innerHeight;
console.log(w,h);
var ctx = c1.getContext('2d');

// 粒子效果集合
var particles = [];
for (var i = 0; i < 1; i++) { //生成光点对象的个数
    particles.push(new create_particle());
}

//粒子效果函数
function create_particle() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;

    // 给粒子效果添加速度
    this.vx = Math.random() * 20 - 10;
    this.vy = Math.random() * 20 - 10;

    // 随机颜色

    var r = Math.random() * 255 >> 0; // >>取整
    var g = Math.random() * 255 >> 0;
    var b = Math.random() * 255 >> 0;  
    this.color = 'rgba(' + r + ',' + g + ',' + b +', 0.5)';
    
    //
    this.radius = Math.random() * 20 + 20;

}

var x = 100; var y = 100;

function draw() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // 实现光点的残影效果
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for(var t = 0; t < particles.length;  t++) {
        var p = particles[t];

        ctx.beginPath();

        var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.4, 'white');
        gradient.addColorStop(0.4, p.color);
        gradient.addColorStop(1, 'black');

        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.radius, Math.PI * 2, false);
        ctx.fill();
        // 使用速度
        p.x += p.vx;
        p.y += p.vy;
        // 防止球溢出canvas
        if(p.x < -50) p.x = w + 50;
        if(p.y < -50) p.y = h + 50;
        if(p.x > w + 50) p.x = - 50;
        if(p.y > h + 50) p.y = - 50;
    }
    window.requestAnimationFrame(draw);
}
setTimeout(function(){
  draw();
    // setInterval(draw,1000/66);
},1000);

