/* Generated on Fri, 21 Sep 2012 14:50:43 +0200
*/ 
var Cube = {};

Cube.core = {}
Cube.core.math = {};
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

Cube.core.math.Matrix4 = function() {
    this.data = new Float32Array(16);
};

Cube.core.math.Matrix4.prototype = {
    constructor: Cube.core.math.Matrix4,

    clone: function() {
	return (new Cube.core.math.Matrix4()).initFromRawData(this.data);
    },

    initToIdentity: function() {
	return this.initFromRawData(this.rawdata_identity);
    },

    initFromRawData: function(data) {
	var i;
	for (i = 0; i < 16; ++i) {
	    this.data[i] = data[i];
	}
	return this;
    },

    getRawData: function() {
	return this.data;
    },

    setElement: function(x, y, v) {
	this.data[y*4+x] = v;
	return this;
    },

    multiply: function(other) {
	var res = this.clone();
	return res.multiplyToSelf(other);
    },

    invertToSelf: function() {
	// -----
	// http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
	// -----

	var td = this.data;

	var m00 = td[0*4+0], m01 = td[1*4+0], m02 = td[2*4+0], m03 = td[3*4+0];
	var m10 = td[0*4+1], m11 = td[1*4+1], m12 = td[2*4+1], m13 = td[3*4+1];
	var m20 = td[0*4+2], m21 = td[1*4+2], m22 = td[2*4+2], m23 = td[3*4+2];
	var m30 = td[0*4+3], m31 = td[1*4+3], m32 = td[2*4+3], m33 = td[3*4+3];

	var det = this.determinant();

	td[0*4+0] = m12*m23*m31 - m13*m22*m31 + m13*m21*m32 - m11*m23*m32 - m12*m21*m33 + m11*m22*m33;
	td[1*4+0] = m03*m22*m31 - m02*m23*m31 - m03*m21*m32 + m01*m23*m32 + m02*m21*m33 - m01*m22*m33;
	td[2*4+0] = m02*m13*m31 - m03*m12*m31 + m03*m11*m32 - m01*m13*m32 - m02*m11*m33 + m01*m12*m33;
	td[3*4+0] = m03*m12*m21 - m02*m13*m21 - m03*m11*m22 + m01*m13*m22 + m02*m11*m23 - m01*m12*m23;

	td[0*4+1] = m13*m22*m30 - m12*m23*m30 - m13*m20*m32 + m10*m23*m32 + m12*m20*m33 - m10*m22*m33;
	td[1*4+1] = m02*m23*m30 - m03*m22*m30 + m03*m20*m32 - m00*m23*m32 - m02*m20*m33 + m00*m22*m33;
	td[2*4+1] = m03*m12*m30 - m02*m13*m30 - m03*m10*m32 + m00*m13*m32 + m02*m10*m33 - m00*m12*m33;
	td[3*4+1] = m02*m13*m20 - m03*m12*m20 + m03*m10*m22 - m00*m13*m22 - m02*m10*m23 + m00*m12*m23;
	
	td[0*4+2] = m11*m23*m30 - m13*m21*m30 + m13*m20*m31 - m10*m23*m31 - m11*m20*m33 + m10*m21*m33;
	td[1*4+2] = m03*m21*m30 - m01*m23*m30 - m03*m20*m31 + m00*m23*m31 + m01*m20*m33 - m00*m21*m33;
	td[2*4+2] = m01*m13*m30 - m03*m11*m30 + m03*m10*m31 - m00*m13*m31 - m01*m10*m33 + m00*m11*m33;
	td[3*4+2] = m03*m11*m20 - m01*m13*m20 - m03*m10*m21 + m00*m13*m21 + m01*m10*m23 - m00*m11*m23;

	td[0*4+3] = m12*m21*m30 - m11*m22*m30 - m12*m20*m31 + m10*m22*m31 + m11*m20*m32 - m10*m21*m32;
	td[1*4+3] = m01*m22*m30 - m02*m21*m30 + m02*m20*m31 - m00*m22*m31 - m01*m20*m32 + m00*m21*m32;
	td[2*4+3] = m02*m11*m30 - m01*m12*m30 - m02*m10*m31 + m00*m12*m31 + m01*m10*m32 - m00*m11*m32;
	td[3*4+3] = m01*m12*m20 - m02*m11*m20 + m02*m10*m21 - m00*m12*m21 - m01*m10*m22 + m00*m11*m22;

	return this.scaleToSelf(1/det);
    },

    determinant: function() {
	var td = this.data;
	var m00 = td[0*4+0], m01 = td[1*4+0], m02 = td[2*4+0], m03 = td[3*4+0];
	var m10 = td[0*4+1], m11 = td[1*4+1], m12 = td[2*4+1], m13 = td[3*4+1];
	var m20 = td[0*4+2], m21 = td[1*4+2], m22 = td[2*4+2], m23 = td[3*4+2];
	var m30 = td[0*4+3], m31 = td[1*4+3], m32 = td[2*4+3], m33 = td[3*4+3];
	var value =
	    m03*m12*m21*m30 - m02*m13*m21*m30 - m03*m11*m22*m30 + m01*m13*m22*m30+
	    m02*m11*m23*m30 - m01*m12*m23*m30 - m03*m12*m20*m31 + m02*m13*m20*m31+
	    m03*m10*m22*m31 - m00*m13*m22*m31 - m02*m10*m23*m31 + m00*m12*m23*m31+
	    m03*m11*m20*m32 - m01*m13*m20*m32 - m03*m10*m21*m32 + m00*m13*m21*m32+
	    m01*m10*m23*m32 - m00*m11*m23*m32 - m02*m11*m20*m33 + m01*m12*m20*m33+
	    m02*m10*m21*m33 - m00*m12*m21*m33 - m01*m10*m22*m33 + m00*m11*m22*m33;
	return value;
    },
    
    multiplyToSelf: function(other) {
	var td = this.data;
	var od = other.data;

	var m00 = td[0*4+0], m01 = td[1*4+0], m02 = td[2*4+0], m03 = td[3*4+0];
	var m10 = td[0*4+1], m11 = td[1*4+1], m12 = td[2*4+1], m13 = td[3*4+1];
	var m20 = td[0*4+2], m21 = td[1*4+2], m22 = td[2*4+2], m23 = td[3*4+2];
	var m30 = td[0*4+3], m31 = td[1*4+3], m32 = td[2*4+3], m33 = td[3*4+3];

	var o00 = od[0*4+0], o01 = od[1*4+0], o02 = od[2*4+0], o03 = od[3*4+0];
	var o10 = od[0*4+1], o11 = od[1*4+1], o12 = od[2*4+1], o13 = od[3*4+1];
	var o20 = od[0*4+2], o21 = od[1*4+2], o22 = od[2*4+2], o23 = od[3*4+2];
	var o30 = od[0*4+3], o31 = od[1*4+3], o32 = od[2*4+3], o33 = od[3*4+3];

	td[0*4+0] = m00 * o00 + m01 * o10 + m02 * o20 + m03 * o30;
	td[1*4+0] = m00 * o01 + m01 * o11 + m02 * o21 + m03 * o31;
	td[2*4+0] = m00 * o02 + m01 * o12 + m02 * o22 + m03 * o32;
	td[3*4+0] = m00 * o03 + m01 * o13 + m02 * o23 + m03 * o33;

	td[0*4+1] = m10 * o00 + m11 * o10 + m12 * o20 + m13 * o30;
	td[1*4+1] = m10 * o01 + m11 * o11 + m12 * o21 + m13 * o31;
	td[2*4+1] = m10 * o02 + m11 * o12 + m12 * o22 + m13 * o32;
	td[3*4+1] = m10 * o03 + m11 * o13 + m12 * o23 + m13 * o33;

	td[0*4+2] = m20 * o00 + m21 * o10 + m22 * o20 + m23 * o30;
	td[1*4+2] = m20 * o01 + m21 * o11 + m22 * o21 + m23 * o31;
	td[2*4+2] = m20 * o02 + m21 * o12 + m22 * o22 + m23 * o32;
	td[3*4+2] = m20 * o03 + m21 * o13 + m22 * o23 + m23 * o33;

	td[0*4+3] = m30 * o00 + m31 * o10 + m32 * o20 + m33 * o30;
	td[1*4+3] = m30 * o01 + m31 * o11 + m32 * o21 + m33 * o31;
	td[2*4+3] = m30 * o02 + m31 * o12 + m32 * o22 + m33 * o32;
	td[3*4+3] = m30 * o03 + m31 * o13 + m32 * o23 + m33 * o33;

	return this;
    },

    scaleToSelf: function(factor) {
	var i;
	var td = this.data;
	for (i = 0; i < 4*4; ++i) {
	    td[i] *= factor;
	}
	return this;
    },
    
    transposeToSelf: function() {
	var td = this.data;
	var tmp;
	
	tmp = td[ 1]; td[ 1] = td[ 4]; td[ 4] = tmp;
	tmp = td[ 2]; td[ 2] = td[ 8]; td[ 8] = tmp;
	tmp = td[ 6]; td[ 6] = td[ 9]; td[ 9] = tmp;
	tmp = td[ 3]; td[ 3] = td[12]; td[12] = tmp;
	tmp = td[ 7]; td[ 7] = td[13]; td[13] = tmp;
	tmp = td[11]; td[11] = td[14]; td[14] = tmp;
	
	return this;
    }
};

Cube.core.math.Matrix4.prototype.rawdata_identity = [1, 0, 0, 0,
						     0, 1, 0, 0,
						     0, 0, 1, 0,
						     0, 0, 0, 1];Cube.core.Utilities = {
    buildName: (function() {
	var id = 0;
	return function() {
	    return "Node" + id++;
	};
    })(),

    checkReference: function(ref, msg) {
	if (!ref) {
	    throw "invalid reference " + (msg || "");
	}
    },

    checkType: function (ref, type, msg) {
	if (!(ref instanceof type)) {
	    throw "unexpected type " + (msg || "");
	}
    }
};
Cube.core.Visitor = function () {
    this.depth = 0;
    this.prefix = "";
};

Cube.core.Visitor.prototype = {};
Cube.core.Visitor.prototype.constructor = Cube.core.Visitor;

Cube.core.Visitor.prototype.visitArrayBegin = function(length) {
    this.depth += 1;
    this.prefix = this.prefix.concat(" ");
};

Cube.core.Visitor.prototype.visitArrayEnd = function() {
    this.depth -= 1;
    this.prefix = this.prefix.substr(0, this.depth);
};

Cube.core.Visitor.prototype.visitStatePush = function() {
    print(this.prefix, "PUSH");
};

Cube.core.Visitor.prototype.visitStatePop = function() {
    print(this.prefix, "POP");
};

Cube.core.Visitor.prototype.visitGeometry = function(geometryNode) {
    print(this.prefix, "Geometry");
};

Cube.core.Visitor.prototype.visitMaterial = function(materialNode) {
    print(this.prefix, "Material");
};

Cube.core.Visitor.prototype.visitTransform = function(transformation) {
    print(this.prefix, "Transform");
};

Cube.core.Visitor.prototype.visitTransformStack = function(transformation) {
    print(this.prefix, "TransformStack");
};

Cube.core.Visitor.prototype.visitOptic = function(transformation) {
    print(this.prefix, "Optic");
};
Cube.core.RenderVisitor = function (attributes) {
    Cube.core.Utilities.checkType(attributes.renderer, Cube.core.Renderer, "attribute.renderer should be of type Cube.core.Renderer");

    this.renderer = attributes.renderer;
};

Cube.core.RenderVisitor.prototype = {};
Cube.core.RenderVisitor.prototype.constructor = Cube.core.RenderVisitor;

Cube.core.RenderVisitor.prototype.visitArrayBegin = function(length) {
};

Cube.core.RenderVisitor.prototype.visitArrayEnd = function() {
};

Cube.core.RenderVisitor.prototype.visitViewport = function(viewportNode) {
    this.renderer.setViewport(viewportNode.getX(), viewportNode.getY(), viewportNode.getWidth(), viewportNode.getHeight());
};

Cube.core.RenderVisitor.prototype.visitOptic = function(opticNode) {
    this.renderer.loadProjectionTransformation(opticNode.getMatrix());
};

Cube.core.RenderVisitor.prototype.visitTransform = function(transformNode) {
    this.renderer.loadModelTransformation(transformNode.getMatrix());
    this.renderer.loadNormalTransformation(transformNode.getNormal());
};

Cube.core.RenderVisitor.prototype.visitView = function(viewNode) {
    this.renderer.loadViewTransformation(viewNode.getInvert());
};

Cube.core.RenderVisitor.prototype.visitBufferSet = function(bufferSetNode) {
    // FIXME : awkward ! rendering mode is hardwired ...
    // 
    this.renderer.renderBufferSet(this.renderer.mode.ELEMENT, bufferSetNode);
};

Cube.core.RenderVisitor.prototype.visitShader = function(shaderNode) {
    this.renderer.useShader(shaderNode);
};

Cube.core.RenderVisitor.prototype.visitTexture = function(textureNode) {
    this.renderer.useTexture(textureNode);
};

Cube.core.RenderVisitor.prototype.visitMaterial = function(materialNode) {
    this.renderer.setTransparentMode(materialNode.isTransparent());
};

Cube.core.RenderVisitor.prototype.visitMaterialBinding = function(materialBindingNode) {
    var paramName = materialBindingNode.getParameterName();
    var paramType = materialBindingNode.getParameterType();
    var paramValue = materialBindingNode.getParameterValue();
    this.renderer.bindShaderParamWithValue(paramName, paramType, paramValue);
};
Cube.core.Node = function(attributes) {
    this.name = attributes.name || Cube.core.Utilities.buildName();
};

Cube.core.Node.prototype = {};
Cube.core.Node.prototype.constructor = Cube.core.Node;

Cube.core.Node.prototype.accept = null;
Cube.core.ArrayNode = function(attributes) {
    Cube.core.Node.call(this, attributes);
    
    this.checkNodes(attributes.nodes);

    this.nodes = attributes.nodes || [];
};

Cube.core.ArrayNode.prototype = new Cube.core.Node({});
Cube.core.ArrayNode.prototype.constructor = Cube.core.ArrayNode;

Cube.core.ArrayNode.prototype.accept = function(visitor) {
    visitor.visitArrayBegin(this.nodes.length);
    var i;
    for (i = 0; i < this.nodes.length; ++i) {
	var node = this.nodes[i];
	node.accept(visitor);
    }
    visitor.visitArrayEnd();
};

Cube.core.ArrayNode.prototype.push = function(node) {
    this.checkNode(node);
    this.nodes.push(node);
};

Cube.core.ArrayNode.prototype.clear = function(fromIdx) {
    this.nodes.splice(fromIdx);
    return this;
};

Cube.core.ArrayNode.prototype.checkNode = function(node) {
    Cube.core.Utilities.checkReference(node, "node");
    Cube.core.Utilities.checkType(node, Cube.core.Node, "node should be Cube.core.Node");
};

Cube.core.ArrayNode.prototype.checkNodes = function(nodes) {
    if (!nodes) {
	return; // <== 
    }
    
    Cube.core.Utilities.checkType(nodes, Array, "nodes shoud be Array");
    
    var i;
    for (i = 0; i < nodes.length; ++i) {
	Cube.core.Utilities.checkReference(nodes[i], "nodes[i]");
	Cube.core.Utilities.checkType(nodes[i], Cube.core.Node, "nodes["+i+"] should be Cube.core.Node");
    }
};
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
Cube.core.OutputToBufferSet = function(attributes) {
    this.hasVertex = !!attributes.hasVertex;
    this.hasNormal = !!attributes.hasNormal;
    this.hasColor = !!attributes.hasColor;
    this.hasUV = !!attributes.hasUV;
    this.hasIndex = !!attributes.hasIndex;
    this.factory = attributes.factory;

    this.vertex = null;
    this.normal = null;
    this.color = null;
    this.uv = null;
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

Cube.core.OutputToBufferSet.prototype.addTriplet = function(p1, p2, p3) {
    if (!this.hasIndex) {
	return; // <== 
    }

    this.index.push(p1);
    this.index.push(p2);
    this.index.push(p3);
};
Cube.core.GeometryNode = function (attributes) {
    Cube.core.Node.call(this, attributes);
};

Cube.core.GeometryNode.prototype = new Cube.core.Node({});
Cube.core.GeometryNode.prototype.constructor = Cube.core.GeometryNode;

Cube.core.GeometryNode.prototype.accept = function (visitor) {
    visitor.visitGeometry(this);
};
Cube.core.MeshNode = function (attributes) {

    checkGeometry(attributes.geometry);
    checkMaterial(attributes.material);

    this.geometry = attributes.geometry;
    this.material = attributes.material;

    this.nodes.push(this.material);
    this.nodes.push(this.geometry);

    Cube.core.ArrayNode.call(this, attributes);

};

Cube.core.MeshNode.prototype = new Cube.core.ArrayNode({});
Cube.core.MeshNode.prototype.constructor = Cube.core.MeshNode;

Cube.core.MeshNode.prototype.checkGeometry = function(geometry) {
    Cube.core.Utilities.checkReference(geometry);
    Cube.core.Utilities.checkType(geometry, Cube.core.GeometryNode);
    return geometry;
};

Cube.core.MeshNode.prototype.checkMaterial = function(material) {
    Cube.core.Utilities.checkReference(material);
    Cube.core.Utilities.checkType(material, Cube.core.MaterialNode);
    return material;
};
Cube.core.OpticNode = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.matrix = (new Cube.core.math.Matrix4()).initToIdentity();

    this.setup(attributes);
};

Cube.core.OpticNode.prototype = new Cube.core.Node({});
Cube.core.OpticNode.prototype.constructor = Cube.core.OpticNode;

Cube.core.OpticNode.prototype.accept = function(visitor) {
    visitor.visitOptic(this);
};

Cube.core.OpticNode.prototype.setup = function(attributes) {
    Cube.core.Utilities.checkReference(attributes);

    this.fov  = attributes.fov || this.default_fov;
    this.ratio  = attributes.ratio || this.default_ratio;
    this.near  = attributes.near || this.default_near;
    this.far  = attributes.far || this.default_far;

    this.updateMatrix();
};

Cube.core.OpticNode.prototype.updateMatrix = function() {

    var top = this.near * Math.tan(this.fov * 0.5);
    var bottom = -top;

    var right = top * this.ratio;
    var left = -right;

    var doubleznear = 2.0 * this.near;
    var one_deltax = 1.0 / (right - left);
    var one_deltay = 1.0 / (top - bottom);
    var one_deltaz = 1.0 / (this.far - this.near);

    this.matrix.initFromRawData([
	doubleznear * one_deltax,
	0.0,
	0.0,
	0.0,
	0.0,
	doubleznear * one_deltay,
	0.0,
	0.0,
	(right + left) * one_deltax,
	(top + bottom) * one_deltay,
	-(this.far + this.near) * one_deltaz,
	-1.0,
	0.0,
	0.0,
	-(this.far * doubleznear) * one_deltaz,
	0.0]);
};

Cube.core.OpticNode.prototype.getMatrix = function() {
    return this.matrix;
};

Cube.core.OpticNode.prototype.default_fov = Math.PI / 2.0;
Cube.core.OpticNode.prototype.default_ratio = 1.0;
Cube.core.OpticNode.prototype.default_near = 1.0;
Cube.core.OpticNode.prototype.default_far = 1000.0;
Cube.core.TransformNode = function (attributes) {
    Cube.core.Node.call(this, attributes);

    this.checkParent(attributes.parent);
    this.checkMatrix(attributes.matrix);

    this.matrix = attributes.matrix || (new Cube.core.math.Matrix4()).initToIdentity();
    this.invert = this.matrix.clone().invertToSelf();
    this.normal = this.invert.clone().transposeToSelf();
    this.parent = attributes.parent || null;
};

Cube.core.TransformNode.prototype = new Cube.core.Node({});
Cube.core.TransformNode.prototype.constructor = Cube.core.TransformNode;

Cube.core.TransformNode.prototype.accept = function(visitor) {
    visitor.visitTransform(this);
};

Cube.core.TransformNode.prototype.getMatrix = function() {
    return this.matrix;
};

Cube.core.TransformNode.prototype.getInvert = function() {
    return this.invert;
};

Cube.core.TransformNode.prototype.getNormal = function() {
    return this.normal;
};

Cube.core.TransformNode.prototype.update = function() {
    if (this.parent) {
	this.matrix = this.parent.getMatrix().multiply(this.matrix);
    }
    this.invert = this.matrix.clone().invertToSelf();
    this.normal = this.invert.clone().transposeToSelf();
    return this;
};

Cube.core.TransformNode.prototype.checkMatrix = function(matrix) {
    if (matrix) {
	Cube.core.Utilities.checkType(matrix, Cube.core.math.Matrix4, "matrix should be Cube.core.math.Matrix4");
    }
};

Cube.core.TransformNode.prototype.checkParent = function(parent) {
    if (parent) {
	Cube.core.Utilities.checkType(parent, Cube.core.TransformNode, "parent should be Cube.core.TransformNode");
    }
};
Cube.core.RotationXYZNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.vector = attributes.vector;
    
    this.update();
};

Cube.core.RotationXYZNode.prototype = new Cube.core.TransformNode({});
Cube.core.RotationXYZNode.prototype.constructor = Cube.core.RotationXYZNode;

Cube.core.RotationXYZNode.prototype.set = function(x, y, z) {
    if (!!x) {
	this.vector.setX(x);
    }
    if (!!y) {
	this.vector.setY(y);
    }
    if (!!z) {
	this.vector.setZ(z);
    }
};

Cube.core.RotationXYZNode.prototype.update = function() {
    // -----
    // "general rotation"
    // cf. http://en.wikipedia.org/wiki/Rotation_matrix
    // 
    // "Other Ways to Build a Rotation Matrix") (Inverting all sine terms to change handedness (from left to right))
    // cf. http://www.fastgraph.com/makegames/3drotation/
    // -----

    var v = this.vector;
    var matrix = this.getMatrix();

    var x = v.x, y = v.y, z = v.z;
    var cosX = Math.cos(x), sinX = Math.sin(x);
    var cosY = Math.cos(y), sinY = Math.sin(y);
    var cosZ = Math.cos(z), sinZ = Math.sin(z);

    var cosZsinX = cosZ * sinX,
        sinXsinZ = sinX * sinZ,
        cosXcosZ = cosX * cosZ;

    matrix.setElement(0, 0, cosY * cosZ);
    matrix.setElement(0, 1, cosY * -sinZ);
    matrix.setElement(0, 2, sinY);
    matrix.setElement(1, 0, cosZsinX * sinY + sinZ * cosX);
    matrix.setElement(1, 1, sinXsinZ * -sinY + cosXcosZ);
    matrix.setElement(1, 2, -sinX * cosY);
    matrix.setElement(2, 0, cosXcosZ * -sinY + sinXsinZ);
    matrix.setElement(2, 1, cosX * sinY * sinZ + cosZsinX);
    matrix.setElement(2, 2, cosX * cosY);

    return Cube.core.TransformNode.prototype.update.call(this);
};
Cube.core.ScalingNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.vector = attributes.vector;
    
    this.update();
};

Cube.core.ScalingNode.prototype = new Cube.core.TransformNode({});
Cube.core.ScalingNode.prototype.constructor = Cube.core.ScalingNode;

Cube.core.RotationXYZNode.prototype.set = function(x, y, z) {
    if (!!x) {
	this.vector.setX(x);
    }
    if (!!y) {
	this.vector.setY(y);
    }
    if (!!z) {
	this.vector.setZ(z);
    }
};

Cube.core.ScalingNode.prototype.update = function() {
    var v = this.vector;
    var matrix = this.getMatrix();

    matrix.setElement(0, 0, v.x);
    matrix.setElement(1, 1, v.y);
    matrix.setElement(2, 2, v.z);

    return Cube.core.TransformNode.prototype.update.call(this);
};
Cube.core.TranslationNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.vector = attributes.vector;
    
    this.update();
};

Cube.core.TranslationNode.prototype = new Cube.core.TransformNode({});
Cube.core.TranslationNode.prototype.constructor = Cube.core.TranslationNode;

Cube.core.RotationXYZNode.prototype.set = function(x, y, z) {
    if (!!x) {
	this.vector.setX(x);
    }
    if (!!y) {
	this.vector.setY(y);
    }
    if (!!z) {
	this.vector.setZ(z);
    }
};

Cube.core.TranslationNode.prototype.update = function() {
    var v = this.vector;
    var matrix = this.getMatrix();

    matrix.setElement(0, 3, v.getX());
    matrix.setElement(1, 3, v.getY());
    matrix.setElement(2, 3, v.getZ());

    return Cube.core.TransformNode.prototype.update.call(this);
};
Cube.core.TransformStackNode = function (attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.transformations = new Cube.core.ArrayNode({});
};

Cube.core.TransformStackNode.prototype = new Cube.core.TransformNode({});
Cube.core.TransformStackNode.prototype.constructor = Cube.core.TransformStackNode;

Cube.core.TransformStackNode.prototype.push = function(transfo) {
    Cube.core.Utilities.checkReference(transfo, "transfo");
    Cube.core.Utilities.checkType(transfo, Cube.core.TransformNode, "transfo should be Cube.core.TransformNode");

    this.transformations.push(transfo);
    return this;
};

Cube.core.TransformStackNode.prototype.update = function() {
    this.transformations.nodes.reduce(
	function(prev, current) {
	    current.update();
	    return prev.multiplyToSelf(current.getMatrix())
	}, 
	this.matrix.initToIdentity());

    return Cube.core.TransformNode.prototype.update.call(this);
};

Cube.core.TransformStackNode.prototype.compact = function(fromIdx) {
    var compactedMatrix = this.transformations.nodes.reduce(
	function(prev, current, idx) {
	    if (idx < fromIdx) {
		return prev; // <== 
	    }
	    return prev.multiplyToSelf(current.getMatrix())
	}, 
	(new Cube.core.math.Matrix4()).initToIdentity());

    this.transformations
	.clear(fromIdx)
	.push(new Cube.core.TransformNode({matrix: compactedMatrix}));

    return this;
};
Cube.core.StatePopNode = function (attributes) {
    Cube.core.Node.call(this, attributes);
};

Cube.core.StatePopNode.prototype = new Cube.core.Node({});
Cube.core.StatePopNode.prototype.constructor = Cube.core.StatePopNode;

Cube.core.StatePopNode.prototype.accept = function (visitor) {
    visitor.visitStatePop();
};
Cube.core.StatePushNode = function (attributes) {
    Cube.core.Node.call(this, attributes);
};

Cube.core.StatePushNode.prototype = new Cube.core.Node({});
Cube.core.StatePushNode.prototype.constructor = Cube.core.StatePushNode;

Cube.core.StatePushNode.prototype.accept = function (visitor) {
    visitor.visitStatePush();
};
Cube.core.ViewNode = function (attributes) {
    Cube.core.TransformNode.call(this, attributes);
};

Cube.core.ViewNode.prototype = new Cube.core.TransformNode({});
Cube.core.ViewNode.prototype.constructor = Cube.core.ViewNode;

Cube.core.ViewNode.prototype.accept = function(visitor) {
    visitor.visitView(this);
};

Cube.core.ViewportNode = function(attributes) {
    Cube.core.Node.call(this, attributes);
    
    this.x = attributes.x || 0;
    this.y = attributes.y || 0;
    this.w = attributes.width;
    this.h = attributes.height
};

Cube.core.ViewportNode.prototype = new Cube.core.Node({});
Cube.core.ViewportNode.prototype.constructor = Cube.core.ViewportNode;

Cube.core.ViewportNode.prototype.accept = function(visitor) {
    visitor.visitViewport(this);
};

Cube.core.ViewportNode.prototype.getX = function() {
    return this.x;
};

Cube.core.ViewportNode.prototype.getY = function() {
    return this.y;
};

Cube.core.ViewportNode.prototype.getWidth = function() {
    return this.w;
};

Cube.core.ViewportNode.prototype.getHeight = function() {
    return this.h;
};
Cube.core.GeometryHelpers = {
    buildSphere: function(radius, output) {
        var nbSlices = 20,
        nbPoints = (nbSlices+1)*(2*nbSlices+1),
        nbFaces = nbSlices * 2 * nbSlices
        nbTris = nbFaces * 2,
        nbIndices = nbTris * 3;
	
	output.begin(nbPoints, nbIndices);

        var startLatitudes = -Math.PI/2.0,
            stopLatitudes = Math.PI/2.0,
            deltaLatitude = (stopLatitudes - startLatitudes) / nbSlices,
            startLongitudes = 0,
            stopLongitudes = 2.0 * Math.PI,
            deltaLongitude = (stopLongitudes - startLongitudes) / (2 * nbSlices);

	var iterLat;
        for (iterLat = 0; iterLat <= nbSlices; ++iterLat) {
            var latitude = startLatitudes + iterLat * (stopLatitudes - startLatitudes) / nbSlices,
                y = Math.sin(latitude),
                rad = Math.cos(latitude),
                v = (1.0 - iterLat / nbSlices);

	    var iterLong;
            for (iterLong = 0; iterLong <= 2*nbSlices; ++iterLong) {
                var longitude = startLongitudes + iterLong * (stopLongitudes - startLongitudes) / (2 * nbSlices),
                    x = Math.cos(longitude) * rad,
                    z = Math.sin(longitude) * rad,
                    u = (1.0 - iterLong / (nbSlices*2));

		output.addVertex(x*radius, y*radius, z*radius);
		output.addNormal(x, y, z);
		output.addColor(x, y, z, 1.0);
            }
        }

	var pInd = 0;
        var nbPointsPerLat = nbSlices * 2 + 1,
	    latitude;
        for (latitude = 0; latitude < nbSlices; ++latitude) {
            var base = latitude * nbPointsPerLat,
	        longitude;
            for (longitude = 0; longitude < nbSlices*2; ++longitude) {
                var p1 = base + longitude,
                    p2 = base + longitude + 1,
                    p3 = base + nbPointsPerLat + longitude,
                    p4 = base + nbPointsPerLat + longitude + 1;

		output.addTriplet(p1, p3, p2);
		output.addTriplet(p2, p3, p4);
            }
        }

	return output.end();
    },

    buildCube: function(halfSide, output) {
	var verts = [  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,   // v0,v1,v2,v3 (front)
		       1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,   // v0,v3,v4,v5 (right)
		       1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,   // v0,v5,v6,v1 (top)
		      -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,   // v1,v6,v7,v2 (left)
		      -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,   // v7,v4,v3,v2 (bottom)
		       1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]; // v4,v7,v6,v5 (back)

	var uvs = [  1, 1,   0, 1,   0, 0,   1, 0,   // v0,v1,v2,v3 (front)
		     1, 1,   0, 1,   0, 0,   1, 0,   // v0,v3,v4,v5 (right)
		     1, 1,   0, 1,   0, 0,   1, 0,   // v0,v5,v6,v1 (top)
		     1, 1,   0, 1,   0, 0,   1, 0,   // v1,v6,v7,v2 (left)
		     1, 1,   0, 1,   0, 0,   1, 0,   // v7,v4,v3,v2 (bottom)
		     1, 1,   0, 1,   0, 0,   1, 0 ]; // v4,v7,v6,v5 (back)

	var normals = [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   // v0,v1,v2,v3 (front)
			 1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   // v0,v3,v4,v5 (right)
			 0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   // v0,v5,v6,v1 (top)
			-1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,   // v1,v6,v7,v2 (left)
			 0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,   // v7,v4,v3,v2 (bottom)
			 0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1 ]; // v4,v7,v6,v5 (back)

	var colors = [ 1, 1, 1,   1, 1, 0,   1, 0, 0,   1, 0, 1,   // v0,v1,v2,v3 (front)
		       1, 1, 1,   1, 0, 1,   0, 0, 1,   0, 1, 1,   // v0,v3,v4,v5 (right)
		       1, 1, 1,   0, 1, 1,   0, 1, 0,   1, 1, 0,   // v0,v5,v6,v1 (top)
		       1, 1, 0,   0, 1, 0,   0, 0, 0,   1, 0, 0,   // v1,v6,v7,v2 (left)
		       0, 0, 0,   0, 0, 1,   1, 0, 1,   1, 0, 0,   // v7,v4,v3,v2 (bottom)
		       0, 0, 1,   0, 0, 0,   0, 1, 0,   0, 1, 1 ]; // v4,v7,v6,v5 (back)

	var indices = [ 0, 1, 2,   2, 3, 0,      // front
			4, 5, 6,   6, 7, 4,      // right
			8, 9,10,  10,11, 8,      // top
			12,13,14,  14,15,12,     // left
			16,17,18,  18,19,16,     // bottom
			20,21,22,  22,23,20 ];   // back

	output.begin(verts.length/3, indices.length);

	var iterVert;
	for (iterVert = 0; iterVert < verts.length/3; ++iterVert) {
	    var offset = iterVert * 3;
	    var uvOffset = iterVert * 2;
	    output.addVertex(verts[offset]*halfSide, verts[offset+1]*halfSide, verts[offset+2]*halfSide);
	    output.addNormal(normals[offset], normals[offset+1], normals[offset+2]);
	    output.addColor(colors[offset], colors[offset+1], colors[offset+2], 1.0);
	    output.addUV(uvs[uvOffset], uvs[uvOffset+1]);
	}

	for (iterInd = 0; iterInd < indices.length/6; ++iterInd) {
	    var offset = iterInd*6;
	    output.addTriplet(indices[offset], indices[offset+1], indices[offset+2]);
	    output.addTriplet(indices[offset+3], indices[offset+4], indices[offset+5]);
	}

	return output.end();
    }
};
Cube.core.ShaderNode = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.manager = attributes.manager;
    this.name = attributes.name;
    this.program = null;
};

Cube.core.ShaderNode.prototype = new Cube.core.Node({});
Cube.core.ShaderNode.prototype.constructor = Cube.core.ShaderNode;

Cube.core.ShaderNode.prototype.getProgram = function() {
    if (this.program == null) {
	this.program = this.manager.createProgram(this.name);
    }
    return this.program;
};

Cube.core.ShaderNode.prototype.getBindings = function() {
    if (this.program == null) {
	this.program = this.manager.createProgram(this.name);
    }
    return this.manager.getBindings(this.name);
};

Cube.core.ShaderNode.prototype.getParamTypes = function() {
    return this.manager.getParamTypes(this.name);
};

Cube.core.ShaderNode.prototype.accept = function(visitor) {
    visitor.visitShader(this);
};

Cube.core.TextureNode = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.manager = attributes.manager;
    this.name = attributes.name;
    this.texture = null;
    this.ready = false;
};

Cube.core.TextureNode.prototype = new Cube.core.Node({});
Cube.core.TextureNode.prototype.constructor = Cube.core.TextureNode;

Cube.core.TextureNode.prototype.getName = function() {
    return this.name;
};

Cube.core.TextureNode.prototype.isReady = function() {
    return this.ready;
};

Cube.core.TextureNode.prototype.getTexture = function() {
    return this.texture;
};

Cube.core.TextureNode.prototype.accept = function(visitor) {
    visitor.visitTexture(this);
};
Cube.core.ResourceLoader = function() {
};

Cube.core.ResourceLoader.prototype = {};
Cube.core.ResourceLoader.prototype.constructor = Cube.core.ResourceLoader;

Cube.core.ResourceLoader.prototype.getResource = function(name) {
    return document.getElementById(name).text;
};
Cube.core.ShaderManager = function (attributes) {
    this.engine = attributes.engine;
    this.gl = attributes.engine.gl;
    this.loader = attributes.loader;

    this.vertexs = {}; // each entry : "vN" : (null | ShaderObject)
    this.fragments = {}; // each entry : "fN" : (null | ShaderObject)
    this.programs = {}; // each entry : "name": {verts: ["v1", ..., "vN"], frags: ["f1", ... "fN"], prog: null | ProgramObject}

    this.shaders = this.createShaders(attributes.shaders);
};

Cube.core.ShaderManager.prototype = {};
Cube.core.ShaderManager.prototype.constructor = Cube.core.ShaderManager;

Cube.core.ShaderManager.prototype.getShader = function(name) {
    return this.shaders[name];
};

Cube.core.ShaderManager.prototype.getBindings = function(name) {
    return this.programs[name].bindings;
};

Cube.core.ShaderManager.prototype.getParamTypes = function(name) {
    return this.programs[name].params;
};

Cube.core.ShaderManager.prototype.createShaders = function(shaderDescs) {
    var res = {};
    for (shaderName in shaderDescs) {
	var desc = shaderDescs[shaderName];
	var progDesc = {verts: [], frags: [], params: desc.params, mappings: desc.mappings};
	this.programs[shaderName] = progDesc;
	for (var i = 0; i < desc.src.length; ++i) {
	    var subShadName = desc.src[i];
	    if (subShadName.toLowerCase().indexOf("vertex") != -1) {
		progDesc.verts.push(subShadName);
	    }
	    else if (subShadName.toLowerCase().indexOf("fragment") != -1) {
		progDesc.frags.push(subShadName);
	    }
	    else {
		// 
	    }
	}
	res[shaderName] = new Cube.core.ShaderNode({manager: this, name: shaderName});
	if (desc.preload) {
	    res[shaderName].getProgram();
	}
    }
    return res;
};

Cube.core.ShaderManager.prototype.createVertexShader = function(text) {
    var shader = this.createShader(text, this.gl.VERTEX_SHADER);
    return shader;
};

Cube.core.ShaderManager.prototype.createFragmentShader = function(text) {
    var shader = this.createShader(text, this.gl.FRAGMENT_SHADER);
    return shader;
};

Cube.core.ShaderManager.prototype.createShader = function(text, kind) {
    var shader = this.gl.createShader(kind);
    this.gl.shaderSource(shader, text);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
	var lastError = this.gl.getShaderInfoLog(shader);
	this.gl.deleteShader(shader); // Don't know if we need this.
        throw "Failed to compile shader [" + lastError + "]"; // <== 
    }
    return shader;
};

Cube.core.ShaderManager.prototype.createProgram = function(name) {
    // Build the program, loading missing shaders
    // 
    var progDesc = this.programs[name];
    var program = this.gl.createProgram();
    for (var i = 0; i < progDesc.verts.length; ++i) {
	var subShadName = progDesc.verts[i];
	if (this.vertexs[subShadName] == null) {
	    this.vertexs[subShadName] = this.createVertexShader(this.loader.getResource(subShadName));
	}
	this.gl.attachShader(program, this.vertexs[subShadName]);
    }
    for (var i = 0; i < progDesc.frags.length; ++i) {
	var subShadName = progDesc.frags[i];
	if (this.fragments[subShadName] == null) {
	    this.fragments[subShadName] = this.createFragmentShader(this.loader.getResource(subShadName));
	}
	this.gl.attachShader(program, this.fragments[subShadName]);
    }
    this.gl.linkProgram(program);
    var linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (!linked) {
	var lastError = this.gl.getProgramInfoLog(program);
	this.gl.deleteProgram(program);
	throw "Error in program linking [" + lastError + "]"; // <==
    }
    
    this.gl.useProgram(program);

    // Load standard bindings 
    // 
    // Note : resolving an uniform or attrib can fail, even if it is declared. The shader compiler strips off unused 
    // symbols, and so one will be unable to resolve such objects.
    // 
    var varMapping = {uniforms: {},
		      attributes: {}};
    for (var name in this.engine.getRenderer().shaderParameters.uniforms) {
	var binding = this.gl.getUniformLocation(program, name);
	if (!binding && progDesc.mappings) {
	    var mapping = progDesc.mappings.uniforms[name];
	    binding = this.gl.getUniformLocation(program, mapping);
	}
	if (binding) {
	    varMapping.uniforms[name] = binding;
	}
    }

    for (var name in this.engine.getRenderer().shaderParameters.attributes) {
	var binding = this.gl.getAttribLocation(program, name);
	if (binding < 0 && progDesc.mappings) {
	    var mapping = progDesc.mappings.attributes[name];
	    binding = this.gl.getAttribLocation(program, mapping);
	}
	if (binding >= 0) {
	    varMapping.attributes[name] = binding;
	}
    }

    // Load shader specific bindings
    // 
    for (var n in progDesc.params.uniforms) {
	var binding = this.gl.getUniformLocation(program, n);
	if (binding) {
	    varMapping.uniforms[n] = binding;
	}
    }

    progDesc.bindings = varMapping;

    return program;
};

Cube.core.TextureManager = function(attributes) {
    this.engine = attributes.engine;
    this.gl = attributes.engine.gl;
    this.textures = {};
    this.desc = {};
    for (var name in attributes.desc) {
	var desc = attributes.desc[name];
	this.desc[name] = desc;
	this.textures[name] = new Cube.core.TextureNode({manager: this, name: name});
    }
};

Cube.core.TextureManager.prototype = {};
Cube.core.TextureManager.prototype.constructor = Cube.core.TextureManager;

Cube.core.TextureManager.prototype.getTexture = function(name) {
    var texture = this.textures[name];
    if (!!texture && !texture.isReady()) {
	this.loadTexture(texture);
    }
    return texture;
};

Cube.core.TextureManager.prototype.loadTexture = function(texture) {
    var img = new Image();
    var tm = this;
    var gl = tm.gl;
    var desc = this.desc[texture.getName()]
    img.onload = function() {
	var magFilter = desc.quality == Cube.core.Renderer.prototype.textureQuality.POOR ? gl.NEAREST : gl.LINEAR;
	var minFilter = desc.quality == Cube.core.Renderer.prototype.textureQuality.POOR ? gl.NEAREST : (desc.quality == Cube.core.Renderer.prototype.textureQuality.GOOD ? gl.LINEAR : gl.LINEAR_MIPMAP_NEAREST);
	var textureObject = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, textureObject);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
	if (desc.quality == Cube.core.Renderer.prototype.textureQuality.BEST) {
	    gl.generateMipmap(gl.TEXTURE_2D);
	}
	gl.bindTexture(gl.TEXTURE_2D, null);

	texture.texture = textureObject;
	texture.ready = true;
    };
    img.src = desc.res;
};
Cube.core.MaterialBindingNode = function (attributes) {
    Cube.core.Node.call(this, attributes);

    this.name = attributes.name;
    this.type = attributes.type;
    this.value = attributes.value;
};

Cube.core.MaterialBindingNode.prototype = new Cube.core.Node({});
Cube.core.MaterialBindingNode.prototype.constructor = Cube.core.MaterialBindingNode;

Cube.core.MaterialBindingNode.prototype.getParameterName = function() {
    return this.name;
};

Cube.core.MaterialBindingNode.prototype.getParameterType = function() {
    return this.type;
};

Cube.core.MaterialBindingNode.prototype.getParameterValue = function() {
    return this.value;
};

Cube.core.MaterialBindingNode.prototype.accept = function (visitor) {
    visitor.visitMaterialBinding(this);
};
Cube.core.MaterialNode = function (attributes) {
    Cube.core.Node.call(this, attributes);

    this.transparent = attributes.transparent;
    this.nodes = new Cube.core.ArrayNode({});

    this.nodes.push(attributes.shader);
    for (var name in attributes.bindings) {
	var node = new Cube.core.MaterialBindingNode({name: name,
						      type: attributes.shader.getParamTypes().uniforms[name],
						      value: attributes.bindings[name]});
	this.nodes.push(node);
    }
};

Cube.core.MaterialNode.prototype = new Cube.core.Node({});
Cube.core.MaterialNode.prototype.constructor = Cube.core.MaterialNode;

Cube.core.MaterialNode.prototype.isTransparent = function (visitor) {
    return this.transparent;
};

Cube.core.MaterialNode.prototype.accept = function (visitor) {
    visitor.visitMaterial(this);
    this.nodes.accept(visitor);
};
Cube.core.CameraNode = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.opticNode = attributes.optic;
    this.viewNode = new Cube.core.ViewNode({parent: attributes.parent});
    this.viewNode.update();
};

Cube.core.CameraNode.prototype = new Cube.core.Node({});
Cube.core.CameraNode.prototype.constructor = Cube.core.CameraNode;

Cube.core.CameraNode.prototype.accept = function(visitor) {
    visitor.visitOptic(this.opticNode);
    visitor.visitView(this.viewNode);
};
Cube.core.Tree = function (attributes) {

    checkRoot(attributes.root);

    this.root = attributes.root;

    Cube.core.Node.call(this, attributes);
};

Cube.core.Tree.prototype = new Cube.core.Node({});
Cube.core.Tree.prototype.constructor = Cube.core.Tree;

Cube.core.Tree.prototype.checkRoot = function(root) {
    checkReference(root);
    checkType(root, Cube.core.Node, "root should be Cube.core.Node");
};

Cube.core.Engine = function(attributes) {

    var canvas = attributes.canvas;
    var gl = canvas.getContext('experimental-webgl',
			       {
				   alpha: true,
				   antialias: true,
				   stencil: true
			       });
    if (!gl) {
	throw "failed to created WebGL context"; // <== 
    }
    
    this.canvas = canvas;
    this.gl = gl;

    this.renderer = new Cube.core.Renderer({gl: gl});
//    this.bufferManager = new Cube.core.BufferManager({gl: gl});
};

Cube.core.Engine.prototype.constructor = Cube.core.Engine;

Cube.core.Engine.prototype.getRenderer = function() {
    return this.renderer;
};

//Cube.core.Engine.prototype.getBufferManager = function() {
//    return this.bufferManager;
//};

Cube.core.Renderer = function(attributes) {
    
    this.gl = attributes.gl;
    this.defaultClearFlags = 0;
    this.mappings = null;
    this.projectionTransfo = null;
    this.viewTransfo = null;
    this.bufferFactoryFunc = null;
    this.nextTextureUnit = 0;

    this.setup();
};

Cube.core.Renderer.prototype = {};

Cube.core.Renderer.prototype.mode = {
    POINT:   "point",
    ELEMENT: "element"
};

Cube.core.Renderer.prototype.textureQuality = {
    POOR: "poor",
    GOOD: "good",
    BEST: "best"
};

Cube.core.Renderer.prototype.shaderParameters = {
    uniforms: {
	matrixProjection: "matrixProjection",
	matrixModel:      "matrixModel",
	matrixNormal:     "matrixNormal",
	matrixView:       "matrixView"
    },
    attributes: {
	vertex: "vertex",
	normal: "normal",
	color:  "color",
	uv:     "uv"
    }
};

Cube.core.Renderer.prototype.shaderParameterTypes = {
    FLOAT: "float",
    VEC4: "vec4",
    TEXTURE2D: "texture2D"
};

Cube.core.Renderer.prototype.shaderDefaultParameterTypes = {
    texture0: Cube.core.Renderer.prototype.shaderParameterTypes.texture2D
};

Cube.core.Renderer.prototype.constructor = Cube.core.Renderer;

Cube.core.Renderer.prototype.getBufferFactory = function() {
    return this.bufferFactoryFunc;
};

Cube.core.Renderer.prototype.setup = function() {
    this.bufferFactoryFunc = (function (gl) {
	return function (isIndex, data) {
	    var buffer = gl.createBuffer();
	    var type = isIndex ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
	    gl.bindBuffer(type, buffer);
	    gl.bufferData(type, data, gl.STATIC_DRAW);
	    return buffer; // <== 
	};
    })(this.gl);

    this.defaultClearFlags = this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    // this.gl.enable(this.gl.BLEND);
    // this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    // this.gl.frontFace(this.gl.CCW); // Default
};

Cube.core.Renderer.prototype.setTransparentMode = function(toggle) {
    this.transparentMode = !!toggle;
};

Cube.core.Renderer.prototype.clear = function(buffers) {
    var bits = 0;
    if (!!buffers) {
	if (!!buffers.color) {
	    bits |= this.gl.COLOR_BUFFER_BIT;
	}
	if (!!buffers.depth) {
	    bits |= this.gl.DEPTH_BUFFER_BIT;
	}
	if (!!buffers.stencil) {
	    bits |= this.gl.STENCIL_BUFFER_BIT;
	}
    }
    else {
	bits = this.defaultClearFlags;
    }
    this.gl.clear(bits);

    // [TODO : move this code somewhere else]
    // 
    for (var i = 0; i < this.nextTextureUnit; ++i) {
	this.gl.activeTexture(this.gl.TEXTURE0 + i);
	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
    this.nextTextureUnit = 0;
};

Cube.core.Renderer.prototype.setViewport = function(x, y, w, h) {
    this.gl.viewport(x, y, w, h);
};

Cube.core.Renderer.prototype.loadMappings = function(mappings) {
    this.mappings = mappings;
    return this;
};

Cube.core.Renderer.prototype.loadProjectionTransformation = function(transfo) {
    this.projectionTransfo = transfo;
};

Cube.core.Renderer.prototype.loadViewTransformation = function(transfo) {
    this.viewTransfo = transfo;
};

Cube.core.Renderer.prototype.loadNormalTransformation = function(transfo) {
    var rawMatrix = transfo.getRawData();
    this.gl.uniformMatrix4fv(this.mappings.uniforms[this.shaderParameters.uniforms.matrixNormal], false, rawMatrix);
};

Cube.core.Renderer.prototype.loadModelTransformation = function(transfo) {
    var rawMatrix = transfo.getRawData();
    this.gl.uniformMatrix4fv(this.mappings.uniforms[this.shaderParameters.uniforms.matrixModel], false, rawMatrix);
};

Cube.core.Renderer.prototype.renderBufferSet = function(mode, bufferSet) {

    if (!bufferSet.vertexBuffer) {
	return; // <== 
    }

    if (mode == this.ELEMENT && !bufferSet.indexBuffer) {
	return; // <== 
    }

    if (!!bufferSet.normalBuffer) {
	this.gl.enableVertexAttribArray(this.mappings.attributes[this.shaderParameters.attributes.normal]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.normalBuffer.data);
	this.gl.vertexAttribPointer(this.mappings.attributes[this.shaderParameters.attributes.normal], 3, this.gl.FLOAT, false, 0, 0);
    }

    if (!!bufferSet.colorBuffer) {
	this.gl.enableVertexAttribArray(this.mappings.attributes[this.shaderParameters.attributes.color]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.colorBuffer.data);
	this.gl.vertexAttribPointer(this.mappings.attributes[this.shaderParameters.attributes.color], 4, this.gl.FLOAT, false, 0, 0);
    }

    if (!!bufferSet.uvBuffer) {
	this.gl.enableVertexAttribArray(this.mappings.attributes[this.shaderParameters.attributes.uv]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.uvBuffer.data);
	this.gl.vertexAttribPointer(this.mappings.attributes[this.shaderParameters.attributes.uv], 2, this.gl.FLOAT, false, 0, 0);
    }

    this.gl.enableVertexAttribArray(this.mappings.attributes[this.shaderParameters.attributes.vertex]);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.vertexBuffer.data);
    this.gl.vertexAttribPointer(this.mappings.attributes[this.shaderParameters.attributes.vertex], 3, this.gl.FLOAT, false, 0, 0);

    if (this.transparentMode) {
	this.gl.enable(this.gl.BLEND);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	this.gl.depthMask(false);
    }

    if (this.transparentMode) {
	this.gl.frontFace(this.gl.CW);
	if (mode == this.mode.ELEMENT) {
	    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferSet.indexBuffer.data);
	    this.gl.drawElements(this.gl.TRIANGLES, bufferSet.indexBuffer.size, this.gl.UNSIGNED_SHORT, 0);
	}
	else {
	    this.gl.drawArrays(this.gl.POINTS, 0, bufferSet.vertexBuffer.size/3);
	}
	this.gl.frontFace(this.gl.CCW);
    }

    if (mode == this.mode.ELEMENT) {
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferSet.indexBuffer.data);
	this.gl.drawElements(this.gl.TRIANGLES, bufferSet.indexBuffer.size, this.gl.UNSIGNED_SHORT, 0);
    }
    else {
	this.gl.drawArrays(this.gl.POINTS, 0, bufferSet.vertexBuffer.size/3);
    }

    this.gl.disable(this.gl.BLEND);
    this.gl.depthMask(true);
};

Cube.core.Renderer.prototype.useShader = function(shader) {
    this.gl.useProgram(shader.getProgram());
    this.loadMappings(shader.getBindings());
    this.loadPerFrameData();
};

Cube.core.Renderer.prototype.useTexture = function(texture) {
    if (this.mappings.uniforms[this.shaderParameters.uniforms.texture0]) {
	this.gl.activeTexture(this.gl.TEXTURE0);
	this.gl.bindTexture(this.gl.TEXTURE_2D, texture.getTexture());
    }
};

Cube.core.Renderer.prototype.bindShaderParamWithValue = function(name, type, value) {
    var param = this.mappings.uniforms[name];
    if (! param) {
	return; // <== 
    }

    if (type == this.shaderParameterTypes.FLOAT) {
	this.gl.uniform1f(param, value);
    }
    else if (type == this.shaderParameterTypes.VEC4) {
	this.gl.uniform4fv(param, value);
    }
    else if (type == this.shaderParameterTypes.TEXTURE2D) {
	this.gl.activeTexture(this.gl.TEXTURE0 + this.nextTextureUnit);
	this.gl.bindTexture(this.gl.TEXTURE_2D, value.getTexture());
	this.gl.uniform1i(param, this.nextTextureUnit);
	this.nextTextureUnit = this.nextTextureUnit + 1;
    }
    else {
	// unsupported data type :)
    }
};

Cube.core.Renderer.prototype.loadPerFrameData = function() {
    this.gl.uniformMatrix4fv(this.mappings.uniforms[this.shaderParameters.uniforms.matrixProjection], false, this.projectionTransfo.getRawData());
    this.gl.uniformMatrix4fv(this.mappings.uniforms[this.shaderParameters.uniforms.matrixView], false, this.viewTransfo.getRawData());
};
