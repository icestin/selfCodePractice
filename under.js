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



}.call(this));