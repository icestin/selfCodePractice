// 常用函数扩展函数
Function.prototype.bind = function(scope) {
    fn = this;
    return function (scopt) {
        return fn.apply(null, arguments);
    }
}