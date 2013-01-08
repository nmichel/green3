Cube.core.ExperimentalNode = function (attributes) {
    Cube.core.Node.call(this, attributes);
};

Cube.core.ExperimentalNode.prototype = new Cube.core.Node({});
Cube.core.ExperimentalNode.prototype.constructor = Cube.core.ExperimentalNode;

Cube.core.ExperimentalNode.prototype.accept = function(visitor) {
    visitor.visitExperimental(this);
};

Cube.core.ExperimentalNode.prototype.doRaw = null;
