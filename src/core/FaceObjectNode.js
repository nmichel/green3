Cube.core.FaceObjectNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.reference = attributes.reference;
};

Cube.core.FaceObjectNode.prototype = new Cube.core.TransformNode({});
Cube.core.FaceObjectNode.prototype.constructor = Cube.core.FaceObjectNode;

Cube.core.FaceObjectNode.prototype.updateLocal = function() {
    this.getLocalMatrix().setRotationFrom(this.reference.getInvert());
    return Cube.core.TransformNode.prototype.updateLocal.call(this);
};
