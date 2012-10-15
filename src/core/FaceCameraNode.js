Cube.core.FaceCameraNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.reference = attributes.reference;
};

Cube.core.FaceCameraNode.prototype = new Cube.core.TransformNode({});
Cube.core.FaceCameraNode.prototype.constructor = Cube.core.FaceCameraNode;

Cube.core.FaceCameraNode.prototype.updateLocal = function() {
    this.getLocalMatrix().setRotationFrom(this.reference.getMatrix());
    return Cube.core.TransformNode.prototype.updateLocal.call(this);
};
