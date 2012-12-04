Cube.core.Object = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.enlighter = new Cube.core.ObjectEnlighterNode({});
    this.nodes = new Cube.core.ArrayNode({nodes: [attributes.material, this.enlighter, attributes.transformation, attributes.geometry]});
};

Cube.core.Object.prototype = new Cube.core.Node({});
Cube.core.Object.prototype.constructor = Cube.core.Object;

Cube.core.Object.prototype.setScene = function(scene) {
    this.enlighter.setScene(scene);
};

Cube.core.Object.prototype.accept = function(visitor) {
    this.nodes.accept(visitor);
};
