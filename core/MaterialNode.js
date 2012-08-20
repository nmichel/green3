Cube.core.MaterialNode = function (attributes) {
    Cube.core.Node.call(this, attributes);
};

Cube.core.MaterialNode.prototype = new Cube.core.Node({});
Cube.core.MaterialNode.prototype.constructor = Cube.core.MaterialNode;

Cube.core.MaterialNode.prototype.accept = function (visitor) {
    visitor.visitMaterial(this);
};
