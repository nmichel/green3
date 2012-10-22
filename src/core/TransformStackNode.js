Cube.core.TransformStackNode = function (attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.transformations = new Cube.core.ArrayNode({});
    this.upStream = new Cube.core.TransformStackNode.UpStreamBridgeNode({target: this});
    this.downStream = new Cube.core.TransformStackNode.DownStreamBridgeNode({target: this});
};

Cube.core.TransformStackNode.prototype = new Cube.core.TransformNode({});
Cube.core.TransformStackNode.prototype.constructor = Cube.core.TransformStackNode;

Cube.core.TransformStackNode.prototype.push = function(transfo) {
//    Cube.core.Utilities.checkReference(transfo, "transfo");
//    Cube.core.Utilities.checkType(transfo, Cube.core.TransformNode, "transfo should be Cube.core.TransformNode");

    // All nodes share upStream and downStream bridge nodes.
    // Note that transfo does not belong to upStream children set, neither it is the parent of downStream.
    // 
    transfo.setParent(this.upStream);
    transfo.addChild(this.downStream);

    this.transformations.push(transfo);
    return this;
};

Cube.core.TransformStackNode.prototype.at = function(index) {
    return this.transformations.at(index);
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

Cube.core.TransformStackNode.DownStreamBridgeNode = function(attributes) {
//    Cube.core.Utilities.checkReference(target, "target");
//    Cube.core.Utilities.checkType(target, Cube.core.TransformStackNode, "target should be Cube.core.TransformStackNode");

    Cube.core.TransformNode.call(this, attributes);

    this.target = attributes.target;
};

Cube.core.TransformStackNode.DownStreamBridgeNode.prototype = new Cube.core.TransformNode({});
Cube.core.TransformStackNode.DownStreamBridgeNode.prototype.constructor = Cube.core.TransformStackNode.DownStreamBridgeNode;

Cube.core.TransformStackNode.DownStreamBridgeNode.prototype.setDirty = function() {
    this.target.setDirty();
};

// -----

Cube.core.TransformStackNode.UpStreamBridgeNode = function(attributes) {
//    Cube.core.Utilities.checkReference(target, "target");
//    Cube.core.Utilities.checkType(target, Cube.core.TransformStackNode, "target should be Cube.core.TransformStackNode");

    Cube.core.TransformNode.call(this, attributes);

    this.target = attributes.target;
};

Cube.core.TransformStackNode.UpStreamBridgeNode.prototype = new Cube.core.TransformNode({});
Cube.core.TransformStackNode.UpStreamBridgeNode.prototype.constructor = Cube.core.TransformStackNode.UpStreamBridgeNode;

Cube.core.TransformStackNode.UpStreamBridgeNode.prototype.isDirty = function() {
    return true;
};

Cube.core.TransformStackNode.UpStreamBridgeNode.prototype.findUpdateRoot = function() {
    return this.target.findUpdateRoot();
};
