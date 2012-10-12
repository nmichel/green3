Cube.core.TranslationCompensatorNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.reference = attributes.reference;
};

Cube.core.TranslationCompensatorNode.prototype = new Cube.core.TransformNode({});
Cube.core.TranslationCompensatorNode.prototype.constructor = Cube.core.TranslationCompensatorNode;

Cube.core.TranslationCompensatorNode.prototype.updateLocal = function() {
    this.getLocalMatrix().setTranslationFrom(this.reference.getMatrix());
    return Cube.core.TransformNode.prototype.updateLocal.call(this);
};

