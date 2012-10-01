Cube.core.FaceObjectNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.reference = attributes.reference;
};

Cube.core.FaceObjectNode.prototype = new Cube.core.TransformNode({});
Cube.core.FaceObjectNode.prototype.constructor = Cube.core.FaceObjectNode;

Cube.core.FaceObjectNode.prototype.update = function() {
    this.localMatrix = this.reference.getInvert().cloneWithoutTranslation();
    return Cube.core.TransformNode.prototype.update.call(this);
};
