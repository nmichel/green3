Cube.core.Renderer = function(attributes) {
    
    this.canvas = null;
    this.gl = null;
    this.defaultClearFlags = 0;
    this.mappings = {};

    this.bufferFactoryFunc = null;

    this.setup(attributes);
};

Cube.core.Renderer.prototype = {};

Cube.core.Renderer.prototype.mode = {
    POINT:   "point",
    ELEMENT: "element"
};

Cube.core.Renderer.prototype.shaderParameters = {
    matrixProjection: "matrixProjection",
    matrixModel: "matrixModel",
    matrixNormal: "matrixNormal",
    matrixView: "matrixView",
    vertex: "vertex",
    normal: "normal",
    color: "color"
};

Cube.core.Renderer.prototype.constructor = Cube.core.Renderer;

Cube.core.Renderer.prototype.getBufferFactory = function() {
    return this.bufferFactoryFunc;
};

Cube.core.Renderer.prototype.setup = function(attributes) {
    var canvas = attributes.canvas;
    var gl = canvas.getContext('experimental-webgl',
			       {
				   // alpha: true
					// , antialias: true
				   // , stencil: true
			       });
    if (!gl) {
	throw "failed to created WebGL context"; // <== 
    }
    
    this.canvas = attributes.canvas;
    this.gl = gl;
    this.bufferFactoryFunc = (function () {
	return function (isIndex, data) {
	    var buffer = gl.createBuffer();
	    var type = isIndex ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
	    gl.bindBuffer(type, buffer);
	    gl.bufferData(type, data, gl.STATIC_DRAW);
	    return buffer; // <== 
	};
    })();

    this.defaultClearFlags = this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT

    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
};

Cube.core.Renderer.prototype.clear = function(buffers) {
    var bits = 0;
    if (!!buffers) {
	if (!!buffers.color) {
	    bits |= this.gl.COLOR_BUFFER_BIT;
	}
	if (!!buffers.depth) {
	    bits |= this.gl.DEPTH_BUFFER_BIT;
	}
	if (!!buffers.stencil) {
	    bits |= this.gl.STENCIL_BUFFER_BIT;
	}
    }
    else {
	bits = this.defaultClearFlags;
    }
    this.gl.clear(bits);
};

Cube.core.Renderer.prototype.setViewport = function(x, y, w, h) {
    this.gl.viewport(x, y, w, h);
};

Cube.core.Renderer.prototype.loadMappings = function(mappings) {
    for (k in mappings) {
	this.mappings[k] = mappings[k];
    }
    return this;
};

Cube.core.Renderer.prototype.loadProjectionTransformation = function(transfo) {
    var rawMatrix = transfo.getRawData();
    this.gl.uniformMatrix4fv(this.mappings[this.shaderParameters.matrixProjection], false, rawMatrix);
};

Cube.core.Renderer.prototype.loadViewTransformation = function(transfo) {
    var rawMatrix = transfo.getRawData();
    this.gl.uniformMatrix4fv(this.mappings[this.shaderParameters.matrixView], false, rawMatrix);
};

Cube.core.Renderer.prototype.loadNormalTransformation = function(transfo) {
    var rawMatrix = transfo.getRawData();
    this.gl.uniformMatrix4fv(this.mappings[this.shaderParameters.matrixNormal], false, rawMatrix);
};

Cube.core.Renderer.prototype.loadModelTransformation = function(transfo) {
    var rawMatrix = transfo.getRawData();
    this.gl.uniformMatrix4fv(this.mappings[this.shaderParameters.matrixModel], false, rawMatrix);
};

Cube.core.Renderer.prototype.renderBufferSet = function(mode, bufferSet) {

    if (!bufferSet.vertexBuffer) {
	return; // <== 
    }

    if (mode == this.ELEMENT && !bufferSet.indexBuffer) {
	return; // <== 
    }

    if (!!bufferSet.normalBuffer) {
	this.gl.enableVertexAttribArray(this.mappings[this.shaderParameters.normal]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.normalBuffer.data);
	this.gl.vertexAttribPointer(this.mappings[this.shaderParameters.normal], 3, gl.FLOAT, false, 0, 0);
    }

    if (!!bufferSet.colorBuffer) {
	this.gl.enableVertexAttribArray(this.mappings[this.shaderParameters.color]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.colorBuffer.data);
	this.gl.vertexAttribPointer(this.mappings[this.shaderParameters.color], 4, gl.FLOAT, false, 0, 0);
    }

    this.gl.enableVertexAttribArray(this.mappings[this.shaderParameters.vertex]);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.vertexBuffer.data);
    this.gl.vertexAttribPointer(this.mappings[this.shaderParameters.vertex], 3, gl.FLOAT, false, 0, 0);

    if (mode == this.mode.ELEMENT) {
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferSet.indexBuffer.data);
	this.gl.drawElements(this.gl.TRIANGLES, bufferSet.indexBuffer.size, this.gl.UNSIGNED_SHORT, 0);
    }
    else {
	this.gl.drawArrays(this.gl.POINTS, 0, bufferSet.vertexBuffer.size/3);
    }
};
