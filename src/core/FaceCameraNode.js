Cube.core.FaceCameraNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.reference = attributes.reference;
};

Cube.core.FaceCameraNode.prototype = new Cube.core.TransformNode({});
Cube.core.FaceCameraNode.prototype.constructor = Cube.core.FaceCameraNode;

Cube.core.FaceCameraNode.prototype.update = function() {
    this.localMatrix = this.reference.getMatrix().cloneWithoutTranslation();
    return Cube.core.TransformNode.prototype.update.call(this);
};
