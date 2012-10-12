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

    this.setDirty();

    return this;
};

Cube.core.ScalingNode.prototype.updateLocal = function() {
    var v = this.vector;
    var matrix = this.getLocalMatrix();

    matrix.setElement(0, 0, v.x);
    matrix.setElement(1, 1, v.y);
    matrix.setElement(2, 2, v.z);

    return Cube.core.TransformNode.prototype.updateLocal.call(this);
};
