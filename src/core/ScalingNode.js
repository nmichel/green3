Cube.core.ScalingNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.vector = attributes.vector;
    
    this.update();
};

Cube.core.ScalingNode.prototype = new Cube.core.TransformNode({});
Cube.core.ScalingNode.prototype.constructor = Cube.core.ScalingNode;

Cube.core.ScalingNode.prototype.update = function() {
    var v = this.vector;
    var matrix = this.getMatrix();

    matrix.setElement(0, 0, v.x);
    matrix.setElement(1, 1, v.y);
    matrix.setElement(2, 2, v.z);

    return Cube.core.TransformNode.prototype.update.call(this);
};
