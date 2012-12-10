Cube.anim.Range = function(from, to) {
    this.rangeFunc = null;

    if (typeof(from) != typeof(to)) {
        throw "types differ" // <== 
    }

    if (typeof(from) == "number") {

        this.rangeFunc = function(when) {
            if (when < 0) {
                return from; // <== 
            }
            else if (when > 1.0) {
                return to; // <== 
            }
            return Cube.anim.lerp(from, to, when); // <== 
        }
    }
    else if (typeof(from) == "object"
          && from instanceof Array
          && from.length == to.length) {

        this.rangeFunc = function(when) {
            if (when < 0) {
                return from.slice(0); // <== 
            }
            else if (when > 1.0) {
                return to.slice(0); // <== 
            }
            return Cube.anim.lerpa(from, to, when); // <== 
        }
    }
    else {
        throw "unsupported type" // <== 
    }
};

Cube.anim.Range.prototype = {};
Cube.anim.Range.prototype.constructor = Cube.anim.Range;
Cube.anim.Range.prototype.at = function(when) {
    return this.rangeFunc(when);
};
