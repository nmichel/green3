Cube.core.BufferSetNode = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.factory = attributes.factory;
};

Cube.core.BufferSetNode.prototype = new Cube.core.Node({});
Cube.core.BufferSetNode.prototype.constructor = Cube.core.BufferSetNode;

Cube.core.BufferSetNode.prototype.createAttributeBuffer = function(name, data) {
    return this.createBuffer(name, new Float32Array(data), false);
};

Cube.core.BufferSetNode.prototype.createIndexBuffer = function(name, data) {
    return this.createBuffer(name, new Uint16Array(data), true);
};

Cube.core.BufferSetNode.prototype.createBuffer = function(name, data, flag) {
    this[name+"Buffer"] = this.buildBuffer(flag, data, this.factory); // [FIXME : +"Buffer" to be compliant with current renderer]
    return this;
};

Cube.core.BufferSetNode.prototype.accept = function(visitor) {
    visitor.visitBufferSet(this);
};

Cube.core.BufferSetNode.prototype.buildBuffer = function(isIndex, data, factory) {
    return {size: data.length,
	        data: factory(isIndex, data)};
};
