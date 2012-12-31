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

Cube.core.ArrayNode.prototype.at = function(index) {
    return this.nodes[index];
};

Cube.core.ArrayNode.prototype.push = function() {
    var nb = arguments.length;
    for (var i = 0; i < nb; ++i) {
        this.nodes.push(arguments[i]);
    }
};

Cube.core.ArrayNode.prototype.clear = function(fromIdx) {
    this.nodes.splice(fromIdx);
    return this;
};

Cube.core.ArrayNode.prototype.remove = function(what) {
    var pos = this.nodes.indexOf(what);
    if (pos > -1) {
        this.nodes.splice(pos, 1);
    }
    return this;
};
