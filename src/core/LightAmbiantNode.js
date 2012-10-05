Cube.core.LightAmbiantNode = function(attributes) {
    this.color = attributes.color || [0.0, 0.0, 0.0, 0.0];
};

Cube.core.LightAmbiantNode.prototype = new Cube.core.Node({});
Cube.core.LightAmbiantNode.prototype.constructor = Cube.core.LightAmbiantNode;

Cube.core.LightAmbiantNode.prototype.getColor = function() {
    return this.color;
};

Cube.core.LightAmbiantNode.prototype.accept = function(visitor) {
    visitor.visitLightAmbiant(this);
};

