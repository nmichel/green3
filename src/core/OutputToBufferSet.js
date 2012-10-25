Cube.core.OutputToBufferSet = function(attributes) {
    this.hasVertex = !!attributes.hasVertex;
    this.hasNormal = !!attributes.hasNormal;
    this.hasColor = !!attributes.hasColor;
    this.hasUV = !!attributes.hasUV;
    this.hasTangent = !!attributes.hasTangent;
    this.hasIndex = !!attributes.hasIndex;
    this.factory = attributes.factory;

    this.vertex = null;
    this.normal = null;
    this.color = null;
    this.uv = null;
    this.tangent = null;
    this.index = null;
};

Cube.core.OutputToBufferSet.prototype = {};
Cube.core.OutputToBufferSet.prototype.constructor = Cube.core.OutputToBufferSet;

Cube.core.OutputToBufferSet.prototype.begin = function(vertexCount, indexCount) {
    if (!!this.hasVertex) {
	    this.vertex = [];
    }

    if (!!this.hasNormal) {
	    this.normal = [];
    }

    if (!!this.hasColor) {
	    this.color = [];
    }

    if (!!this.hasUV) {
	    this.uv = [];
    }

    if (!!this.hasTangent) {
        this.tangent = [];
    }

    if (!!this.hasIndex) {
	    this.index = [];
    }
};

Cube.core.OutputToBufferSet.prototype.end = function() {
    var bufferSetAttributes = {
	    factory: this.factory
    };

    if (!!this.hasVertex) {
	    bufferSetAttributes.vertex = new Float32Array(this.vertex);
    }

    if (!!this.hasNormal) {
	    bufferSetAttributes.normal = new Float32Array(this.normal);
    }
    if (!!this.hasColor) {
	    bufferSetAttributes.color = new Float32Array(this.color);
    }

    if (!!this.hasUV) {
	    bufferSetAttributes.uv = new Float32Array(this.uv);
    }

    if (!!this.hasTangent) {
        bufferSetAttributes.tangent = new Float32Array(this.tangent);
    }

    if (!!this.hasIndex) {
	    bufferSetAttributes.index = new Uint16Array(this.index);
    }

    return new Cube.core.BufferSetNode(bufferSetAttributes); // <== 
};

Cube.core.OutputToBufferSet.prototype.addVertex = function(x, y, z) {
    if (!this.hasVertex) {
	    return; // <== 
    }

    this.vertex.push(x);
    this.vertex.push(y);
    this.vertex.push(z);
};

Cube.core.OutputToBufferSet.prototype.addNormal = function(x, y, z) {
    if (!this.hasNormal) {
	    return; // <== 
    }

    this.normal.push(x);
    this.normal.push(y);
    this.normal.push(z);
};

Cube.core.OutputToBufferSet.prototype.addColor = function(r, g, b, a) {
    if (!this.hasColor) {
	    return; // <== 
    }

    this.color.push(r);
    this.color.push(g);
    this.color.push(b);
    this.color.push(a);
};

Cube.core.OutputToBufferSet.prototype.addUV = function(u, v) {
    if (!this.hasUV) {
	    return; // <== 
    }

    this.uv.push(u);
    this.uv.push(v);
};

Cube.core.OutputToBufferSet.prototype.addTangent = function(x, y, z, w) {
    if (!this.hasTangent) {
        return; // <== 
    }

    this.tangent.push(x);
    this.tangent.push(y);
    this.tangent.push(z);
    this.tangent.push(w);
};

Cube.core.OutputToBufferSet.prototype.addTriplet = function(p1, p2, p3) {
    if (!this.hasIndex) {
	    return; // <== 
    }

    this.index.push(p1);
    this.index.push(p2);
    this.index.push(p3);
};
