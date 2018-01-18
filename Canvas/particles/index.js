var w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext('2d'),

    opts = {

        len: 30, //边长
        count: 2, //线段条数 光线条数
        baseTime: 10,
        addedTime: 10,
        dieChance: 0.05,  //随机数产生低于该值时默认取消
        spawnChance: 1,
        sparkChance: 0.1,  // 额外的小点位信息 出现概率
        sparkDist: 10,  // 散光点的最远距离
        sparkSize: 2,    // 闪光点的大小

        color: 'hsl(hue, 100%, light%)',
        baseLight: 50,
        addedLight: 10,  // [50-10, 50+10]
        shadowToTimePropMult: 6,
        baseLightInputMultplier: 1,
        addedLightInputMultiplier: 0.02,
        
        cx: w / 2,
        cy: h / 2,
        repaintAlpha: .04,
        hueChange: .1
    },
    
    tick = 0,
    lines = [],
    dieX = w / 2 / opts.len,
    dieY = h / 2 / opts.len,
    baseRad = Math.PI * 2 / 6;  // 控制转动的外角  360/6 每次转动60度 即该值
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);

    function loop() {
        window.requestAnimationFrame( loop );
        ++tick;

        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0; // 描述模糊效果的程度， 默认是0
        ctx.fillStyle = 'rgba(0, 0, 0, alp)'.replace('alp', opts.repaintAlpha);
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation ='lighter';

        if( lines.length < opts.count && Math.random() < opts.spawnChance)
           lines.push(new Line);

        lines.map( function(line) {
            line.step();
        });
    };

    function Line() {
        this.reset();
    };
    Line.prototype.reset = function() {
        this.x = 0;
        this.y = 0;
        this.addedX = 0;
        this.addedY = 0;

        this.rad = 0;
        // 乘数因子
        this.lightInputMultiplier = opts.baseLightInputMultplier + opts.addedLightInputMultiplier * Math.random();
        // 初始颜色
        this.color = opts.color.replace('hue', tick * opts.hueChange);
        this.cumulativeTime = 0;
        this.beginPhase();
    };
    Line.prototype.beginPhase = function() {
        this.x += this.addedX;
        this.y += this.addedY;

        this.time = 0; //初始化次数
        /***
         * 绘制多少次 终点次数 目标次数 可以绘制多少条
         */
        this.targetTime = (opts.baseTime + opts.addedTime * Math.random() ) | 0;  // 转成Int类型
        this.rad += baseRad * (Math.random() < 0.5 ? 1 : -1); // 每次随机增加旋转角度基准角度 或者减少基准角度
        this.addedX = Math.cos( this.rad );  // 增量X值 单位长度 * cos值等于 x 轴
        this.addedY = Math.sin( this.rad );  // 增量Y值 单位长度 * sin值等于 y 轴
        console.log(this);
        // 如果产生的随机数小于某值 绘线 X 值超过范围  后者小于 最小x范围  或者 Y 值不满足条件 
        if( Math.random() < opts.dieChance || this.x > dieX || this.x < -dieX || this.y > dieY || this.y < -dieY)
          this.reset(); //重置该彩色线段
    };
    Line.prototype.step = function() {
        ++this.time;
        ++this.cumulativeTime;
        if( this.time >= this.targetTime ) 
            this.beginPhase();
        var prop = this.time / this.targetTime,
            wave = Math.sin(prop * Math.PI / 2),
            x = this.addedX * wave,
            y = this.addedY * wave;
        ctx.shadowBlur = prop * opts.shadowToTimePropMult;
        // shadowColor 阴影 
        // 小方块颜色
        ctx.fillStyle = ctx.shadowColor = this.color.replace('light',
        opts.baseLight + 
        opts.addedLight * Math.sin(this.cumulativeTime * this.lightInputMultiplier));

        // 绘制的小方块位置
        ctx.fillRect(opts.cx + (this.x + x) * opts.len, 
        opts.cy + (this.y + y ) * opts.len, 
        2, 
        2);

        if(Math.random() < opts.sparkChance ) {
            ctx.fillRect( 
                //cx屏幕中点 + （该线的位置 + 偏移量）* 
                opts.cx + (this.x + x ) * opts.len + Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2, 
                opts.cy + (this.y + y ) * opts.len +Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2,
                opts.sparkSize,
                opts.sparkSize);
        }
        
    }

    loop();
    window.addEventListener( 'resize', function(){
        w = c.widht = window.innerHeight;
        h = c.height = window.innerHeight;
        ctx.fillStyle = 'black';
        ctx.fillRect( 0, 0, w, h);

        opts.cx = w / 2;
        opts.cy = h / 2;
        dieX = w / 2 / opts.len;
        dieY = h / 2 / opts.len;
    });
