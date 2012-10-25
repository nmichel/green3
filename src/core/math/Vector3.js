Cube.core.math.Vector3 = function(x, y, z) {
    this.set(x, y, z);
};

Cube.core.math.Vector3.prototype = {
    constructor: Cube.core.math.Vector3,

    getX: function() {
        return this.x;
    },

    getY: function() {
        return this.y;
    },

    getZ: function() {
        return this.z;
    },

    setX: function(v) {
        this.x = v;
        return this;
    },

    setY: function(v) {
        this.y = v;
        return this;
    },

    setZ: function(v) {
        this.z = v;
        return this;
    },

    set: function(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        return this;
    },

    setFrom: function(other) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    },

    addSelf: function(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    },

    add: function(other) {
        return new Cube.core.math.Vector3(
            this.x + other.x,
            this.y + other.y,
            this.z + other.z);
    },

    subSelf: function(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    },

    sub: function(other) {
        return new Cube.core.math.Vector3(
            this.x - other.x,
            this.y - other.y,
            this.z - other.z);
    },

    scaleSelf: function(factor) {
        this.x *= factor;
        this.y *= factor;
        this.z *= factor;
        return this;
    },

    scale: function(factor) {
        return new Cube.core.math.Vector3(
            factor * this.x,
            factor * this.y,
            factor * this.z);
    },

    cross: function(other) {
        var tx = this.x;
        var ty = this.y;
        var tz = this.z;

        var ox = other.x;
        var oy = other.y;
        var oz = other.z;

        return new Cube.core.math.Vector3(
            ty * oz - tz * oy,
            tz * ox - tx * oz,
            tx * oy - ty * ox);
    },

    dot: function(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    },
    
    length: function() {
        return this.dot(this);
    },

    normalizeSelf: function() {
        return this.scaleSelf(this.length());
    }
};

