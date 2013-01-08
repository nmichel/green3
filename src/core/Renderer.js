Cube.core.Renderer = function(attributes) {
    
    this.gl = attributes.gl;
    this.defaultClearFlags = 0;
    this.mappings = null;
    this.projectionTransfo = null;
    this.viewTransfo = new Cube.core.math.Matrix4();
    this.viewInvertTransposeTransfo = new Cube.core.math.Matrix4();
    this.modelViewTransfo = new Cube.core.math.Matrix4();
    this.modelViewInvertTransposeTransfo = new Cube.core.math.Matrix4();
    this.bufferFactoryFunc = null;
    this.nextTextureUnit = 0;
    this.lightsUniforms = [];
    this.nextLight = 0;
    this.transparentMode = false;
    this.insideOutMode = false;

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

Cube.core.Renderer.prototype.shaderLightSubParameters = {
    type:      "type",
    color:     "color",
    direction: "direction",
    position:  "position"
};

Cube.core.Renderer.prototype.shaderParameters = {
    uniforms: {
        matrixProjection: "matrixProjection",
        matrixModel:      "matrixModel",
        matrixNormal:     "matrixNormal",
        matrixView:       "matrixView",
        lightsCount:      "lightsCount"
    },
    attributes: {
        vertex:  "vertex",
        normal:  "normal",
        color:   "color",
        uv:      "uv",
        tangent: "tangent"
    }
};

Cube.core.Renderer.prototype.shaderParameterTypes = {
    FLOAT: "float",
    VEC4: "vec4",
    TEXTURE2D: "texture2D"
};

Cube.core.Renderer.prototype.lightTypes = {
    AMBIANT: 1,
    DIRECTIONAL: 2,
    POINT: 3,
    SPOT: 4
};

Cube.core.Renderer.prototype.constructor = Cube.core.Renderer;

Cube.core.Renderer.prototype.setup = function() {
    // [TODO : retreive the count of available lights]
    var uniforms = this.shaderParameters.uniforms;
    var i = 0;
    for (i = 0; i < 2; ++i) {
        var l = {};
        this.lightsUniforms[i] = l;
        for (pKey in this.shaderLightSubParameters) {
            var pName = "lights[" + i +  "]." + this.shaderLightSubParameters[pKey];
            uniforms[pName] = pName;
            l[pKey] = pName;
        }
    }

    this.bufferFactoryFunc = (function (gl) {
    return function (isIndex, data) {
        var buffer = gl.createBuffer();
        var type = isIndex ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, data, gl.STATIC_DRAW);
        return buffer; // <== 
    };
    })(this.gl);

    this.defaultClearFlags = this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT;
    this.gl.clearColor(0, 0, 0, 1); // [TODO : add a DEFAULT_CLEAR_COLOR and a API to setup the clear color]
    this.gl.clearStencil(0x00); // [TODO : add a DEFAULT_CLEAR_STENCIL_VALUE and a API to setup the stencil clear value]
    // this.gl.clearDepth(0.0); // [TODO : add a DEFAULT_CLEAR_DEPTH_VALUE and a API to setup the depth buffer clear value]
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    // this.gl.enable(this.gl.STENCIL_TEST);

    this.clear();
};

Cube.core.Renderer.prototype.getRawGL = function() {
    return this.gl;
};

Cube.core.Renderer.prototype.getBufferFactory = function() {
    return this.bufferFactoryFunc;
};

Cube.core.Renderer.prototype.setTransparentMode = function(toggle) {
    this.transparentMode = !!toggle;
};

Cube.core.Renderer.prototype.setInsideOutMode = function(toggle) {
    this.insideOutMode = !!toggle;
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
    this.deactivateAllLights();
};

Cube.core.Renderer.prototype.deactivateAllTextureUnits = function() {
    for (var i = 0; i < this.nextTextureUnit; ++i) {
        this.gl.activeTexture(this.gl.TEXTURE0 + i);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }
    this.nextTextureUnit = 0;
};

Cube.core.Renderer.prototype.deactivateAllLights = function() {
    this.nextLight = 0;
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
    transfo.copyTo(this.modelViewTransfo);
    this.modelViewTransfo.invertTo(this.modelViewInvertTransposeTransfo);
    this.modelViewInvertTransposeTransfo.transposeToSelf();

    this.modelViewTransfo.copyTo(this.viewTransfo);
    this.modelViewInvertTransposeTransfo.copyTo(this.viewInvertTransposeTransfo);
};

Cube.core.Renderer.prototype.loadNormalTransformation = function(transfo) {
    this.viewInvertTransposeTransfo.copyTo(this.modelViewInvertTransposeTransfo);
    this.modelViewInvertTransposeTransfo.multiplyToSelf(transfo);
    var rawMatrix = this.modelViewInvertTransposeTransfo.getRawData();
    this.gl.uniformMatrix4fv(this.mappings.uniforms[this.shaderParameters.uniforms.matrixNormal], false, rawMatrix);
};

Cube.core.Renderer.prototype.loadModelTransformation = function(transfo) {
    this.viewTransfo.copyTo(this.modelViewTransfo);
    this.modelViewTransfo.multiplyToSelf(transfo);
    var rawMatrix = this.modelViewTransfo.getRawData();
    this.gl.uniformMatrix4fv(this.mappings.uniforms[this.shaderParameters.uniforms.matrixModel], false, rawMatrix);
};

Cube.core.Renderer.prototype.renderBufferSet = function(mode, bufferSet) {
    this.gl.uniform1i(this.mappings.uniforms[this.shaderParameters.uniforms.lightsCount], this.nextLight); // [FIXME : awkward]

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

    if (!!bufferSet.tangentBuffer) {
        if (this.mappings.attributes[this.shaderParameters.attributes.tangent] != undefined) {
            this.gl.enableVertexAttribArray(this.mappings.attributes[this.shaderParameters.attributes.tangent]);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.tangentBuffer.data);
            this.gl.vertexAttribPointer(this.mappings.attributes[this.shaderParameters.attributes.tangent], 4, this.gl.FLOAT, false, 0, 0);
        }
    }

    if (!!bufferSet.vertexBuffer) {
        this.gl.enableVertexAttribArray(this.mappings.attributes[this.shaderParameters.attributes.vertex]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferSet.vertexBuffer.data);
        this.gl.vertexAttribPointer(this.mappings.attributes[this.shaderParameters.attributes.vertex], 3, this.gl.FLOAT, false, 0, 0);
    }

    if (!bufferSet.indexBuffer) {
        return // <== 
    }

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

    if (! this.insideOutMode) {
        if (mode == this.mode.ELEMENT) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferSet.indexBuffer.data);
            this.gl.drawElements(this.gl.TRIANGLES, bufferSet.indexBuffer.size, this.gl.UNSIGNED_SHORT, 0);
        }
        else {
            this.gl.drawArrays(this.gl.POINTS, 0, bufferSet.vertexBuffer.size/3);
        }
    }

	this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthMask(true);
    this.gl.disable(this.gl.STENCIL_TEST);
    this.gl.disable(this.gl.BLEND);
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
    this.gl.uniformMatrix4fv(this.mappings.uniforms[this.shaderParameters.uniforms.matrixView], false, this.modelViewTransfo.getRawData());
};

Cube.core.Renderer.prototype.addAmbiantLight = function(lightAmbiantNode) {
    var lightParams = this.lightsUniforms[this.nextLight];
    if (!lightParams) {
        return; // <== 
    }
    this.gl.uniform1i(this.mappings.uniforms[lightParams.type], this.lightTypes.AMBIANT);
    this.gl.uniform4fv(this.mappings.uniforms[lightParams.color], lightAmbiantNode.getColor());
    this.nextLight = this.nextLight + 1;
};

Cube.core.Renderer.prototype.addDirectionalLight = function(lightDirectionalNode) {
    var lightParams = this.lightsUniforms[this.nextLight];
    if (!lightParams) {
        return; // <== 
    }
    this.gl.uniform1i(this.mappings.uniforms[lightParams.type], this.lightTypes.DIRECTIONAL);
    this.gl.uniform4fv(this.mappings.uniforms[lightParams.color], lightDirectionalNode.getColor());
    // Light direction is expressed in world coordinates. Transform it into eye coordimates.
    this.gl.uniform3fv(this.mappings.uniforms[lightParams.direction], this.modelViewInvertTransposeTransfo.transformRawVector4(lightDirectionalNode.getDirection()));
    this.nextLight = this.nextLight + 1;
};

Cube.core.Renderer.prototype.addPositionalLight = function(lightPositionalNode) {
    var lightParams = this.lightsUniforms[this.nextLight];
    if (!lightParams) {
        return; // <== 
    }
    this.gl.uniform1i(this.mappings.uniforms[lightParams.type], this.lightTypes.POINT);
    this.gl.uniform4fv(this.mappings.uniforms[lightParams.color], lightPositionalNode.getColor());
    // Light position is expressed in world coordinates. Transform it into eye coordimates.
    this.gl.uniform3fv(this.mappings.uniforms[lightParams.position], this.modelViewTransfo.transformRawVector4(lightPositionalNode.getPosition()));
    this.nextLight = this.nextLight + 1;
};
