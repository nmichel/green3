Cube.core.ShaderNode = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.manager = attributes.manager;
    this.name = attributes.name;
    this.program = null;
};

Cube.core.ShaderNode.prototype = new Cube.core.Node({});
Cube.core.ShaderNode.prototype.constructor = Cube.core.ShaderNode;

Cube.core.ShaderNode.prototype.getProgram = function() {
    if (this.program == null) {
	this.program = this.manager.createProgram(this.name);
    }
    return this.program;
};

Cube.core.ShaderNode.prototype.getBindings = function() {
    if (this.program == null) {
	this.program = this.manager.createProgram(this.name);
    }
    return this.manager.getBindings(this.name);
};

Cube.core.ShaderNode.prototype.getParamTypes = function() {
    return this.manager.getParamTypes(this.name);
};

Cube.core.ShaderNode.prototype.accept = function(visitor) {
    visitor.visitShader(this);
};

