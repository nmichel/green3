Cube.core.ViewportNode = function(attributes) {
    Cube.core.Node.call(this, attributes);
    
    this.x = attributes.x || 0;
    this.y = attributes.y || 0;
    this.w = attributes.width;
    this.h = attributes.height
};

Cube.core.ViewportNode.prototype = new Cube.core.Node({});
Cube.core.ViewportNode.prototype.constructor = Cube.core.ViewportNode;

Cube.core.ViewportNode.prototype.accept = function(visitor) {
    visitor.visitViewport(this);
};

Cube.core.ViewportNode.prototype.getX = function() {
    return this.x;
};

Cube.core.ViewportNode.prototype.getY = function() {
    return this.y;
};

Cube.core.ViewportNode.prototype.getWidth = function() {
    return this.w;
};

Cube.core.ViewportNode.prototype.getHeight = function() {
    return this.h;
};
