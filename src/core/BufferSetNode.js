Cube.core.BufferSetNode = function (attributes) {

//    this.checkFactory(attributes.factory);
//    this.checkBuffer(attributes.vertex);
//    this.checkBuffer(attributes.index);

    this.factory = attributes.factory;
    this.vertexBuffer = null;
    this.normalBuffer = null;
    this.colorBuffer = null;
    this.uvBuffer = null;
    this.indexBuffer = null;

    var factory = this.factory;

    if (!!attributes.vertex) {
	this.vertexBuffer = this.buildBuffer(false, attributes.vertex, factory);
    }

    if (!!attributes.normal) {
	this.normalBuffer = this.buildBuffer(false, attributes.normal, factory);
    }

    if (!!attributes.color) {
	this.colorBuffer = this.buildBuffer(false, attributes.color, factory);
    }

    if (!!attributes.uv) {
	this.uvBuffer = this.buildBuffer(false, attributes.uv, factory);
    }

    if (!!attributes.index) {
	this.indexBuffer = this.buildBuffer(true, attributes.index, factory);
    }

    Cube.core.Node.call(this, attributes);
};

Cube.core.BufferSetNode.prototype = new Cube.core.Node({});
Cube.core.BufferSetNode.prototype.constructor = Cube.core.BufferSetNode;

Cube.core.BufferSetNode.prototype.accept = function (visitor) {
    visitor.visitBufferSet(this);
};

Cube.core.BufferSetNode.prototype.buildBuffer = function (isIndex, data, factory) {
    return {size: data.length,
	    data: factory(isIndex, data)};
    
};

Cube.core.BufferSetNode.prototype.checkFactory = function (ref) {
    Cube.core.Utilities.checkReference(ref);
    return ref;
};

Cube.core.BufferSetNode.prototype.checkBuffer = function (buffer) {
    Cube.core.Utilities.checkReference(buffer);
    return buffer;
}
