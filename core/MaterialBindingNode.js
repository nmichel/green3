Cube.core.MaterialBindingNode = function (attributes) {
    Cube.core.Node.call(this, attributes);

    this.name = attributes.name;
    this.type = attributes.type;
    this.value = attributes.value;
};

Cube.core.MaterialBindingNode.prototype = new Cube.core.Node({});
Cube.core.MaterialBindingNode.prototype.constructor = Cube.core.MaterialBindingNode;

Cube.core.MaterialBindingNode.prototype.getParameterName = function() {
    return this.name;
};

Cube.core.MaterialBindingNode.prototype.getParameterType = function() {
    return this.type;
};

Cube.core.MaterialBindingNode.prototype.getParameterValue = function() {
    return this.value;
};

Cube.core.MaterialBindingNode.prototype.accept = function (visitor) {
    visitor.visitMaterialBinding(this);
};
