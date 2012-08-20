Cube.core.GeometryNode = function (attributes) {
    Cube.core.Node.call(this, attributes);
};

Cube.core.GeometryNode.prototype = new Cube.core.Node({});
Cube.core.GeometryNode.prototype.constructor = Cube.core.GeometryNode;

Cube.core.GeometryNode.prototype.accept = function (visitor) {
    visitor.visitGeometry(this);
};
