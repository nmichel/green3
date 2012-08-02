Cube.core.StatePopNode = function (attributes) {
    Cube.core.Node.call(this, attributes);
};

Cube.core.StatePopNode.prototype = new Cube.core.Node();
Cube.core.StatePopNode.prototype.constructor = Cube.core.StatePopNode;

Cube.core.StatePopNode.prototype.accept = function (visitor) {
    visitor.visitStatePop();
};

Cube.core.StatePopNode.prototype.checkProperty = function (name, value) {
    throw new TypeError("No property");
};