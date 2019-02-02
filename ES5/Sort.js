
function QuickSort(arr, func) {
    if (!arr || !arr.length) return [];
    if (arr.length === 1) return arr;
    let pivot = arr[0];
    let smallSet = [];
    let bigSet = [];
    for (let i = 1; i < arr.length; i++) {
        if (func(arr[i], pivot) < 0) {
            smallSet.push(arr[i]);
        } else {
            bigSet.push(arr[i]);
        }
    }
    return QuickSort(smallSet, func).concat([pivot]).concat(QuickSort(bigSet, func))
}

// 带分区的快速排序算法
function swap(arr, from, to) {
    if (from  == to) return;
    let temp = arr[from];
    arr[from] = arr[to]; 
    arr[to] = temp;
}

function QuickSortWithPartition(arr, func, from, to) {
    if (!arr || !arr.length) return [];
    if (arr.length === 1) return arr;

    from = from ||  0;
    to = to >= 0 ? to : arr.length - 1;
    if(from === to) return arr;
    let pivot = arr[from];
    let smallIndex = from;
    let bigIndex = from + 1;
    for (; bigIndex <= to; bigIndex++) {
        if (func(arr[bigIndex], pivot) < 0) {
            smallIndex++;
            swap(arr, smallIndex, bigIndex);
        }
    }
    swap(arr, smallIndex, from);
    QuickSortWithPartition(arr, func, from, smallIndex - 1 < 0 ? 0 : smallIndex - 1);
    QuickSortWithPartition(arr, func, smallIndex + 1, to);
    return arr;
}


let testArr = [1, 2, 11, 34, 32, 65, 21,13,14,11]
let sortFunc = (a, b) => {
    return a - b;
}
let q1 = QuickSort(testArr, sortFunc);
console.log(JSON.stringify(testArr),'\n VS \n ',JSON.stringify(q1));

QuickSortWithPartition(testArr, sortFunc)
console.log(JSON.stringify(testArr))
