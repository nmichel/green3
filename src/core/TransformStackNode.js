Cube.core.TransformStackNode = function (attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.transformations = new Cube.core.ArrayNode({});
};

Cube.core.TransformStackNode.prototype = new Cube.core.TransformNode({});
Cube.core.TransformStackNode.prototype.constructor = Cube.core.TransformStackNode;

Cube.core.TransformStackNode.prototype.push = function(transfo) {
//    Cube.core.Utilities.checkReference(transfo, "transfo");
//    Cube.core.Utilities.checkType(transfo, Cube.core.TransformNode, "transfo should be Cube.core.TransformNode");

    this.transformations.push(new Cube.core.TransformStackNode.BridgeNode({compound: this,
                                                                           transfo: transfo}));
    return this;
};

Cube.core.TransformStackNode.prototype.updateLocal = function() {
    this.transformations.nodes.reduce(
        function(prev, current) {
            current.getTransfo().updateLocal();
            return prev.multiplyToSelf(current.getTransfo().getMatrix())
        }, 
        this.localMatrix.initToIdentity());

    return Cube.core.TransformNode.prototype.updateLocal.call(this);
};

Cube.core.TransformStackNode.prototype.compact = function(fromIdx) {
    var compactedMatrix = this.transformations.nodes.reduce(
        function(prev, current, idx) {
            if (idx < fromIdx) {
                return prev; // <== 
            }
            return prev.multiplyToSelf(current.getTranfo().getMatrix())
        },
        (new Cube.core.math.Matrix4()).initToIdentity());
    
    this.transformations
        .clear(fromIdx)
        .push(new Cube.core.TransformStackNode.BridgeNode({compound: this,
                                                           transfo: (new Cube.core.TransformNode({matrix: compactedMatrix}))}));
    
    return this;
};

Cube.core.TransformStackNode.BridgeNode = function(attributes) {
//    Cube.core.Utilities.checkReference(compound, "compound");
//    Cube.core.Utilities.checkType(transfo, Cube.core.TransformStackNode, "compound should be Cube.core.TransformStackNode");
//    Cube.core.Utilities.checkReference(transfo, "transfo");
//    Cube.core.Utilities.checkType(transfo, Cube.core.TransformNode, "transfo should be Cube.core.TransformNode");

    Cube.core.TransformNode.call(this, attributes);

    this.compound = attributes.compound;
    this.transfo = attributes.transfo;

    this.transfo.orphan(); // In case of VERY bad programming.
    this.transfo.parent = this; // uplink used to propagate local update on "tranfo" to compound update.
};

Cube.core.TransformStackNode.BridgeNode.prototype = new Cube.core.TransformNode({});
Cube.core.TransformStackNode.BridgeNode.prototype.constructor = Cube.core.TransformStackNode.BridgeNode;

Cube.core.TransformStackNode.BridgeNode.prototype.getTransfo = function() {
    return this.transfo;
};

Cube.core.TransformStackNode.BridgeNode.prototype.updateUpStream = function() {
    this.compound.update();
};
