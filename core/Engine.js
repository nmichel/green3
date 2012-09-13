Cube.core.Engine = function(attributes) {

    var canvas = attributes.canvas;
    var gl = canvas.getContext('experimental-webgl',
			       {
				   alpha: true,
				   antialias: true,
				   stencil: true
			       });
    if (!gl) {
	throw "failed to created WebGL context"; // <== 
    }
    
    this.canvas = canvas;
    this.gl = gl;

    this.renderer = new Cube.core.Renderer({gl: gl});
//    this.bufferManager = new Cube.core.BufferManager({gl: gl});
};

Cube.core.Engine.prototype.constructor = Cube.core.Engine;

Cube.core.Engine.prototype.getRenderer = function() {
    return this.renderer;
};

//Cube.core.Engine.prototype.getBufferManager = function() {
//    return this.bufferManager;
//};

