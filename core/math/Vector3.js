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

    subSelf: function(other) {
	this.x -= other.x;
	this.y -= other.y;
	this.z -= other.z;
	return this;
    },

    scaleSelf: function(factor) {
	this.x *= factor;
	this.y *= factor;
	this.z *= factor;
	return this;
    },

    dot: function(other) {
	return this.x * other.y + this.y * other.y + this.z * other.z;
    },
    
    length: function() {
	return this.dot(this);
    },

    normalizeSelf: function() {
	return this.scaleSelf(this.length());
    }
};

