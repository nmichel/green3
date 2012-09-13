Cube.core.ShaderManager = function (attributes) {
    this.engine = attributes.engine;
    this.gl = attributes.engine.gl;
    this.loader = attributes.loader;

    this.vertexs = {}; // each entry : "vN" : (null | ShaderObject)
    this.fragments = {}; // each entry : "fN" : (null | ShaderObject)
    this.programs = {}; // each entry : "name": {verts: ["v1", ..., "vN"], frags: ["f1", ... "fN"], prog: null | ProgramObject}

    this.shaders = this.createShaders(attributes.shaders);
};

Cube.core.ShaderManager.prototype = {};
Cube.core.ShaderManager.prototype.constructor = Cube.core.ShaderManager;

Cube.core.ShaderManager.prototype.getShader = function(name) {
    return this.shaders[name];
};

Cube.core.ShaderManager.prototype.getBindings = function(name) {
    return this.programs[name].bindings;
};

Cube.core.ShaderManager.prototype.createShaders = function(shaderDescs) {
    var res = {};
    for (shaderName in shaderDescs) {
	var desc = shaderDescs[shaderName];
	var progDesc = {verts: [], frags: [], mappings: desc.mappings};
	this.programs[shaderName] = progDesc;
	for (var i = 0; i < desc.src.length; ++i) {
	    var subShadName = desc.src[i];
	    if (subShadName.toLowerCase().indexOf("vertex") != -1) {
		progDesc.verts.push(subShadName);
	    }
	    else if (subShadName.toLowerCase().indexOf("fragment") != -1) {
		progDesc.frags.push(subShadName);
	    }
	    else {
		// 
	    }
	}
	res[shaderName] = new Cube.core.ShaderNode({manager: this, name: shaderName});
	if (desc.preload) {
	    res[shaderName].getProgram();
	}
    }
    return res;
};

Cube.core.ShaderManager.prototype.createVertexShader = function(text) {
    var shader = this.createShader(text, this.gl.VERTEX_SHADER);
    return shader;
};

Cube.core.ShaderManager.prototype.createFragmentShader = function(text) {
    var shader = this.createShader(text, this.gl.FRAGMENT_SHADER);
    return shader;
};

Cube.core.ShaderManager.prototype.createShader = function(text, kind) {
    var shader = this.gl.createShader(kind);
    this.gl.shaderSource(shader, text);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
	var lastError = this.gl.getShaderInfoLog(shader);
	this.gl.deleteShader(shader); // Don't know if we need this.
        throw "Failed to compile shader [" + lastError + "]"; // <== 
    }
    return shader;
};

Cube.core.ShaderManager.prototype.createProgram = function(name) {
    // Build the program, loading missing shaders
    // 
    var progDesc = this.programs[name];
    var program = this.gl.createProgram();
    for (var i = 0; i < progDesc.verts.length; ++i) {
	var subShadName = progDesc.verts[i];
	if (this.vertexs[subShadName] == null) {
	    this.vertexs[subShadName] = this.createVertexShader(this.loader.getResource(subShadName));
	}
	this.gl.attachShader(program, this.vertexs[subShadName]);
    }
    for (var i = 0; i < progDesc.frags.length; ++i) {
	var subShadName = progDesc.frags[i];
	if (this.fragments[subShadName] == null) {
	    this.fragments[subShadName] = this.createFragmentShader(this.loader.getResource(subShadName));
	}
	this.gl.attachShader(program, this.fragments[subShadName]);
    }
    this.gl.linkProgram(program);
    var linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (!linked) {
	var lastError = this.gl.getProgramInfoLog(program);
	this.gl.deleteProgram(program);
	throw "Error in program linking [" + lastError + "]"; // <==
    }
    
    this.gl.useProgram(program);

    // Load bindings 
    // 
    // Note : resolving an uniform or attrib can fail, even if it is declared. The shader compiler strips off unused 
    // symbols, and so one will be unable to resolve such objects.
    // 
    var varMapping = {uniforms: {},
		      attributes: {}};
    for (var name in this.engine.getRenderer().shaderParameters.uniforms) {
	var binding = this.gl.getUniformLocation(program, name);
	if (!binding && progDesc.mappings) {
	    var mapping = progDesc.mappings.uniforms[name];
	    binding = this.gl.getUniformLocation(program, mapping);
	}
	if (binding) {
	    varMapping.uniforms[name] = binding;
	}
    }

    for (var name in this.engine.getRenderer().shaderParameters.attributes) {
	var binding = this.gl.getAttribLocation(program, name);
	if (binding < 0 && progDesc.mappings) {
	    var mapping = progDesc.mappings.attributes[name];
	    binding = this.gl.getAttribLocation(program, mapping);
	}
	if (binding >= 0) {
	    varMapping.attributes[name] = binding;
	}
    }
    progDesc.bindings = varMapping;

    return program;
};

