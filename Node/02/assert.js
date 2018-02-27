/****
 * assert 应用练习
 */
var assert = require('assert');

function add (a, b) {
    return a + b;
}

var result = add(1, 3);
console.log("add(1, 3) result:",result);
// assert(result === 5,'结果 1 + 3 = 5');
// assert.equal(result, 5,'提示信息');
//  assert.notEqual(result, 4,'提示信息');
