/**
 *  ** 发射器
 */
var rectangleEmitter = {
    /***
     * canvas 对象
     */
    canvas: null,
    /**
     * canvas 上下文对象
     */
    context: null,

    /***
     * Object The blast zone for particles.
     * 物体爆炸区域
     */
    blastZone: {
        x: 0,
        y: 0,
        width: 800,
        height: 600
    },

    /**
     * 要创建的粒子效果
     */
    particle: null,

    /**
     * 粒子效果集合
     */
    particles: [],

    /***
     * 粒子数量
     */
    maxParticles: 700,
    /**
	 * The intervalID for the FPS interval
	 */
    fpsId: null,

    tickId: null,

    setCanvas: function(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    },
    setBlastZone: function(x, y, width, height) {
        this.blastZone = {
            'x': x,
            'y': y,
            'width': width,
            'height': height
        };
    },

    /**
     * 开始出发
     */
    start: function(fps) {
      var rate = fps || 30;
      this.fpsId = setInterval(this.frameUpdate, 1000 / rate, this); 
      this.tickId = setInterval(this.tick, 1000, this); //
    },

    /**
     * 暂停
     */
    pause: function() {
        clearInterval(this.fpsId);
        // clearInterval(this.intervalId);
    },

    /***
     * 停止
     */
    stop: function() {
        clearInterval(this.fpsId);
        this.clear();
    },

    /***
     * 清除粒子效果
     */
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    /***
     * s添加粒子效果到屏幕上
     */
    addParticle: function(particle) {

        if(this.particles.length < this.maxParticles) {
            var p = Object.create(particle);
            p.randomize(this.blastZone);
            this.particles.push(p);
        }
    },
    /**
     * 绘制整个canvas
     */
    draw: function() {
        this.clear();

        var i = this.particles.length;
        while( i -- ) {
            this.particles[i].draw(this.context);
        }
    },

    update: function() {
        var p;
        var i = this.particles.length;
        while( i-- ){
            p = this.particles[i];
            p.update();
            // 移除失效的粒子效果 当超过边界时
            if (p.y > this.canvas.height) {
                this.particles.splice(i, 1);
            }
        }
    },

    /**
     * 让所有粒子运行
     */
    applyActions: function() {
        var i = this.particles.lenght;
        while( i-- ) {
            this.particles[i].action();
        }
    },
    /**
	 * Run the action ahead the number of seconds (so the screen isn't blank on init).
	 *向前运行秒数（因此屏幕在init上不是空白）。
	 * @param seconds int  The number of seconds to run ahead.
	 */
    runAhead: function(seconds) {
        for ( i = 0; i < seconds; i += 1) {
            this.frameUpdate(this);
        }
    },
    /**
     * The FPS 更新
     */
    frameUpdate: function(self) {
        self.addParticle(self.particle);
        
        self.update();
        self.draw();

    },

    tick: function(self) {
        self.applyActions();
    }

};