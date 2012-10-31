Cube.core.LightPositionalNode = function(attributes) {
    this.color = attributes.color || [0.0, 0.0, 0.0, 0.0];
    this.position = attributes.position || [0.0, 1.0, 0.0, 1.0];
};

Cube.core.LightPositionalNode.prototype = new Cube.core.Node({});
Cube.core.LightPositionalNode.prototype.constructor = Cube.core.LightPositionalNode;

Cube.core.LightPositionalNode.prototype.getColor = function() {
    return this.color;
};

Cube.core.LightPositionalNode.prototype.getPosition = function() {
    return this.position;
};

Cube.core.LightPositionalNode.prototype.accept = function(visitor) {
    visitor.visitLightPositional(this);
};

