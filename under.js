(function(){
    //创建根节点对象
    var root=this;
    //存储'_'的值
    var previousUnderscore=root._;
    var ArrayProto=Array.prototype,ObjProto=Object.prototype,FuncProto=Function.prototype;
    //创建引用
    var push           =ArrayProto.push,
        slice          =ArrayProto.slice,
        toString       =ObjProto.toString,
        hasOwnProperty =ObjProto.hasOwnProperty;

    var 
       nativeIsArray       =Array.isArray,
       nativeKeys          =Object.keys,
       nativeBind          =FuncProto.bind,
       nativeCreate        =Object.create;
    
    //可重复应用的构造器函数 for 原型设置
    var Ctor=function(){};
    
    var _=function(obj){
       if(obj instanceof _) return obj;
       if(!(obj instanceof _)) return new _(obj);
       this._wrapped=obj;
    };
    
    //导出该类
    if(typeof exports!=='underfined'){
        if(typeof module!=='underfined'&&module.exports){
            exports=module.exports=_;
        }
        exports._=_;
    }else{
        root._=_;
    }

    _.VERSION='1.7.0';

    //内部函数 返回有效（当前引擎）版本的内部函数
    //在传递的回调中，重复应用于其他下划线
    //功能.
    var optimizeCb=function(func,context,argCount){
       if(context===void 0) return func;
       switch(argCount==null?3:argCount){
           case 1:return function(value){
               return func.call(context,value);
           };
           case 2:return function(value,other){
             return func.call(context,value,other);
           };
           case 3:return function(value,index,collection){
             return func.call(context,value,index,collection);
           };
           case 4:return function(accumulator,value,index,collection){
             return func.call(context,accumulator,value,index,collection);
           }
       }
       return function(){
           return func.apply(context,arguments);
       };
    };
    //一个 内部函数可以生成回调函数以应用到
    //到每个元素的集合中，返回期望的结果是
    //identity 任意一个回调，一个属性或属性访问器。
    var cb=function(value,context,argCount){
      if(value==null) return _.identity;
      if(_.isFunction(value)) return optimizeCb(value,context,argCount);
      if(_.isObject(value)) return _.matches(value);
      return _.property(value);
    };//未完成

    _.iteratee=function(value,context){
      return cb(value,context,Infinity);
    };
    /**
     * 内部函数 
     * 创建assigner 函数 分配
     */
    var createAssigner=function(keyFunc){
        return function(obj){
            var length=arguments.length;
            if(length<2||obj==null) return obj;
            for(var index=0;index<length;index++){
                var source=arguments[index],
                    keys=keyFunc(source),
                    l=keys.length;
                    for(var i=0;i<l;i++){
                      var key=keys[i];
                      obj[key]=source[key];
                    }
            }
            return obj;
        };
    };
    /**
     * 创建新对象 派生自其它对象
     */
    var baseCreate=function(prototype){
       if(!_.isObject(prototype)) return {};
       if(nativeCreate) return nativeCreate(prototype);
       Ctor.prototype=prototype;
       var result=new Ctor;
       Ctor.prototype=null;
       return result;
    };
 
    ////集合函数
    /**
     * 处理 array-likes 类别的类型
     */
    _.each=_.forEach=function(obj,iteratee,context){
        if(obj==null) return obj;
        iteratee=optimizeCb(iteratee,context);
        var i,length=obj.length;
        if(length===+length){
            for(i=0;i<length;i++){
                iteratee(obj[i],i,obj);
            }
        }else{
            var keys=_.keys(obj);
            for(i=0,length=keys.length;i<length;i++){
                iteratee(obj[keys[i]],keys[i],obj);
            }
        }
        return obj;
    };
    /**
     * 
     */
    _.map=_.collect=function(obj,iteratee,context){
       if(obj==null) return [];
       iteratee=cb(iteratee,context);
       var keys=obj.length!==+obj.length&&_.keys(obj),
           length=(keys||obj).length,
           results=Array(length),
           currentKey;
        for(var index=0;index<length;index++){
           currentKey=keys?keys[index]:index;
           results[index]=iteratee(obj[currentKey],currentKey,obj);
        }
        return results;
    };
    _.reduce=_.foldl=_.inject=function(obj,iteratee,memo,context){
      if(obj==null) obj=[];
      iteratee=optimizeCb(iteratee,context,4);
      var keys=obj.length!==+obj.length&&_.keys(obj),
          length=(keys||obj).length,
          index=0,currentKey;
          if(arguments.length<3){
              memo=obj[keys?keys[index++]:index++];
          }
          for(;index<length;index++){
              currentKey=keys?keys[index]:index;
              memo=iteratee(memo,obj[currentKey],currentKey,obj);
          }
          return memo;
    }
    _.reduceRight=_.foldr=function(obj,iteratee,memo,context){
        if(obj==null) obj=[];
        iteratee=optimizeCb(iteratee,context,4);
        var keys=obj.length!==+obj.length&&_.keys(obj),
            index=(keys||obj).length,
            currentKey;
        if(arguments.length<3){
            memo=obj[keys ? keys[--index]:--index];
        }
        while(index-- > 0){
            currentKey=keys?keys[index]:index;
            memo=iteratee(memo,obj[currentKey],currentKey,obj);
        }
        return memo;
    };

    /**
     *可选的
     * 将 obj 转为 object 
     */
    _.transform=function(obj,iteratee,accumulator,context){
        if(accumulator==null){
            if(_.isArray(obj)){
                accumulator=[];
            }else if(_.isObject(obj)){
                var Ctor=obj.constructor;
                accumulator=baseCreate(typeof Ctor==='function'&&Ctor.prototype);
            }else{
                accumulator={};
            }
        }
        if(obj==null) return accumulator;
        iteratee=optimizeCb(iteratee,context,4);
        var keys=obj.length!==+obj.length&&_.keys(obj),
            length=(keys||obj).length,
            index,currentKey;
        for(index=0;index<length;index++){
            currentKey=keys?keys[index]:index;
            if(iteratee(accumulator,obj[currentKey],currentKey,obj)===false)
                break;
        } 
        return accumulator;
    };
    /**
     *  返回指定条件的第一个值 别名 detect
     */
    _.find=_.detect=function(obj,predicate,context){
        var key;
        if(obj.length===+obj.length){  //想能区分数组类型的数据或者类数组数据如字符串等
            key=_.findIndex(obj,predicate,context);
        }else{
            key=_.findKey(obj,predicate,context);
        }
        if(key!==void 0 && key!==-1) return obj[key];
    };
    /**
     * 返回所有为真值的元素 别名 select
     */
    _.filter=_.select=function(obj,predicate,context){
        var results=[];
        if(obj==null) return results;
        predicate=cb(predicate,context);
        _.each(obj,function(value,index,list){
            if(predicate(value,index,list)) results.push(value);            
        });
        return results;
    }
    /**
     * 返回所有检查未通过的元素
     */
    _.reject=function(obj,predicate,context){
      return _.filter(obj,_.negate(cb(predicate)),context);
    };
    /**
     * 是否所有的元素满足真值判断
     */
    _.every=_.all=function(obj,predicate,context){
       if(obj==null) return true;
       predicate=cb(predicate,context);
       var keys=obj.length!==+obj.length&&_.keys(obj),
           length=(keys||obj).length,
           index,currentKey;
        for(index=0;index<length;index++){
            currentKey=keys?keys[index]:index;
            if(!predicate(obj[currentKey],currentKey,obj)) return false;
        }
        return true;
    };
    
    _.some=_.any=function(obj,predicate,context){
        if (obj==null) return false;
        predicate=cb(predicate,context);
        var keys=obj.length!==+obj.length&&_.keys(obj),
            length=(keys||obj).length,
            index,currentKey;
        for (index=0;index<length;index++){
            currentKey=keys?keys[index]:index;
            if(predicate(obj[currentKey],currentKey,obj)) return true;
        }
        return false;
    }
    /**
     * 检测数组或者对象中是否包含给定值 采用 全等判断 ===
     * 别名 include includes
     */
    _.contains=_.includes=_.include=function(obj,target,fromIndex){
        if(obj==null) return false;
        if(obj.length!==+obj.length) obj=_.value(obj);
        return _.indexOf(obj,target,typeof fromIndex=='number'&&fromIndex)>=0;
    };
    /**
     * Invoke 触发一个方法执行集合中每一个元素
     */
    _.invoke=function(obj,method){
        var args=slice.call(arguments,2);
        var isFunc=_.isFunction(method);
        return _.map(obj,function(value){
            return (isFunc?method:value[method]).apply(value,args);
        });
    };
    
    /**
     * 获取对象属性
     * 萃取对象数组中某个属性值，返回一个数组
     */
    _.pluck=function(obj,key){
        return _.map(obj,_.property(key));
    }

    /**
     * 筛选 选择对象中的键值对 “Key:Value”
     */
    _.where=function(obj,attrs){
        return _.filter(obj,_.matches(attrs));
    }

    /**
     * find 获取
     */
    _.findWhere=function(obj,attrs){
        return _.find(obj,_.matches(attrs));
    };
    /**
     * 找到最大值的元素
     */
    _.max=function(obj,iteratee,context){
        var result=-Infinity,lastComputed=-Infinity,
            value,computed;
        if(iteratee===null&&obj!=null){
            obj=ob.length===+obj.length?obj:_.values(obj);
            for(var i=0,length=obj.length;i<length;i++){
                value=obj[i];
                if(value>result){
                    result=value;
                }
            }
        }else{
            iteratee=cb(iteratee,context);
            _.each(obj,function(value,index,list){
                computed=iteratee(value,index,list);
                if(computed>lastComputed||computed===-Infinity&&result===-Infinity){
                  result =value;
                  lastComputed=computed;
                }
            });
        }
        return result;
    }
    _.min=function(obj,iteratee,context){
        var result=Infinity,lastComputed=Infinity,
            value,computed;
        if(iteratee===null&&obj!=null){
            obj=obj.length===+obj.length?obj:_.value(obj);
            for(var i=0,length=obj.length;i<length;i++){
                value=obj[i];
                if(value<result){
                    result=value;
                }
            }
        }else{
            iteratee=cb(iteratee,context);
            _.each(obj,function(value,index,list){
               computed=iteratee(value,index,list);
               if(computed<lastComputed||computed===Infinity&&result===Infinity){
                   result=value;
                   lastComputed=computed;
               }
            });
        }
        return result;
    };

    /**
     * 数组打乱算法 洗牌算法 [Fisher-Yates shuffle]
     * 返回一个随机乱序的list副本
     */
    _.shuffle=function(obj){
       var set=obj&&obj.length===+obj.length?obj:_.value(obj);
       var length=set.length;
       var shuffled=Array(length);
       for(var index=0,rand;index<length;index++){
           rand=_.random(0,index);
           if(rand!==index)shuffled[index]=shuffled[rand];
           shuffled[rand]=set[index];
       }
       return shuffled;
    };
    /**
     * 从 list中产生一个随机样本。
     * 传递一个数字表示从list中返回n个随机元素。否则将返回一个单一的随机项。
     */
    _.sample=function(obj,n,guard){
        if(n==null||guard){
            if(obj.length!==+obj.length) obj=_.values(obj);
            return obj[_.random(obj.length-1)];
        }
        return _.shuffle(obj).slice(0,Math.max(0,n));
    };
    /**
     * 排序对象的元素 通过
     * 返回一个排序后的副本拷贝 如果传入iteratee参数，则是作为排序的依据
     */
    _.sortBy=function(obj,iteratee,context){
        iteratee=cb(iteratee,context);
        return _.pluck(_.map(obj,function(value,index,list){
            return {
                value:value,
                index:index,
                criteria:iteratee(value,index,list)
            };
        }).sort(function(left,right){
            return _.comparator(left.criteria,right.criteria)||left.index-right.index;
        }),'value');
    };
    
    /**
     *  group by操作
     */
    var group=function(behavior){
        return function(obj,iteratee,context){
            var  result={};
            iteratee=cb(iteratee,context);
            _.each(obj,function(value,index){
                var  key=iteratee(value,index,obj);
                behavior(result,value,key);
            });
            return result;
        };
    };

    _.groupBy=group(function(result,value,key){
        if(_.has(result,key)) result[key].push(value);
        else result[key]=[value];
    });
    _.indexBy=group(function(reslut,value,key){
        result[key]=value;
    });
    _.countBy=group(function(result,value,key){
        if(_.has(result,key)) result[key]++;else result[key]=1;
    });
    _.toArray=function(obj){
        if(!obj) return [];
        if(_.isArray(obj))return slice.call(obj);
        if(obj.length===+obj.length) return _.map(obj,_.identity);
        return _.values(obj);
    };

   _.size=function(obj){
       if(obj===null) return 0;
       return obj.length===+obj.length?obj.length:_.key(obj).length;
   };

   /**
    * 数组分离 返回两个元素
     满足筛选条件 不满组筛选条件的组
    */
    _.partition=function(obj,predicate,context){
        predicate=cb(predicate,context);
        var pass=[],fail=[];
        _.each(obj,function(value,key,obj){
           (predicate(value,key,obj)?pass:fail).push(value);
        });
        return [pass,fail];
    };


    /**
     * 数组方法
     */
    /**
     * 返回数组的第一个元素  
     * 传递参数 n 将返回从第一个元素开始的n个元素
     */
    _.first=_.head=_.take=function(array,n,guard){
        if(array===null) return void 0;
        if(n===null||guard) return array[0];
        return _.initial(array,array.length-n);
    };
    /**
     * 返回数组中除最后一个元素外的其他全部元素
     * 参数 n 表示排除数组后边的n个元素 
     */
    _.initial=function(array,n,guard){
        return slice.call(array,0,Math.max(0,array.length-(n===null||guard?1:n)));
    };

    /**
     * 
     */
    _.last=function(array,n,guard){
        if(array===null) return void 0;
        if(n===null||guard)return array[array.length-1];
        return _.rest(array,Math.max(0,array.length-n));
    }
    _.rest=_.tail=_.drop=function(array,n,guard){
        return slice.call(array,n===null||guard?1:n);
    };
    
    /**
     * 提取数组中为真的值
     */
    _.compact=function(array){
        return _.filter(array,_.identity);
    }
    /**
     * 将一个嵌套多层的数组转换为只有一层的数组
     */
    var flatten=function(input,shallow,strict,startIndex){
        var output=[],idx=0,value;
        for(var i=startIndex||0,length=input&&input.length;i<length;i++){
            value=input[i];
            if(value&&value.length>=0&&(_.isArray(value)||_.isArguments(value))){
                //展平当前级别的数组 或者是参数数组
                if(!shallow) value=flatten(value,shallow,strict);
                var j=0,len=value.length;
                output.length+=len;
                while(j<len){
                    output[idx++]=value[j++]
                }
            }else if(!strict){
                output[index++]=value;
            }
        }
        return output;
    };
    _.flatten=function(array,shallow){
        return flatten(array,shallow,false);
    };
    /**
     * 返回不包含指定值的数组
     */
    _.without=function(array){
        return _.difference(array,slice.call(arguments,1));
    }
    /**
     * 返回 array去重后的副本, 使用 === 做相等测试.
     *  如果您确定 array 已经排序, 那么给 isSorted 参数传递 true值, 此函数将运行的更快的算法.
     *  如果要处理对象元素, 传参 iterator 来获取要对比的属性.
     */
    _.uniq=_.unique=function(array,isSorted,iteratee,context){
        if(array===null) return [];
        if(!_.isBoolean(isSorted)){
            context=iteratee;
            iteratee=isSorted;
            isSorted=false;
        }
        if(iteratee!=null)iteratee=cb(iteratee,context);
        var result=[];
        var seen=[];
        for(var i=0,length=array.length;i<length;i++){
            var value=array[i],
                computed=iteratee?iteratee(value,i,array):value;
            if(isSorted){
                if(!i||seen!==computed) result.push(value);
                seen=computed;
            }else if(iteratee){
                if(!_.contains(seen,computed)){
                    seen.push(computed);
                    result.push(value);
                }
            }else if(!_.contains(result,value)){
                result.push(value);
            }
        }
        return result;
    }

    /**
     * 返回传入数组的并集 返回数组元素是唯一的
     */
    _.union=function(){
        return _.uniq(flatten(arguments,true,true));
    }

    /**
     * 返回传入数组的交集，结果中的每个值都存在于传入的每个数组中
     */
    _.intersection=function(array){
        if(array===null) return [];
        var result=[];
        var argsLength=arguments.length;
        for(var i=0,length=array.length;i<length;i++){
            var item=array[i];
            if(_.contains[result,item]) continue;
            for(var j=1;j<argsLength;j++){
                if(!_.contains(arguments[j],item)) break;
            }
            if(j===argsLength) result.push(item);
        }
        return result;
    };
     /**
      * 类似于 without 返回的值来源于 array数组，并且不存在于第二个参数数组中
      */
    _.difference=function(array){
       var rest=flatten(arguments,true,true,1);
       return _.filter(array,function(value){
           return !_.contains(rest,value);
       });
    }

    /**
     * 将每个array中相应位置的值合并在一起 在合并分开保存的数据很有用
     * 如果处理矩阵嵌套数组时，_.zip.apply()可以做类似的效果
     */
    _.zip=function(array){
        if(array===null) return [];
        var length=_.max(arguments,'length').length;
        var results=Array(length);
        while(length-- >0){
            results[length]=_.pluck(arguments,length);
        }
        return results;
    };

    _.unzip=function(array){
        return _.zip.apply(null,array);
    }

    /**
     * 将数组转变成对象
     * 传递任何一个独立[key,value]对的列表，
     * 或者一个键的列表和一个值列表
     * 如果存在重复键 最后一个值将被返回
     */
    _.object=function(list,values){
       if(list===null) return {};
       var result={};
       for(var i=0,length=list.length;i<length;i++){
           if(values){
               result[list[i]]=values[i];
           }else{
               result[list[i][0]]=list[i][1];
           }
       }
       return result;
    };

    _.indexOf=function(array,item,isSorted){
        var i=0,length=array&&array.length;
        if(typeof isSorted==='number'){
            i=isSorted<0?Math.max(0,length+isSorted):isSorted;
        }else if(isSorted&&length){
            i=_.sortedIndex(array,item);
            return array[i]===item?i:-1;
        }
        for(;i<length;i++){
         if(array[i]===item) return i; 
       }
       return -1;
    };
    _.lastIndexOf=function(array,item,from){
        var idx=array?array.length:0;
        if(typeof from==='number'){
            idx=form<0?idx+from+1:Math.min(idx,from+1);
        }
        while(--idx >=0) if(array[idx]===item) return idx;
        return -1;
    };
    _.findIndex=function(array,predicate,context){
        predicate=cb(predicate,context);
        var length=array!=null?array.length:0;
        for(var i=0;i<length;i++){
            if(predicate(array[i],i,array)) return i;
        }
        return -1;
    };
    /*** 
     * 使用二分查找确定value在list中的位置号
     * value按此序列号插入能保持list原有的排序
     * 如果传入 iteratee函数,iterator将作为排序的依据，包括你传递的value
     * 也可以是字符串的属性名排序
     */
    _.sortedIndex=function(array,obj,iteratee,context){
       iteratee=cb(iteratee,context,1);
       var value=iteratee(obj);
       var low=0,high=array.length;
       while(low<high){
           var  mid=Math.floor((low+height)/2);
           if(_.comparator(iteratee(array[mid]),value)<0) low=mid+1;
           else hight=mid;
       }
       return low;
    }
    /**
     * 一个用来创建灵活编号的列表函数
     * 省略start 则默认为0；
     * step 默认为1
     * 返回一个从start到stop的整数列表
     * 用step来增加或减少
     */
    _.range=function(start,stop,step){
        if(arguments.length<=1){
            stop=start||0;
            start=0;
        }
        step=step||1;
        var length=Math.max(Math.ceil((stop-start)/step),0);
        var range=Array(length);
        for(var idx=0;idx<length;idx++,start+=step){
            range[idx]=start;
        }
        return range;
    };

    /**
     * 函数功能
     * 
     */
    
     /**
      *根据输入参数确定函数是否是构造函数还是带参普通函数，
      */
    var  executeBound=function(sourceFunc,boundFunc,context,callingContext,args){
      if(!(callingContext instanceof boundFunc)) return sourceFunc.apply(context,args);
       var  self=baseCreate(sourceFunc.prototype);
       var  reslut=sourceFunc.apply(self,args);
       if(_.isObject(result)) return result;
       return self;
    };

    /**
     * 将一个函数绑定到指定的对象 this arguments 
     * 无论何时调用函数 函数的this都指向这个objectt 
     * 任意可选参数指定给该function,可以填充函数所需要的参数
     */
    _.bind=function(func,context){
        if(nativeBind && func.bind===nativeBind) return nativeBind.bind(func,slice.call(arguments,1));
        if(!_.isFunction(func)) throw new TypeError('绑定必须发生在函数上');
        var args=slice.call(arguments,2);
        return function bound(){
            return executedBound(func,bound,context,this,args.concat(slice.call(arguments)));
        };
    };
   /**
    * 部分应用函数 或者偏函数应用
    * 它接收一定数目的参数，绑定值到一个或多个这些参数，并返回一个新的函数，
    返回的函数只接收剩余未绑定的值的参数。
    */
    _.partial=function(func){
        var boundArgs=slice.call(arguments,1);
        return function bound(){
            var position=0;
            var args=boundArgs.slice();
            for(var i=0,length=args.length;i<length;i++){
                if(args[i]===_) args[i]=arguments[position++];
            }
            while(position<arguments.length) args.push(arguments[position++]);
            return executedBound(func,bound,this,this,args);            
        };
    };
    /**
     * 把methodNames参数指定的一些方法绑定到object上，这些方法会在对象的上下文环境中执行。
     * 绑定函数作用事件处理函数时非常便利，否则函数被调用时this没有用
     * methodNames参数是必须的
     */
    _.bindAll=function(obj/*methodNames*/){
        var i,length=arguments.length,key;
        if(length<=1) throw new Error('bingAll must be passed funcion names');
        for(i=1;i<length;i++){
            key=arguments[i];
            obj[key]=_.bind(obj[key],obj);
        }
        return obj;
    };
    /**
     * 可以缓存某函数的计算结果 对于耗时较长的计算比较有帮助
     *  如果传入了hasher参数，就用hasher的返回值作为key存储函数的计算结果
     */
    _.memoize=function(func,hasher){
        var memoize=function(key){
            var cache=memoize.cache;
            var address=''+(haser?haser.apply(this,arguments):key);
            if(!_.has(cache,address)) cache[address]=func.apply(this,arguments);
            return cache[address];
        };
        memoize.cache={};
        return memoize;
    };

    /**
     * 类似于setTimeout，等待wait毫米候调用function.
     * 如果调用arguments 当函数function执行时，arguments会作为参数传入
     */
    _.delay=function(func,wait/**arguments*/){
        var  args=slice.call(arguments,2);
        return setTimeout(function(){
          return func.apply(null,args);
         },wait);
    };
    
    _.defer=_.partial(_.delay,_,1);
    /**
     * 创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每个wait毫秒调用一次该函数
     * 应用于想控制一些触发频率较高的事件
     * 返回一个函数 该函数在给定的时间内最多只会触发一次
     * 
     * 所以说，underscore 的函数节流有三种调用方式，默认的（有头有尾），
     * 设置 {leading: false} 的 事件开始不执行，以及设置 {trailing: false}事件结束时不执行。
     * 按频率执行调用 
     * 例如 游戏中的按键响应 格斗 射击 簇拥so控制出拳和射击的速率
     *    自动完成 按照一定频率分析输入 提示自动完成
     * 鼠标移动和窗口滚动 需要控制回调发生的频率
     */
    _.throttle=function(func,wait,options){
       var context,args,result;//缓存func执行所需要的上下文，result缓存func执行结果
       var timeout=null; //timeout标识最近一次被追踪的调用 最近一次
       var previous=0; //标记时间戳 上一次执行回调的时间戳 最后一次func调用的时间点
       if(!options) options={};
       /**
        * 创建一个掩护执行的函数包裹住func的执行
        */
       var later=function(){
           //执行时 刷新最近一次调用的时间
           previous=options.leading===false?0:_.now();
           //清空为此次执行设置的定时器 
           timeout=null;
           result=func.apply(context,args);
           if(!timeout) context=args=null;
       };
       //返回一个节流化后的函数
       return function(){
           //尝试调用func时，会首先记录当前时间戳
           var now=_.now();
           //是否第一次调用
           if(!previous&&options.length.leading===false) previous=now;
           //func还要等待多久才能调用 
           var remaining=wait-(now-previous);
           //记录执行时需要的上下文和参数
           context=this;
           args=arguments;
           //如果计算后能立即执行
           if(remaining<=0||remaining>wait){ //remaining>wait 等同于 now<previous
               //清除之前的设置的延时执行，就不存在某些回调一同发生的情况
               if(timeout){
                   clearTimeout(timeout);
                   timeout=null;
               }
               //刷新最近一次调用用func调用的时间点
               previous=now;
               //执行func调用
               result=func.apply(context,args);
               /**
                * 再次检查timeout，因为func执行期间可能有新的timeout被设置，
                如果 timeout被清空了，代表不再有等待执行的func 也清空context 和args
                */
               if(!timeout) context=args=null;
           }else if(!timeout && options.trailing!==false){
               //如果设置了trailing 那么暂缓此次调用尝试的执行
               timeout=setTimeout(later,remaining);
           }
           return result;
       }
    };
     /**
      * 防反跳 就是不在跳起，不再响应的意思
      immediate true 可以执行时立即执行
                false  可以执行时也必须延后至少 wait毫秒后执行
      * 高频下只响应一次   Ajax多数场景下 每个异步请求再多时间内只能响应一次 
      比如 下拉刷新 但只发送一次ajax请求
      */
    _.debounce=function(func,wait,immediate){
       var timeout,args,context,timestamp,result;
        
       var later=function(){
           var last=_.now()-timestamp;
           if(last<wait && last>=0){
               timeout=setTimeout(later,wait-last);
           }else{
               timeout=null;
               if(!immediate){
                   result=func.apply(context,args);
                   if(!timeout) context=args=null;
               }
           }
       };
       return function(){
           context=this;
           args=arguments;
           timestamp=_.now();
           var  callNow=immediate&&!timeout;
           if(!timeout) timeout=setTimeout(later,wait);
           if(callNow){
               result=func.apply(context,args);
               context=args=null;
           }
           return result;
       };
    };
   /**
    * 将第一个函数func封装在wrapper里边，并把func作为第一个参数传递给wrapper
    * 这样可以让wrapper在function运行之前和之后之后执行代码
    */
    _.wrap=function(func,wrapper){
        return _.partial(wrapper,func);
    };
    /**
     * 返回一个新的predicate函数否定版本
     */
    _.negate=function(predicate){
        return function(){
            return !predicate.apply(this,arguments);
        }
    }
    /**
     * 返回函数集合functions组合后的复合函数即 一个函数执行完之后把返回的结果再作为参数赋值给下一个函数来执行
     * 例如  在数学中 f(),g(),和h()组合起来可以得到复合函数放f(g(h()))
     */
    _.compose=function(){
        var args=arguments;
        var start=args.length-1;
        return function(){
            var i=start;
            var result=args[start].apply(this,arguments);
            while(i--) result=args[i].call(this,result);
            return result;
        };
    };
     /**
      *  创建一个函数 只有在运行了times次后才有效果，在处理同组异步请求返回结果时如果要确保同组理所有
      异步请求组里所有的异步请求完成之后才执行这个函数
      */
    _.after=function(times,func){
        return function(){
            if(--times<1){
                return func.apply(this,arguments);
            }
        };
    };
    /**
     *  创建一个函数 调用不超过times 当count已经到达时 最后一个函数调用结果被记住并返回
     */
    _.before=function(times,func){
        var  memo;
        return function(){
            if(--times>0){
                memo=func.apply(this,arguments);
            }
            if(times<=1) func=null;
            return memo;
        };
    };

    /**
     * 返回一个函数 最多只执行一次
     */
    _.once=_.partial(_.before,2);

    
/*******
 * 对象方法
 */
    var hasEnumBug=!{toString:null}.propertyIsEnumerable('toString');
    var nonEnumerableProps=['construtor','valueOf','isPrototypeOf','toString','propertyIsEnumerable','hasOwnProperty','toLocaleString'];
    function collectNonEnumProps(obj,keys){
      var nonEnumIdx=nonEnumerableProps.length;
      var proto=typeof obj.constructor==='function'?FuncProto:ObjProto;
      while(nonEnumIdx--){
          var prop=nonEnumerableProps[nonEnumIdx];
          if(prop==='constructor' ?_.has(obj,prop):prop in obj&&obj[prop]!==proto[prop]&&!_.contains(keys,prop)){
        keys.push(prop);
        }
      }
    };

    _.keys=function(obj){
        if(!_.isObject(obj)) return [];
        if(nativeKeys) return nativeKeys(obj);
        var  keys=[];
        for(var key in obj) if(_.has(obj,key)) keys.push(key);
        if(hasEnumBug) collectNonEnumprops(obj,keys);
        return keys;
    };
    _.keysIn=function(obj){
        if(!_.isObject(obj)) return [];
        var keys=[];
        for(var key in obj) keys.push(key);
        if(hasEnumBug) collectNonEnumProps(obj,keys);
        return keys;
    };
    _.value=function(obj){
        var keys=_.keys(obj);
        var length=keys.length;
        var values=Array(length);
        for(var i=0;i<length;i++){
            values[i]=obj[keys[i]];
        }
        return values;
    };
    _.pairs=function(obj){
        var keys=_.keys(obj);
        var length=keys.length;
        var pairs=Array(length);
        for(var i=0;i<length;i++) {
            pairs[i]=[keys[i],obj[keys[i]]];
        }
        return pairs;
    };
    
    /**
     * 将对象中的值与属性对调
     */
    _.invert=function(obj){
        var result={};
        var keys=_.keys(obj);
        for(var i=0,length=keys.length;i<length;i++){
            result[obj[keys[i]]]=keys[i];
        }
        return result;
    };
    /**
     * 返回对象中函数的排序后的集合 
     */
    _.functions=_.methods=function(obj){
        var names=[];
        for(var key in obj){
            if(_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };
    _.extend=createAssigner(_.keysIn);
    _.assign=createAssigner(_.keys);
    _.findKey=function(obj,predicate,context){
        predicate=cb(predicate,context);
        var keys=_.keys(obj),key;
        for(var i=0,length=keys.length;i<length;i++){
            key=keys[i];
            if(predicate(obj[key],key,obj)) return key;
        }
    };
    _.pick=function(obj,iteratee,context){
        var result={},key;
        if(obj==null) return result;
        if(_.isFunction(iteratee)){
            iteratee=optimizeCb(iteratee,context);
            for(key in obj){
                var value=obj[key];
                if(iteratee(value,key,obj)) result[key]=value;
            }
        }else{
            var keys=flatten(arguments,false,false,1);
            obj=new Object(obj);
            for(var i=0,lenth=keys.length;i<length;i++){
                key=keys[i];
                if(key in obj) result[key]=obj[key];
            }
        }
        return result;
    }
    _.omit=function(obj,iteratee,context){
        if(_.isFunction(iteratee)){
            iteratee=_.negate(iteratee);
        }else{
            var keys=_.map(flatten(arguments,false,false,1),String);
            iteratee=function(value,key){
                return !_.contains(keys,key);
            };
        }
        return _.pick(obj,iteratee,context);
    };

    _.defaults=function(obj){
        if(!_.isObject(obj)) return obj;
        for(var i=1,length=arguments.length;i<length;i++){
            var source=arguments[i];
            for(var prop in source){
                if(obj[prop]===void 0) obj[prop]=source[prop];
            }
        }
        return obj;
    };
    _.create=function(prototype,props){
        var result=baseCreate(prototype);
        if(props) _.assign(result,props);
        return result;
    };

    _.clone=function(obj){
        if(!_.isObject(obj)) return obj;
        return _.isArray(obj)?obj.slice():_.extend({},obj);
    };

    _.tap=function(obj,iterceptor){
        iterceptor(obj);
        return obj;
    }
    /**
     * 内部递归比较功能的 isEqual
     */
    var eq=function(a,b,aStack,bStack){
        if(a===b) return a!==0|| 1 / a===1 / b;
        if(a==null || b ==null) return a===b;
        if(a instanceof _) a=a._wrapped;
        if(b instanceof _) b=b._wrapped;
        //比较 [[Class]] 名称
        var className=toString.call(a);
        if(className!==toString.call(b)) return false;
        switch(className){
            //Strings,numbers,regular expressions, dates, and booleans are compared by value;
            case '[object RegExp]':
            // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
                return ''+a===""+b;
            case '[Object Number]':
                if(+a!==+a) return +b!==+b;
            return +a===0 ? 1 / +a === 1 / b:+a===+b;
            case '[object Date]':
            case '[object Boolean]':
                return +a===+b;
        }

        var areArrays=className==='[object Array]';
        if(!areArrays){
            if(typeof a !='object' || typeof b!='object') return false;
            var aCtor=a.constructor,bCtor=b.constructor;
            if(aCtor!==bCtro && !(_.isFunction(aCtor)&& aCtor instanceof aCtor &&
                     _.isFunction(bCtor)&&bCtor instanceof bCtro)
                    &&('constructor' in a && 'constructor' in b)){
                        return false;
            }
        }
        var length=aStack.length;
        while(length--){
            if(aStack[length]===a) return bStack[length]===b;
        }
        aStack.push(a);
        bStack.push(b);
        if(areArrays){
            //判断数组长度 决定是否有深入比较的必要
            length=a.length;
            if(length!==b.length) return false;
            //深度比较内容 忽视 non-numeric peoperties;
            while(length--){
                if(!eq(a[length],b[length],aStack,bStack)) return false;
            }
        }else{
            //深度比较对象
            var keys=_.keys(a),key;
            length=keys.length;
            //比较前假定两个对象拥有同样数量的属性
            if(_.keys(b).length!==length) return false;
            while(length--){
                key=keys[length];
                if(!(_.has(b,key) && eq(a[key],b[key],aStack,bStack))) return false;
            }
        }
        //// Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
    };
    /**
     * 深度比较判断是否相等
     */
    _.isEqual=function(a,b){
        return eq(a,b,[],[]);
    }

    /**
     * 输入 Array string 或者 object 是否为空
     */
    _.isEmpty=function(obj){
        if(obj===null) return true;
        if(_.isArray(obj)||_.isString(obj)||_.isArguments(obj)) return object.length===0;
        for(var key in obj) if(_.has(obj,key)) return false;
        return true;
    };

    /**
     * 判断给定的是否是 DOM element类型
     */
    _.isElement=function(obj){
        return !!(obj && obj.nodeType===1);
    };

    /**
     * 判断给定值是否是数组
     */
    _.isArray=nativeIsArray||function(obj){
        return toString.call(obj)==='[object Array]';
    };

    /**
     * 判断给定对象是否是 对象
     */
    _.isObject=function(obj){
        var type=typeof obj;
        return type==='function'||type==='object' && !!obj;
    };

    /**
     * 添加一些 isType方法：isArguments,isFunction,isString,isNumber,isDate,isRegExp,isError.
     */
    _.each(['Arguments','Function','String','Number','Date','RegExp','Error'],function(name){
        _['is'+name]=function(obj){
            return toString.call(obj)==='[object]'+name+']';
        };
    });
    
    /**
     * Define a fallback version of the method in browsers (ahem, IE < 9)
     * where there isn't any inspectable "Arguments" type.
     * 定义一个可靠的方法 
     * 
     */
    if(!_.isArguments(arguments)){
        _.isArguments=function(obj){
            return _.has(obj,'callee');
        };
    }
    /**
     * Optimize `isFunction` if appropriate. Work around an IE 11 bug (#1621).
     * Work around a Safari 8 bug (#1929)
     */
    if(typeof /./ !='function' && typeof Int8Array !='object'){
        _.isFunction=function(obj){
            return typeof obj==='function'||false;
        };
    }
    /**
     * 判定给定对象是否是无限值
     */
    _.isFinite=function(obj){
        return isFinite(obj) && !isNaN(parseFloat(obj));
    };
    /**
     * NaN是唯一一个不等于它本身的值
     */
    _.isNaN=function(obj){
        return _.isNumber(obj) && obj!==+obj;
    };
    /**
     * 判断Boolean的值类型
     */
    _.isBoolean=function(obj){
        return obj===true||obj===false||toString.call(obj)==='[object Boolean]';
    };
    _.isNull=function(obj){
        return obj===null;
    };
    _.isUndefined=function(obj){
        return obj===void 0;
    };
    /**
     * 看是否是自身属性
     */
    _.has=function(obj,key){
        return obj!=null && hasOwnProperty.call(obj,key);
    };
    
    // Utility Functions
    //-------------------
    _.noConflict=function(){
        root._=previousUnderscore;
        return this;
    };

    /**
     * Keep the identity function around for default iteratees.
     */
    _.identity=function(value){
        return value;
    };
    /**
     * Predicate-generating functions. Often useful outside of Underscore.
     */
    _.constant=function(value){
        return function(){
            return value;
        };
    };

    _.noop=function(){};
    _.property=function(key){
        return function(obj){
            return obj===null ? void 0:obj[key];
        };
    };
    /**
     * Generates a function for a given object that returns a given property (including those of ancestors)
     */
    _.propertyOf=function(obj){
        return obj===null ? function(){}:function(key){
            return obj[key];
        };
    };
    /**
     * 检测对象是否需要 'key:value'对的形式
     */
    _.matches=function(attrs){
        var  pairs=_.pairs(attrs),length=pairs.length;
        return function(obj){
            if(obj===null) return !length;
            obj=new Object(obj);
            for(var i=0; i<length; i++){
                var pair=pairs[i],key=pairs[0];
                if(pair[1]!==obj[key]||(key in obj)) return false;
            }
            return true;
        };
    };
    



}.call(this));