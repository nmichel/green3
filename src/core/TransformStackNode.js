Cube.core.TransformStackNode = function (attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.transformations = new Cube.core.ArrayNode({});
};

Cube.core.TransformStackNode.prototype = new Cube.core.TransformNode({});
Cube.core.TransformStackNode.prototype.constructor = Cube.core.TransformStackNode;

Cube.core.TransformStackNode.prototype.push = function(transfo) {
//    Cube.core.Utilities.checkReference(transfo, "transfo");
//    Cube.core.Utilities.checkType(transfo, Cube.core.TransformNode, "transfo should be Cube.core.TransformNode");

    // Transfo and bridge have special relationships
    // - transfo -parent-> bridge
    // - bridge -parent-> transfo
    //
    var upBridge = new Cube.core.TransformStackNode.BridgeNode({parent: transfo,
                                                                        target: this});
    transfo.setParent(upBridge);

    this.transformations.push(transfo);
    return this;
};

Cube.core.TransformStackNode.prototype.updateLocal = function() {
    this.transformations.nodes.reduce(
        function(prev, current) {
            current.updateLocal(); // Do *NOT* call update(). It will yield to an infinite recursion, because of the bridge.
            return prev.multiplyToSelf(current.getMatrix())
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
            return prev.multiplyToSelf(current.getMatrix())
        },
        (new Cube.core.math.Matrix4()).initToIdentity());
    
    this.transformations
        .clear(fromIdx)
        .push(new Cube.core.TransformNode({matrix: compactedMatrix}));
    
    return this;
};

// -----

Cube.core.TransformStackNode.BridgeNode = function(attributes) {
//    Cube.core.Utilities.checkReference(target, "target");
//    Cube.core.Utilities.checkType(target, Cube.core.TransformStackNode, "target should be Cube.core.TransformStackNode");

    Cube.core.TransformNode.call(this, attributes);

    this.target = attributes.target;
};

Cube.core.TransformStackNode.BridgeNode.prototype = new Cube.core.TransformNode({});
Cube.core.TransformStackNode.BridgeNode.prototype.constructor = Cube.core.TransformStackNode.BridgeNode;

Cube.core.TransformStackNode.BridgeNode.prototype.isDirty = function() {
    return true;
};

Cube.core.TransformStackNode.BridgeNode.prototype.findUpdateRoot = function() {
    return this.target.findUpdateRoot();
};

Cube.core.TransformStackNode.BridgeNode.prototype.setDirty = function() {
    this.target.setDirty();
};
