const add = function(a, b) {
    return a+b;
}

const curryAdd = function(a) {
    return function(b) {
        return a+b;
    }
}

const curry2 = (fn, a) => {
    // fn must be a function
    if (typeof fn !== 'function'){
        throw 'curry must have a function argument';
    }
    return (b) => fn.call(undefined, a, b);
}
module.exports = {
    add,
    curryAdd,
    curry2
}