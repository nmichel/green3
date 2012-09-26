Cube.core.Renderer = function(attributes) {
    
    this.gl = attributes.gl;
    this.defaultClearFlags = 0;
    this.mappings = null;
    this.projectionTransfo = null;
    this.viewTransfo = null;
    this.bufferFactoryFunc = null;
    this.nextTextureUnit = 0;

    this.setup();
};

Cube.core.Renderer.prototype = {};

Cube.core.Renderer.prototype.mode = {
    POINT:   "point",
    ELEMENT: "element"
};

Cube.core.Renderer.prototype.textureQuality = {
    POOR: "poor",
    GOOD: "good",
    BEST: "best"
};

Cube.core.Renderer.prototype.shaderParameters = {
    uniforms: {
	matrixProjection: "matrixProjection",
	matrixModel:      "matrixModel",
	matrixNormal:     "matrixNormal",
	matrixView:       "matrixView"
    },
    attributes: {
	vertex: "vertex",
	normal: "normal",
	color:  "color",
	uv:     "uv"
    }
};

Cube.core.Renderer.prototype.shaderParameterTypes = {
    FLOAT: "float",
    VEC4: "vec4",
    TEXTURE2D: "texture2D"
};

Cube.core.Renderer.prototype.shaderDefaultParameterTypes = {
    texture0: Cube.core.Renderer.prototype.shaderParameterTypes.texture2D
};

Cube.core.Renderer.prototype.constructor = Cube.core.Renderer;

Cube.core.Renderer.prototype.getBufferFactory = function() {
    return this.bufferFactoryFunc;
};

Cube.core.Renderer.prototype.setup = function() {
    this.bufferFactoryFunc = (function (gl) {
	return function (isIndex, data) {
	    var buffer = gl.createBuffer();
	    var type = isIndex ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
	    gl.bindBuffer(type, buffer);
	    gl.bufferData(type, data, gl.STATIC_DRAW);
	    return buffer; // <== 
	};
    })(this.gl);

    this.defaultClearFlags = this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    // this.gl.enable(this.gl.BLEND);
    // this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    // this.gl.frontFace(this.gl.CCW); // Default
};

Cube.core.Renderer.prototype.setTransparentMode = function(toggle) {
    this.transparentMode = !!toggle;
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
    this.deactivateAllTextureUnits();
};

Cube.core.Renderer.prototype.deactivateAllTextureUnits = function() {
    for (var i = 0; i < this.nextTextureUnit; ++i) {
	this.gl.activeTexture(this.gl.TEXTURE0 + i);
	this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
    this.nextTextureUnit = 0;
};

Cube.core.Renderer.prototype.setViewport = function(x, y, w, h) {
    this.gl.viewport(x, y, w, h);
};

Cube.core.Renderer.prototype.loadMappings = function(mappings) {
    this.mappings = mappings;
    return this;
};

Cube.core.Renderer.prototype.loadProjectionTransformation = function(transfo) {
    this.projectionTransfo = transfo;
};

Cube.core.Renderer.prototype.loadViewTransformation = function(transfo) {
    this.viewTransfo = transfo;
};

Cube.core.Renderer.prototype.loadNormalTransformation = function(transfo) {
    var rawMatrix = transfo.getRawData();
    this.gl.uniformMatrix4fv(this.mappings.uniforms[this.shaderParameters.uniforms.matrixNormal], false, rawMatrix);
};

Cube.core.Renderer.prototype.loadModelTransformation = function(transfo) {
    var rawMatrix = transfo.getRawData();
    this.gl.uniformMatrix4fv(this.mappings.uniforms[this.shaderParameters.uniforms.matrixModel], false, rawMatrix);
};

Cube.core.Renderer.prototype.renderBufferSet = function(mode, bufferSet) {

    if (!bufferSet.vertexBuffer) {
	return; // <== 
    }

    if (mode == this.ELEMENT && !bufferSet.indexBuffer) {
	return; // <== 
    }

    if (!!bufferSet.normalBuffer) {
	if (this.mappings.attributes[this.shaderParameters.attributes.normal] != undefined) {
	    this.gl.enableVertexAttribArray(this.mappings.attributes[this.shaderParameters.attributes.normal]);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.normalBuffer.data);
	    this.gl.vertexAttribPointer(this.mappings.attributes[this.shaderParameters.attributes.normal], 3, this.gl.FLOAT, false, 0, 0);
	}
    }
    
    if (!!bufferSet.colorBuffer) {
	if (this.mappings.attributes[this.shaderParameters.attributes.color] != undefined) {
	    this.gl.enableVertexAttribArray(this.mappings.attributes[this.shaderParameters.attributes.color]);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.colorBuffer.data);
	    this.gl.vertexAttribPointer(this.mappings.attributes[this.shaderParameters.attributes.color], 4, this.gl.FLOAT, false, 0, 0);
	}
    }

    if (!!bufferSet.uvBuffer) {
	if (this.mappings.attributes[this.shaderParameters.attributes.uv] != undefined) {
	    this.gl.enableVertexAttribArray(this.mappings.attributes[this.shaderParameters.attributes.uv]);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.uvBuffer.data);
	    this.gl.vertexAttribPointer(this.mappings.attributes[this.shaderParameters.attributes.uv], 2, this.gl.FLOAT, false, 0, 0);
	}
    }

    this.gl.enableVertexAttribArray(this.mappings.attributes[this.shaderParameters.attributes.vertex]);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.vertexBuffer.data);
    this.gl.vertexAttribPointer(this.mappings.attributes[this.shaderParameters.attributes.vertex], 3, this.gl.FLOAT, false, 0, 0);

    if (this.transparentMode) {
	this.gl.enable(this.gl.BLEND);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	this.gl.depthMask(false);
    }

    if (this.transparentMode) {
	this.gl.frontFace(this.gl.CW);
	if (mode == this.mode.ELEMENT) {
	    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferSet.indexBuffer.data);
	    this.gl.drawElements(this.gl.TRIANGLES, bufferSet.indexBuffer.size, this.gl.UNSIGNED_SHORT, 0);
	}
	else {
	    this.gl.drawArrays(this.gl.POINTS, 0, bufferSet.vertexBuffer.size/3);
	}
	this.gl.frontFace(this.gl.CCW);
    }

    if (mode == this.mode.ELEMENT) {
	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferSet.indexBuffer.data);
	this.gl.drawElements(this.gl.TRIANGLES, bufferSet.indexBuffer.size, this.gl.UNSIGNED_SHORT, 0);
    }
    else {
	this.gl.drawArrays(this.gl.POINTS, 0, bufferSet.vertexBuffer.size/3);
    }

    this.gl.disable(this.gl.BLEND);
    this.gl.depthMask(true);
};

Cube.core.Renderer.prototype.useShader = function(shader) {
    this.gl.useProgram(shader.getProgram());
    this.loadMappings(shader.getBindings());
    this.loadPerFrameData();
};

Cube.core.Renderer.prototype.useTexture = function(texture) {
    if (this.mappings.uniforms[this.shaderParameters.uniforms.texture0]) {
	this.gl.activeTexture(this.gl.TEXTURE0);
	this.gl.bindTexture(this.gl.TEXTURE_2D, texture.getTexture());
    }
};

Cube.core.Renderer.prototype.bindShaderParamWithValue = function(name, type, value) {
    var param = this.mappings.uniforms[name];
    if (! param) {
	return; // <== 
    }

    if (type == this.shaderParameterTypes.FLOAT) {
	this.gl.uniform1f(param, value);
    }
    else if (type == this.shaderParameterTypes.VEC4) {
	this.gl.uniform4fv(param, value);
    }
    else if (type == this.shaderParameterTypes.TEXTURE2D) {
	this.gl.activeTexture(this.gl.TEXTURE0 + this.nextTextureUnit);
	this.gl.bindTexture(this.gl.TEXTURE_2D, value.getTexture());
	this.gl.uniform1i(param, this.nextTextureUnit);
	this.nextTextureUnit = this.nextTextureUnit + 1;
    }
    else {
	// unsupported data type :)
    }
};

Cube.core.Renderer.prototype.loadPerFrameData = function() {
    this.gl.uniformMatrix4fv(this.mappings.uniforms[this.shaderParameters.uniforms.matrixProjection], false, this.projectionTransfo.getRawData());
    this.gl.uniformMatrix4fv(this.mappings.uniforms[this.shaderParameters.uniforms.matrixView], false, this.viewTransfo.getRawData());
};
