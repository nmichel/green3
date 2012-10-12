Cube.core.TransformNode = function (attributes) {
    Cube.core.Node.call(this, attributes);

    this.children = [];
    this.localMatrix = attributes.matrix || (new Cube.core.math.Matrix4()).initToIdentity();
    this.matrix = Cube.core.math.Matrix4.identity.clone();
    this.invert = Cube.core.math.Matrix4.identity.clone();
    this.normal = Cube.core.math.Matrix4.identity.clone();
    this.parent = attributes.parent || null;
    this.dirty = true;

    if (this.parent) {
        this.parent.addChild(this);
    }
};

Cube.core.TransformNode.prototype = new Cube.core.Node({});
Cube.core.TransformNode.prototype.constructor = Cube.core.TransformNode;

Cube.core.TransformNode.prototype.accept = function(visitor) {
    visitor.visitTransform(this);
};

Cube.core.TransformNode.prototype.setDirty = function() {
    this.dirty = true;
};

Cube.core.TransformNode.prototype.addChild = function(child) {
    this.children.push(child);
    return this;
};

Cube.core.TransformNode.prototype.removeChild = function(child) {
    this.children.filter(function(el) {return el != this});
    return this;
};

Cube.core.TransformNode.prototype.orphan = function() {
    if (this.parent) {
        this.parent.removeChild(this);
        this.parent = null;
    }
    return this;
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

Cube.core.TransformNode.prototype.updateLocal = function() {
    if (this.parent) {
        this.parent.getMatrix().multiplyTo(this.localMatrix, this.matrix);
    }
    else {
        this.localMatrix.copyTo(this.matrix);
    }

    this.dirty = false;

    this.matrix.invertTo(this.invert);
    this.invert.transposeTo(this.normal);
};

Cube.core.TransformNode.prototype.updateUpStream = function() {
    if (this.parent && this.parent.dirty) {
        this.parent.updateUpStream();
    }
    this.updateLocal();
};

Cube.core.TransformNode.prototype.updateDownStream = function() {
    this.children.forEach(function(elt) {
        elt.updateLocal();
        elt.updateDownStream();
    });
};

Cube.core.TransformNode.prototype.update = function(upstream) {
    if (this.parent) {
        this.parent.updateUpStream();
    }
    this.updateLocal();
    this.updateDownStream();
    return this;
};
