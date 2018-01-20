var snow = {
    /**
     * float 当前 x 位置
     */
    x: 0,

    /***
     * float 当前 y 位置
     */
    y: 0,

    alpha: 0.5,

    radius: 3,
    
    /***
     *  效果的速度
     */
    velocity: {
        x: 0,
        y: 5
    },
    /**
     * 将粒子效果绘制到canvas上
     */
    draw: function(c) {
        c.fillStyle = 'rgba(255, 255, 255,' + this.alpha + ')';
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        c.fill();
    },

    /**
     * 更新粒子效果
     */
    update: function() {
        this.x += this.velocity.x,
        this.y += this.velocity.y;
    },

    /**
     * 随机设置信息
     */
    randomize: function(zone) {
        var s = this.getLocation(zone);
        this.x = s.x;
        this.y = s.y;

        this.alpha = this.randomRange(0.3, 1);
        this.radius = this.randomRange(1, 5);

        this.velocity = {
            x: this.randomRange(-0.35, 0.35),
            y: this.randomRange(0.75, 1.5)
        }
    },
    /**
     * 向粒子添加随机漂移运动
     * Adds a random drift type motion to the particle.     * 
     */
    action: function() {
        this.velocity.x  += (Math.random() - 0.5) * 0.1;   //为什么只改动x分量，因为是横向漂移下欧共
    },
    
    randomRange: function(low, high) {
        return (Math.random() * (high - low)) + low;
    },

    /**
     * 获取粒子的随机起始点
     */
    getLocation: function(z) {
        var p = {};
        p.x = z.x + Math.random() * z.width;
        p.y = z.y + Math.random() * z.height;
        return p;
    }


};