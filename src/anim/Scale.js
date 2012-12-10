Cube.anim.Scale = function(values) {
    // if (values.length < 2) {
    //     throw ...
    // }

    var rangeCount = values.length-1;
    var rangeLength = 1.0/rangeCount;
    
    this.rangeLength = rangeLength;
    this.rangeCount = rangeCount;
    this.ranges = [];
    for (var i = 0; i < rangeCount; ++i) {
        var range = new Cube.anim.Range(values[i], values[i+1]);
        this.ranges.push(range);
    }
};

Cube.anim.Scale.prototype = {};
Cube.anim.Scale.prototype.constructor = Cube.anim.Scale;
Cube.anim.Scale.prototype.at = function(when) {
    var rangeId = Math.floor(when/this.rangeLength);
    var whenInRange = (when*this.rangeCount)-rangeId; // scale up, then offset
    return this.ranges[rangeId].at(whenInRange);
};


