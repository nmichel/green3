Cube.core.LightSourceNode = function(attributes) {
    this.light = attributes.light;
    this.transform = attributes.transform || (new Cube.core.TransformNode({})).update();
};

Cube.core.LightSourceNode.prototype = new Cube.core.Node({});
Cube.core.LightSourceNode.prototype.constructor = Cube.core.LightSourceNode;

Cube.core.LightSourceNode.prototype.accept = function(visitor) {
    this.transform.accept(visitor);
    this.light.accept(visitor);
};

