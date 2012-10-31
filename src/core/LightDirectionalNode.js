Cube.core.LightDirectionalNode = function(attributes) {
    this.color = attributes.color || [0.0, 0.0, 0.0, 0.0];
    this.direction = attributes.direction || [0.0, -1.0, 0.0, 0.0];
};

Cube.core.LightDirectionalNode.prototype = new Cube.core.Node({});
Cube.core.LightDirectionalNode.prototype.constructor = Cube.core.LightDirectionalNode;

Cube.core.LightDirectionalNode.prototype.getColor = function() {
    return this.color;
};

Cube.core.LightDirectionalNode.prototype.getDirection = function() {
    return this.direction;
};

Cube.core.LightDirectionalNode.prototype.accept = function(visitor) {
    visitor.visitLightDirectional(this);
};

