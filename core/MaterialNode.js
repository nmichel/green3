Cube.core.MaterialNode = function (attributes) {
    Cube.core.Node.call(this, attributes);

    this.shader = attributes.shader;
    this.bindings = attributes.bindings;
    this.transparent = attributes.transparent;
};

Cube.core.MaterialNode.prototype = new Cube.core.Node({});
Cube.core.MaterialNode.prototype.constructor = Cube.core.MaterialNode;

Cube.core.MaterialNode.prototype.getShader = function (visitor) {
    return this.shader;
};

Cube.core.MaterialNode.prototype.getBindings = function (visitor) {
    return this.bindings;
};

Cube.core.MaterialNode.prototype.isTransparent = function (visitor) {
    return this.transparent;
};

Cube.core.MaterialNode.prototype.accept = function (visitor) {
    visitor.visitMaterial(this);
};
