Cube.core.ObjectEnlighterNode = function(attributes) {
    this.scene = attributes.scene || null;
};

Cube.core.ObjectEnlighterNode.prototype = new Cube.core.Node({});
Cube.core.ObjectEnlighterNode.prototype.constructor = Cube.core.ObjectEnlighterNode;

Cube.core.ObjectEnlighterNode.prototype.setScene = function(scene) {
    this.scene = scene;
};

Cube.core.ObjectEnlighterNode.prototype.accept = function(visitor) {
    this.scene.getLights().accept(visitor);
};
