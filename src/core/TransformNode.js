Cube.core.TransformNode = function (attributes) {
    Cube.core.Node.call(this, attributes);

    this.localMatrix = attributes.matrix || (new Cube.core.math.Matrix4()).initToIdentity();
    this.parent = attributes.parent || null;

    Cube.core.TransformNode.prototype.update.call(this);
};

Cube.core.TransformNode.prototype = new Cube.core.Node({});
Cube.core.TransformNode.prototype.constructor = Cube.core.TransformNode;

Cube.core.TransformNode.prototype.accept = function(visitor) {
    visitor.visitTransform(this);
};

Cube.core.TransformNode.prototype.getLocalMatrix = function() {
    return this.localMatrix;
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
	this.matrix = this.parent.getMatrix().multiply(this.localMatrix);
    }
    else {
	this.matrix = this.localMatrix.clone();
    }

    this.invert = this.matrix.clone().invertToSelf();
    this.normal = this.invert.clone().transposeToSelf();
    return this;
};
