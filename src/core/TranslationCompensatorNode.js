Cube.core.TranslationCompensatorNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    var bridge = new Cube.core.TranslationCompensatorNode.BridgeNode({parent: attributes.reference,
                                                                      target: this});
    this.reference = attributes.reference;
    this.bridge = bridge;
};

Cube.core.TranslationCompensatorNode.prototype = new Cube.core.TransformNode({});
Cube.core.TranslationCompensatorNode.prototype.constructor = Cube.core.TranslationCompensatorNode;

Cube.core.TranslationCompensatorNode.prototype.link = function(reference) {
    var bridge = new Cube.core.TranslationCompensatorNode.BridgeNode({parent: reference,
                                                                      target: this});
    this.reference = reference;
    this.bridge = bridge;
};

Cube.core.TranslationCompensatorNode.prototype.unlink = function() {
    this.reference.removeChild(this.bridge);
    this.bridge = null;
    this.reference = null;
};

Cube.core.TranslationCompensatorNode.prototype.updateLocal = function() {
    this.getLocalMatrix().setTranslationFrom(this.reference.getMatrix());
    return Cube.core.TransformNode.prototype.updateLocal.call(this);
};

Cube.core.TranslationCompensatorNode.BridgeNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);
    this.target = attributes.target;
};

Cube.core.TranslationCompensatorNode.BridgeNode.prototype = new Cube.core.TransformNode({});
Cube.core.TranslationCompensatorNode.BridgeNode.prototype.constructor = Cube.core.TranslationCompensatorNode.BridgeNode;

Cube.core.TranslationCompensatorNode.BridgeNode.prototype.updateLocal = function() {
    this.target.update();
};
