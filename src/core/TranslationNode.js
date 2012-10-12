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

    this.setDirty();

    return this;
};

Cube.core.TranslationNode.prototype.updateLocal = function() {
    var v = this.vector;
    var matrix = this.getLocalMatrix();

    matrix.setElement(0, 3, v.getX());
    matrix.setElement(1, 3, v.getY());
    matrix.setElement(2, 3, v.getZ());

    return Cube.core.TransformNode.prototype.updateLocal.call(this);
};
