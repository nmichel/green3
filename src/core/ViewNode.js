Cube.core.ViewNode = function (attributes) {
    Cube.core.TransformNode.call(this, attributes);
};

Cube.core.ViewNode.prototype = new Cube.core.TransformNode({});
Cube.core.ViewNode.prototype.constructor = Cube.core.ViewNode;

Cube.core.ViewNode.prototype.accept = function(visitor) {
    visitor.visitView(this);
};

