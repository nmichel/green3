Cube.core.FaceObjectNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    var bridge = new Cube.core.FaceObjectNode.BridgeNode({parent: attributes.reference,
                                                          target: this});
    this.reference = attributes.reference;
    this.bridge = bridge;
};

Cube.core.FaceObjectNode.prototype = new Cube.core.TransformNode({});
Cube.core.FaceObjectNode.prototype.constructor = Cube.core.FaceObjectNode;

Cube.core.FaceObjectNode.prototype.link = function(reference) {
    var bridge = new Cube.core.FaceObjectNode.BridgeNode({parent: reference,
                                                          target: this});
    this.reference = reference;
    this.bridge = bridge;
};

Cube.core.FaceObjectNode.prototype.unlink = function() {
    this.reference.removeChild(this.bridge);
    this.bridge = null;
    this.reference = null;
};

Cube.core.FaceObjectNode.prototype.updateLocal = function() {
    this.getLocalMatrix().setRotationFrom(this.reference.getInvert());
    return Cube.core.TransformNode.prototype.updateLocal.call(this);
};

Cube.core.FaceObjectNode.BridgeNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);
    this.target = attributes.target;
};

Cube.core.FaceObjectNode.BridgeNode.prototype = new Cube.core.TransformNode({});
Cube.core.FaceObjectNode.BridgeNode.prototype.constructor = Cube.core.FaceObjectNode.BridgeNode;

Cube.core.FaceObjectNode.BridgeNode.prototype.updateLocal = function() {
    this.target.update();
};
