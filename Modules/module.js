var MyModules=(function Manager(){
    var modules={};
    function define(name,deps,impl){
        for(var i=0;i<deps.length;i++){
          deps[i]=modules[deps[i]];
        }
        modules[name]=impl.apply(impl,deps);
    }
    function get(name){
        return modules[name];
    }
    return {
        define:define,
        get:get
    };
})();

MyModules.define('bar',[],function(){
   function hello(who){
       return '你好'+who;
   }
   return {
       hello:hello
   };
});

MyModules.define('foo',['bar'],function(bar){
    var hunge='王刚';
    function awesome(){
        console.log(bar.hello(hunge));
    }
    return {
        awesome:awesome
    };
});

var bar =MyModules.get("bar");
var foo=MyModules.get('foo');
console.log(bar.hello('刚过个年'));
console.log();
//foo.awesome();