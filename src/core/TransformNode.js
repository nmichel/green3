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
