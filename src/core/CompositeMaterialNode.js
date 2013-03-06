Cube.core.MaterialLayerNode = function (attributes) {
    Cube.core.ExperimentalNode.call(this, attributes);

    this.isFirst = !!attributes.isFirst | false;
    this.isLast = !!attributes.isLast | false;
};

Cube.core.MaterialLayerNode.prototype = new Cube.core.ExperimentalNode({});
Cube.core.MaterialLayerNode.prototype.constructor = Cube.core.MaterialLayerNode;

Cube.core.MaterialLayerNode.prototype.doRaw = function(gl) {
    if (this.isFirst && this.isLast) {
        return; // <== do nothing.
    }

    gl.enable(gl.STENCIL_TEST);

    if (this.isFirst) {
        gl.stencilFunc(gl.ALWAYS, 0x01, 0xFF);
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        return; // <== 
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.depthMask(false);
    gl.disable(gl.DEPTH_TEST);
    gl.stencilFunc(gl.EQUAL, 0x01, 0xFF);

    if (this.isLast) {
        gl.stencilOp(gl.KEEP, gl.REPLACE, gl.KEEP);
    }
    else {
        gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
    }
};

// -----

Cube.core.CompositeMaterialNode = function (attributes) {
    Cube.core.Node.call(this, attributes);

    this.nodes = new Cube.core.ArrayNode({});
    this.isTransparent = !!attributes.isTransparent;
    this.proxyNode = attributes.proxyNode || null;

    for (var i = 0; i < attributes.layers.length; ++i) {
        this.nodes.push(attributes.layers[i].material,
                        new Cube.core.MaterialLayerNode({isFirst: (i == 0),
                                                         isLast: (i == attributes.layers.length - 1)}),
                        new Cube.core.CompositeMaterialNode.ContextCBNode({owner: this}));
    }
};

Cube.core.CompositeMaterialNode.prototype = new Cube.core.Node({});
Cube.core.CompositeMaterialNode.prototype.constructor = Cube.core.CompositeMaterialNode;
Cube.core.CompositeMaterialNode.prototype.accept = function(visitor) {
    visitor.visitCompositeMaterialBegin(this);
    this.nodes.accept(visitor);
    visitor.visitCompositeMaterialEnd(this);
};
Cube.core.CompositeMaterialNode.prototype.setProxyNode = function(proxyNode) {
    this.proxyNode = proxyNode;
};
Cube.core.CompositeMaterialNode.prototype.getProxyNode = function() {
    return this.proxyNode;
};

Cube.core.CompositeMaterialNode.ContextCBNode = function(attributes) {
    Cube.core.Node.call(this, attributes);
    this.owner = attributes.owner;
};

Cube.core.CompositeMaterialNode.ContextCBNode.prototype = new Cube.core.Node({});
Cube.core.CompositeMaterialNode.ContextCBNode.prototype.constructor = Cube.core.CompositeMaterialNode.ContextCBNode;

Cube.core.CompositeMaterialNode.ContextCBNode.prototype.accept = function(visitor) {
    this.owner.getProxyNode().accept(visitor);
};

