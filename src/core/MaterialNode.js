Cube.core.MaterialNode = function (attributes) {
    Cube.core.Node.call(this, attributes);

    this.transparent = attributes.transparent;
    this.insideOut = attributes.insideOut;
    this.nodes = new Cube.core.ArrayNode({});
    this.nodesByName = {};

    this.nodes.push(attributes.shader);
    for (var name in attributes.bindings) {
        var node = new Cube.core.MaterialBindingNode({name: name,
                                                      type: attributes.shader.getParamTypes().uniforms[name],
                                                      value: attributes.bindings[name]});
    	this.nodes.push(node);
        this.nodesByName[name] = node;
    }
};

Cube.core.MaterialNode.prototype = new Cube.core.Node({});
Cube.core.MaterialNode.prototype.constructor = Cube.core.MaterialNode;

Cube.core.MaterialNode.prototype.getBinding = function(name) {
    return this.nodesByName[name];
};

Cube.core.MaterialNode.prototype.isTransparent = function (visitor) {
    return this.transparent;
};

Cube.core.MaterialNode.prototype.isInsideOut = function (visitor) {
    return this.insideOut;
};

Cube.core.MaterialNode.prototype.accept = function (visitor) {
    visitor.visitMaterial(this);
    this.nodes.accept(visitor);
};
