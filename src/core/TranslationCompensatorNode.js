Cube.core.TranslationCompensatorNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.reference = attributes.reference;
};

Cube.core.TranslationCompensatorNode.prototype = new Cube.core.TransformNode({});
Cube.core.TranslationCompensatorNode.prototype.constructor = Cube.core.TranslationCompensatorNode;

Cube.core.TranslationCompensatorNode.prototype.update = function() {
    // TODO : VERY UGLY : add a method to Matrix4 to either return a Vector3, OR a method to update a target matrix 
    // with the translation of reference matrix.
    // 
    var rawReferenceMatrix = this.reference.getMatrix().data;
    this.localMatrix.setTranslation(rawReferenceMatrix[3*4+0], rawReferenceMatrix[3*4+1], rawReferenceMatrix[3*4+2]);
    return Cube.core.TransformNode.prototype.update.call(this);
};

