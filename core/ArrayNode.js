Cube.core.ArrayNode = function (attributes) {

    this.nodes = [];

    Cube.core.Node.call(this, attributes);
};

Cube.core.ArrayNode.prototype = new Cube.core.Node();
Cube.core.ArrayNode.prototype.constructor = Cube.core.ArrayNode;

Cube.core.ArrayNode.prototype.accept = function (visitor) {
    visitor.visitArrayBegin(this.nodes.length);
    var i;
    for (i = 0; i < this.nodes.length; ++i) {
	var node = this.nodes[i];
	node.accept(visitor);
    }
    visitor.visitArrayEnd();
};

Cube.core.ArrayNode.prototype.checkProperty = function (name, value) {
    var funcs = {
	nodes: Cube.core.ArrayNode.prototype.setNodes
    };
    return funcs[name].call(this, value);
};

Cube.core.ArrayNode.prototype.setNodes = function(nodes) {
    if (!nodes || !(nodes instanceof Array)) {
	throw "Must be a non null reference on a Array of Core.core.Node like objects"; // <== 
    }
    
    var i;
    for (i = 0; i < nodes.length; ++i) {
	if (!nodes[i] || !(nodes[i] instanceof Cube.core.Node)) {
	    throw "Invalid element. Must be a valid reference to a Core.core.Node like object"; // <== 
	}
    }

    return nodes; // <== 
};
