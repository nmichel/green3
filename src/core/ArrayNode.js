Cube.core.ArrayNode = function(attributes) {
    Cube.core.Node.call(this, attributes);
    
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
    this.nodes.push(node);
};

Cube.core.ArrayNode.prototype.clear = function(fromIdx) {
    this.nodes.splice(fromIdx);
    return this;
};
