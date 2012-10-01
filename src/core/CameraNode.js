Cube.core.CameraNode = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.opticNode = attributes.optic;
    this.viewNode = new Cube.core.ViewNode({parent: attributes.parent});
    this.viewNode.update();
};

Cube.core.CameraNode.prototype = new Cube.core.Node({});
Cube.core.CameraNode.prototype.constructor = Cube.core.CameraNode;

Cube.core.CameraNode.prototype.getTransform = function() {
    return this.viewNode;
};

Cube.core.CameraNode.prototype.accept = function(visitor) {
    visitor.visitOptic(this.opticNode);
    visitor.visitView(this.viewNode);
};

Cube.core.CameraNode.prototype.update = function() {
    this.viewNode.update();
};
