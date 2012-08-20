Cube.core.Node = function(attributes) {
    this.name = (attributes ? attributes.name : null) || Cube.core.Utilities.buildName();
}

Cube.core.Node.prototype = {};
Cube.core.Node.prototype.constructor = Cube.core.Node;

Cube.core.Node.prototype.accept = null;
