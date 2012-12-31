Cube.core.Object = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.nodes = new Cube.core.ArrayNode({});
    this.enlighter = new Cube.core.ObjectEnlighterNode({});

    if (attributes.material) {
        this.nodes.push(attributes.material, this.enlighter, attributes.transformation, attributes.geometry);
    }
    if (attributes.submeshes) {
        for (var i = 0; i < attributes.submeshes.length; ++i) {
            var submesh = attributes.submeshes[i];
            this.nodes.push(submesh.material, this.enlighter, attributes.transformation, attributes.geometry, submesh.geometry);
        }
    }
};

Cube.core.Object.prototype = new Cube.core.Node({});
Cube.core.Object.prototype.constructor = Cube.core.Object;

Cube.core.Object.prototype.setScene = function(scene) {
    this.enlighter.setScene(scene);
};

Cube.core.Object.prototype.accept = function(visitor) {
    this.nodes.accept(visitor);
};
