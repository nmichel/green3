Cube.core.Tree = function (attributes) {

    this.root = null;

    Cube.core.Node.call(this, attributes);
};

Cube.core.Tree.prototype = new Cube.core.Node();
Cube.core.Tree.prototype.constructor = Cube.core.Tree;

Cube.core.Tree.prototype.checkProperty = function (name, value) {
    var funcs = {
	root: Cube.core.Tree.prototype.setRoot
    };
    return funcs[name].call(this, value);
};

Cube.core.Tree.prototype.setRoot = function(root) {
    if (!root || !(root instanceof Cube.core.Node)) {
	throw "Must be a non null reference on a Core.core.Node like object"; // <== 
    }
    
    return root; // <== 
};

