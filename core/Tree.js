Cube.core.Tree = function (attributes) {

    checkRoot(attributes.root);

    this.root = attributes.root;

    Cube.core.Node.call(this, attributes);
};

Cube.core.Tree.prototype = new Cube.core.Node({});
Cube.core.Tree.prototype.constructor = Cube.core.Tree;

Cube.core.Tree.prototype.checkRoot = function(root) {
    checkReference(root);
    checkType(root, Cube.core.Node, "root should be Cube.core.Node");
};

