Cube.core.Scene = function (attributes) {
    this.activeViewport = new Cube.core.ArrayNode({});
    this.activeCamera = new Cube.core.ArrayNode({});
    this.lights = new Cube.core.ArrayNode({});
    this.objects = new Cube.core.ArrayNode({});
    this.tree = new Cube.core.ArrayNode({nodes: [this.activeViewport, this.activeCamera, this.objects]});
};

Cube.core.Scene.prototype = {};
Cube.core.Scene.prototype.constructor = Cube.core.Scene;

Cube.core.Scene.prototype.setViewport = function(viewportNode) {
    this.activeViewport.clear();
    this.activeViewport.push(viewportNode);
    return this;
};

Cube.core.Scene.prototype.setCamera = function(cameraNode) {
    this.activeCamera.clear();
    this.activeCamera.push(cameraNode);
    return this;
};

Cube.core.Scene.prototype.addLight = function(lightNode) {
    this.lights.push(lightNode);
    return this;
};

Cube.core.Scene.prototype.addObject = function(objectNode) {
    objectNode.setScene(this);
    this.objects.push(objectNode);
    return this;
};

Cube.core.Scene.prototype.removeObject = function(objectNode) {
    // Note : after the object has been removed from the scene, its internal "enlighter" node is stil
    // referencing this Scene object. That pointer will be updated if the object is added into another scene.

    this.objects.remove(objectNode);
    return this;
};

Cube.core.Scene.prototype.getLights = function() {
    return this.lights;
};

Cube.core.Scene.prototype.visit = function(visitor) {
    this.tree.accept(visitor);
    return this;
};
