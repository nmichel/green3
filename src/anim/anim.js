Cube.anim = {}

Cube.anim.lerp = function(from, to, when) {
    return from + (to-from)*when;
};

Cube.anim.clamp = function(value, min, max) {
    if (value < min) {
        return min; // <== 
    }
    else if (value > max) {
        return max; // <== 
    }
    return value;
};

Cube.anim.lerpa = function(from, to, when) {
    var res = [];
    for (var i = 0; i < from.length; ++i) {
        res[i] = Cube.anim.lerp(from[i], to[i], when);
    }
    return res;
};
