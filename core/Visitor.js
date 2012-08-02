Cube.core.Visitor = function () {
    this.depth = 0;
    this.prefix = "";
};

Cube.core.Visitor.prototype = new Object();
Cube.core.Visitor.prototype.constructor = Cube.core.Visitor;

Cube.core.Visitor.prototype.visitArrayBegin = function (length) {
    this.depth += 1;
    this.prefix = this.prefix.concat(" ");
};

Cube.core.Visitor.prototype.visitArrayEnd = function () {
    this.depth -= 1;
    this.prefix = this.prefix.substr(0, this.depth);
};

Cube.core.Visitor.prototype.visitStatePush = function () {
    print(this.prefix, "PUSH");
};

Cube.core.Visitor.prototype.visitStatePop = function () {
    print(this.prefix, "POP");
};
