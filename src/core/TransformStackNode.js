Cube.core.TransformStackNode = function (attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.transformations = new Cube.core.ArrayNode({});
};

Cube.core.TransformStackNode.prototype = new Cube.core.TransformNode({});
Cube.core.TransformStackNode.prototype.constructor = Cube.core.TransformStackNode;

Cube.core.TransformStackNode.prototype.push = function(transfo) {
    Cube.core.Utilities.checkReference(transfo, "transfo");
    Cube.core.Utilities.checkType(transfo, Cube.core.TransformNode, "transfo should be Cube.core.TransformNode");

    this.transformations.push(transfo);
    return this;
};

Cube.core.TransformStackNode.prototype.update = function() {
    this.transformations.nodes.reduce(
	function(prev, current) {
	    current.update();
	    return prev.multiplyToSelf(current.getMatrix())
	}, 
	this.matrix.initToIdentity());

    return Cube.core.TransformNode.prototype.update.call(this);
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
