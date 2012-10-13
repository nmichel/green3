Cube.core.FaceCameraNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    var bridge = new Cube.core.FaceCameraNode.BridgeNode({parent: attributes.reference,
                                                          target: this});
    this.reference = attributes.reference;
    this.bridge = bridge;
};

Cube.core.FaceCameraNode.prototype = new Cube.core.TransformNode({});
Cube.core.FaceCameraNode.prototype.constructor = Cube.core.FaceCameraNode;

Cube.core.FaceCameraNode.prototype.link = function(reference) {
    var bridge = new Cube.core.FaceCameraNode.BridgeNode({parent: reference,
                                                          target: this});
    this.reference = reference;
    this.bridge = bridge;
};

Cube.core.FaceCameraNode.prototype.unlink = function() {
    this.reference.removeChild(this.bridge);
    this.bridge = null;
    this.reference = null;
};

Cube.core.FaceCameraNode.prototype.updateLocal = function() {
    this.getLocalMatrix().setRotationFrom(this.reference.getMatrix());
    return Cube.core.TransformNode.prototype.updateLocal.call(this);
};

Cube.core.FaceCameraNode.BridgeNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);
    this.target = attributes.target;
};

Cube.core.FaceCameraNode.BridgeNode.prototype = new Cube.core.TransformNode({});
Cube.core.FaceCameraNode.BridgeNode.prototype.constructor = Cube.core.FaceCameraNode.BridgeNode;

Cube.core.FaceCameraNode.BridgeNode.prototype.updateLocal = function() {
    this.target.update();
};
