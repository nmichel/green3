Cube.core.TextureNode = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.manager = attributes.manager;
    this.name = attributes.name;
    this.texture = null;
    this.ready = false;
};

Cube.core.TextureNode.prototype = new Cube.core.Node({});
Cube.core.TextureNode.prototype.constructor = Cube.core.TextureNode;

Cube.core.TextureNode.prototype.getName = function() {
    return this.name;
};

Cube.core.TextureNode.prototype.isReady = function() {
    return this.ready;
};

Cube.core.TextureNode.prototype.getTexture = function() {
    return this.texture;
};

Cube.core.TextureNode.prototype.accept = function(visitor) {
    visitor.visitTexture(this);
};
