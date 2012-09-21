Cube.core.ArrayNode = function(attributes) {
    Cube.core.Node.call(this, attributes);
    
    this.checkNodes(attributes.nodes);

    this.nodes = attributes.nodes || [];
};

Cube.core.ArrayNode.prototype = new Cube.core.Node({});
Cube.core.ArrayNode.prototype.constructor = Cube.core.ArrayNode;

Cube.core.ArrayNode.prototype.accept = function(visitor) {
    visitor.visitArrayBegin(this.nodes.length);
    var i;
    for (i = 0; i < this.nodes.length; ++i) {
	var node = this.nodes[i];
	node.accept(visitor);
    }
    visitor.visitArrayEnd();
};

Cube.core.ArrayNode.prototype.push = function(node) {
    this.checkNode(node);
    this.nodes.push(node);
};

Cube.core.ArrayNode.prototype.clear = function(fromIdx) {
    this.nodes.splice(fromIdx);
    return this;
};

Cube.core.ArrayNode.prototype.checkNode = function(node) {
    Cube.core.Utilities.checkReference(node, "node");
    Cube.core.Utilities.checkType(node, Cube.core.Node, "node should be Cube.core.Node");
};

Cube.core.ArrayNode.prototype.checkNodes = function(nodes) {
    if (!nodes) {
	return; // <== 
    }
    
    Cube.core.Utilities.checkType(nodes, Array, "nodes shoud be Array");
    
    var i;
    for (i = 0; i < nodes.length; ++i) {
	Cube.core.Utilities.checkReference(nodes[i], "nodes[i]");
	Cube.core.Utilities.checkType(nodes[i], Cube.core.Node, "nodes["+i+"] should be Cube.core.Node");
    }
};
