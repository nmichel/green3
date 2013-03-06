Cube.core.Object = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.nodes = new Cube.core.ArrayNode({});
    this.enlighter = new Cube.core.ObjectEnlighterNode({});

    if (attributes.material) {
        if (attributes.material instanceof Cube.core.MaterialNode) {
            this.nodes.push(attributes.material, this.enlighter, attributes.transformation, attributes.geometry);
        }
        else if (attributes.material instanceof Cube.core.CompositeMaterialNode) {
            this.nodes.push(new Cube.core.Object.CompositeMaterialContextProviderNode(
                {material: attributes.material,
                 nodes: [this.enlighter, attributes.transformation, attributes.geometry]}));
        }
    }
    if (attributes.submeshes) {
        for (var i = 0; i < attributes.submeshes.length; ++i) {
            var submesh = attributes.submeshes[i];
            if (submesh.material instanceof Cube.core.MaterialNode) {
                this.nodes.push(submesh.material, this.enlighter, attributes.transformation, attributes.geometry, submesh.geometry);
            }
            else if (submesh.material instanceof Cube.core.CompositeMaterialNode) {
                this.nodes.push(new Cube.core.Object.CompositeMaterialContextProviderNode(
                    {material: submesh.material,
                     nodes: [this.enlighter, this.enlighter, attributes.transformation, attributes.geometry]}));
            }
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

// -----

Cube.core.Object.CompositeMaterialContextProviderNode = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.nodes = new Cube.core.ArrayNode({nodes: attributes.nodes});
    this.material = attributes.material;
};

Cube.core.Object.CompositeMaterialContextProviderNode.prototype = new Cube.core.Node({});
Cube.core.Object.CompositeMaterialContextProviderNode.prototype.constructor = Cube.core.Object.CompositeMaterialContextProviderNode;

Cube.core.Object.CompositeMaterialContextProviderNode.prototype.accept = function(visitor) {
    var oldProxy = this.material.getProxyNode();
    this.material.setProxyNode(this.nodes);
    this.material.accept(visitor);
    this.material.setProxyNode(oldProxy);
};

