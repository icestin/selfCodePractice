// 全局变量

var fps = 30;
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 100 ;
canvas.height = window.innerHeight -10 ;

var ctx = canvas.getContext('2d');
var bgColor = 'rgb(40, 40, 40)';
/**
 * 就绪标志信息
 */
var ready;
/**
 * 敌军分值 可以用来作为游戏停止
 */
var enemyScore;
/**
 *  界面渲染，可以实现控制子弹速度
 */
var renderTimer = setInterval(render, 1/fps * 100);
/**
 * 难度因子控制器
 */
var difficultyTimer;
/**
 * 孵化器 敌军孵化器
 */
var spawnTimer; //结果 大量的 
/**
 * 每个敌人产生的时间间隔
 */
var spawntime;

/**
 *  游戏时间
 */
var gameTime;
/**
 * 难度等级
 */
var difficulty;
/**
 * 分值 
 */
var score;
/**
 *  最高分值
 */
var highScore = 0;
/**
 * 游戏结束标志
 */
var gameOver;
/**
 * 实体集合
 */
var entities = [];
var player;
var fader;

// 全局方法

// 重新设置程序到‘Ready’界面
function reset() {
    if (score > highScore) highScore = score;
    ready = true;
    enemyScore = 0;
    gameTime = 0;
    difficulty = 1;
    score = 0;
    spawntime = 1500;
    gameOver = false;
    fader = 0;
    entities = [];
    player = null;
    clearTimers();
    
}
// 清除所有 timers
function clearTimers() {
    clearInterval(difficultyTimer);
    clearInterval(spawnTimer);
}
// 初始化 timers
function initializeTimers() {
    difficultyTimer = setInterval(increaseDifficulty, 2000); /// 每个两秒提升一次难度等级
    spawnTimer = setInterval(spawnEnemy, spawntime);
}

function init() {
    ready = false;
    clearTimers();
    initializeTimers();
    
    // 孵化播放器
    player = new Player();
    player.position.set(canvas.width / 2, canvas.height -player.size);
    player.render();
    entities.push(player);
}

function updateEntities() {
    entities.forEach(function(e) {
      if (e.position.y > canvas.height + 20) {
          // 如果敌人顺利抵达下边界
          if (e.name == 'Enemy') {
              enemyScore += 1;
          }
          removeEntity(e);
      }
      e.update(1 / fps);
    });
}

/**
 *  绘制背景
 */
function drawBG() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScore() {
    ctx.fillStyle = '#ccff99';
    ctx.font = '24px sans-serif';
    ctx.fillText('Score: ' + score, 10, 24);
    ctx.font = '16px sans-serif';
    ctx.fillText('High Score: ' + highScore, 10, 48);
    var enemyScoreString = "";
    for (var i = 0; i < enemyScore; i++) {
        enemyScoreString +='X';
    }
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#ff666';
    ctx.fillText(enemyScoreString, canvas.width -75, 24);
    ctx.font = '16px sans-serif';
    ctx.fillText("Difficulty: " + difficulty, canvas.width / 2 - 50,24);
}
//绘制静态
/**
 * 绘制静态效果图
 * @param {*} alpha 
 */
function drawStatic(alpha) {
    var s = 15;
    for (var x = 0; x < canvas.width; x+=s) {
        for (var y = 0; y < canvas.width; y+=s) {
            var n = Math.floor(Math.random() * 160);
            ctx.fillStyle = "rgba(" + n + ',' + n + "," + n + "," + (Math.random() * alpha) + ')';
            ctx.fillRect(x, y, s, s);
        }
    }
}
// 绘制 ‘Ready’ 页面
function drawReadyScreen() {
    drawBG();
    drawScore();
    fader += .1 * 1/fps;
    ctx.fillStyle = 'rgba(255, 255, 255,'+ fader +')';
    ctx.font = '72px sans-serif';
    ctx.fillText('READY?', canvas.width/2 - 140,canvas.height / 2);
    drawScore();
}

//绘制所有的实体
/**
 * 绘制所有的实体对象
 */
function drawEntities() {
    entities.forEach(function(e){
        e.render();
    });
}

// 绘制‘Game over’ 屏幕
/**
 * 绘制 结束屏幕
 */
function drawGameOver() {
    ctx.fillStyle = "rgba(0, 0, 0," + fader + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStatic(fader / 2);
    drawScore();
    fader += 0.1 * 1 / fps;
    ctx.fillStyle = "rgba(255, 255, 255," + fader + ")";
    ctx.font = '72px sans-serif';
    ctx.fillText("GAME OVER", canvas.width / 2 - 220, canvas.height / 2 );
}

// 渲染场景
/**
 * 渲染场景
 */
function render() {
    drawBG();
    drawEntities();
    drawScore();
    if (gameOver) {drawGameOver(); return;}
    else if( ready ) {drawReadyScreen(); return;}
    updateEntities();
    gameTime += 1 / fps;
    if (enemyScore >= 3) {
        clearTimers();
        gameOver = true;
        fader = 0;
    }
}

// 返回画板上的鼠标信息
/**
 * 返回鼠标位置
 * @param {*} canvas 
 * @param {*} evt 
 */
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return new Vector2(evt.clientX- rect.left, evt.clientY -rect.top);
}

//点击事件
function canvasClick() {
   if (gameOver) {
       if (fader > 0.5) reset(); return;
   }
   if (ready) {
       init(); return;       
   }
   var bullet = new Bullet();
   bullet.position.set(player.position.x + player.size / 2 - bullet.size / 2, 
   player.position.y - player.size / 2 - bullet.size / 2);
   bullet.velocity.y = -30;
   entities.push(bullet);
   if (score > 0) score -= 1;
}

// 增加难度
/**
 *  定期增加难度等级
 */
function increaseDifficulty() {
    difficulty += 1;
    // 大于20毫秒 逐步减少时间
    if (spawntime > 20) spawntime -= 20;
    clearInterval(spawnTimer);
    spawnTimer = setInterval(spawnEnemy, spawntime);
}

// 改变颜色透明度
function setAlpha(color, alpha) {
    if (color.indexOf('a') == -1) {
        return color.replace(')', ',' + alpha + ')').replace('rgb',"rgba");
    }
}

// 实体消失
/**
 * 实体消失 
 * @param {*} entity 
 */
function death(entity) {
    //如果是敌人
    if(entity.name == "Enemy") {
        // 粒子效果
        var particleCount = Math.floor((Math.random() * 6) + 3);
        for (var i = 0; i < particleCount; i++) {
            var p = new Particle();
            p.color = entity.color;
            p.size = Math.floor((Math.random() * entity.size / 2 ) + 5); // 
            p.position.set(entity.position.x + entity.size / 2,
            entity.position.y + entity.size / 2);
            entities.push(p);
        }
        score += 25;
    }
    removeEntity(entity);
}
// 移除实体
/**
 * 移除实体
 * @param {*} entity 
 */
function removeEntity(entity) {
    var idx = entities.indexOf(entity);
    if (idx > -1) entities.splice(idx, 1);
}

// 检测两个实体是否压盖
/**
 * 碰撞检测两个实体对象 用A 去接触B
 */
function overlaps(entityA, entityB) {
    //实体立方形示意图
    //    --------  y1a
    //    |      |
    //    |  A   |
    //    -------- y2a 
    //    x1a    x2a
    var sa = entityA.size;
    var x1a = entityA.position.x;
    var x2a = entityA.position.x + sa;
    var y1a = entityA.position.y;
    var y2a = entityA.position.y + sa;
    //    --------  y1b
    //    |      |
    //    |   B  |
    //    -------- y2b
    //    x1b    x2b
    var sb = entityB.size;
    var x1b = entityB.position.x;
    var x2b = entityB.position.x + sb;
    var y1b = entityB.position.y;
    var y2b = entityB.position.y + sb;
    return (x1a < x2b && x2a > x1b && y1a < y2b && y2a > y1b)
}
// 产生新的“敌人”
/**
 * 产生敌人效果
 */
function spawnEnemy() {
    var  e = new Enemy();
    var px = Math.floor((Math.random() * canvas.width));
    var py = -e.size;
    var v = difficulty;
    var a = Math.floor((Math.random() * (v + 15)) + v);
    var f = Math.floor((Math.random() * (v + 15)) + v);
    e.position.set(px, py);
    var r = Math.random();
    // 
    if (r > .5) {
        straightDownMotion(e, v);
    }
    else if (r > .3) {
        sineMotion(e, a, f, v);
    }
    else if (r > 0.2) {
        triangularMotion(e, a, f, v);
    }else { // 其他极少部分采用锯齿形运动方式
        sawtoothMotion(e, a, f, v);
    }
    entities.push(e);
}

// 直线下降运动 
function straightDownMotion(entity, speed) {
    entity.update = function(deltatime) {
        this.velocity.x = 0; //不做横向运动
        this.velocity.y = speed;
        Entity.prototype.update.call(this, deltatime);
    }
}

// 正弦波运动
function sineMotion(entity, amplitude, freq, speed) {
    entity.update = function(deltatime) {
        this.velocity.x = amplitude * Math.cos(this.position.y / freq);
        this.velocity.y = speed;
        Entity.prototype.update.call(this, deltatime);
    }
}

//锯齿运动 
/**
 * 锯齿形运动
 * @param {*} entity 
 * @param {*} amplitude 
 * @param {*} freq 
 * @param {*} speed 
 */
function sawtoothMotion(entity, amplitude, freq, speed) {
     var modifier = 1;
     if (Math.random() > 0.5) modifier = -1;
     entity.update = function (deltatime) {
         this.velocity.x = modifier * ((-2 * amplitude) / Math.PI) *Math.atan(1 / Math.tan(this.position.y / freq));
         this.velocity.y = speed;
         Entity.prototype.update.call(this, deltatime);
     }
}
//amplitude 振幅
// 三角形运动
function triangularMotion(entity, amplitude,  freq, speed) {
    entity.update = function (deltatime) {
        this.velocity.x = ((2 * amplitude) / Math.PI) * Math.asin(Math.sin(this.position.y / freq));
        this.velocity.y = speed;
        Entity.prototype.update.call(this, deltatime);
    }
}

function randomColor(min, max) {
    var r = Math.floor((Math.random() * max ) + min);
    var g = Math.floor((Math.random() * max) + min );
    var b = Math.floor((Math.random() * max) + min);
    var col = 'rgb(' + r + ',' + g + ',' + b + ")";
    return col;
}

// 定义类

//Vector2 
/**
 * 
 * @param {*} x1  X值 
 * @param {*} y1  Y值
 */
var Vector2 = function(x1, y1) {
    this.x = x1;
    this.y = y1;
}
Vector2.prototype.set = function (a, b) {
    this.x = a;
    this.y = b;
}

// Entity (基类)
/**
 * 实体基类
 */
var Entity = function() {
    /***
     *  实体名称
     */
    this.name = "Entity";
    /***
     *  实体大小
     */
    this.size = 25;
    /**
     * 实体位置
     */
    this.position = new Vector2(0, 0);
    /***
     *  实体速度信息
     */
    this.velocity = new Vector2(0, 0);
    /***
     * 实体的颜色 默认白色
     */
    this.color = "#ffffff";
}
Entity.prototype.sayName = function() {
    console.log(this.name);
}
Entity.prototype.update = function(deltaTime) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    // 限定在界限内
    if (this.position.x - this.size < 0) {this.position.x = this.size;}
    if (this.position.x + this.size > canvas.width) {this.position.x = canvas.width - this.size;}
}
Entity.prototype.render = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
}

// 敌人 实体
/**
 *  敌人 实体
 */
var Enemy = function () {
    Entity.call(this);
    this.name = "Enemy";
    this.size = Math.floor((Math.random() * 50) + 20); // 大小
    this.color = randomColor(90, 150);
}
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.contructor = Entity;

// Player 实体
/**
 * 发射子弹的玩家
 */
var Player = function() {
    Entity.call(this);
    this.name = "Player";
    this.color = "red";
    // this.color = "#4746FF";
}
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Entity;
// 粒子特效 实体
/**
 *  子弹粒子特效  
 */
var Particle = function() {
    Entity.call(this);
    this.name = "Particle";
    this.size = 10;
    this.time = 0;
    /**
     * 特效出现的次数
     */
    this.maxTime = Math.floor((Math.random() * 10) + 3);  // 特效出现的次数
    /***
     * 特效的速度
     */
    this.velocity.x = Math.floor((Math.random() * 20) - 10); // 可正可负，大概50%概率，导致下向左或者是向右边运动
    this.velocity.y = Math.floor((Math.random() * 20) - 10);
}
Particle.prototype = Object.create(Entity.prototype);
Particle.prototype.constructor = Entity;
Particle.prototype.update = function(deltatime) {
    Entity.prototype.update.call(this, deltatime);
    this.time += deltatime;
    if (this.time >= this.maxTime) removeEntity(this); // 如果超过了特效的最大值，则移除该特效
}

// 子弹实体
var Bullet = function () {
    Entity.call(this);
    this.name = "Bullet";
    this.size = 10;
    this.time = 0;
    this.color = "rgba(200, 200, 200, 1)";
    this.particlesDelay = .5;
}

Bullet.prototype = Object.create(Entity.prototype);
Bullet.prototype.constructor = Entity;
Bullet.prototype.update = function (deltatime) {
    Entity.prototype.update.call(this, deltatime);

    // 碰撞 检测
    var me = this;
    entities.forEach(function(e){
        if (e!== me && e.name != 'Particle') {
            if (overlaps(me, e)) {
                death(e);
                removeEntity(me); //让子弹消失 如果不消失有可能会穿透两个
            }
        }
    });
    // 超出边界，移除范围
    if (this.position.y < 0) removeEntity(this);
    // 创建子弹飞行的粒子效果
    this.time += deltatime;
    if (this.time >= this.particlesDelay) {
        this.time = 0;
        var p = new Particle();
        p.size = Math.floor((Math.random() * 5) +2);
        p.color = setAlpha('rgb(125, 125, 125)',Math.random());
        p.color = setAlpha(randomColor(100, 255), Math.random()); // 彩虹粒子效果
        p.velocity.x /= 2;
        p.position.x = this.position.x + this.size / 2 - p.size / 2;
        p.position.y = this.position.y  - p.size / 2;
        entities.push(p);
    }
} 

document.addEventListener('DOMContentLoaded', reset());
canvas.addEventListener('click', canvasClick);

canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    if (player && !gameOver) player.position.x = mousePos.x;
},false);