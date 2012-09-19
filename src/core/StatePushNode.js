Cube.core.StatePushNode = function (attributes) {
    Cube.core.Node.call(this, attributes);
};

Cube.core.StatePushNode.prototype = new Cube.core.Node({});
Cube.core.StatePushNode.prototype.constructor = Cube.core.StatePushNode;

Cube.core.StatePushNode.prototype.accept = function (visitor) {
    visitor.visitStatePush();
};
