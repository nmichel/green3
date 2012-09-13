Cube.core.TextureManager = function(attributes) {
    this.engine = attributes.engine;
    this.gl = attributes.engine.gl;
    this.textures = {};
    this.res = {};
    for (var name in attributes.mappings) {
	var resName = attributes.mappings[name];
	this.res[name] = resName;
	this.textures[name] = new Cube.core.TextureNode({manager: this,
							 name: name});
    }
};

Cube.core.TextureManager.prototype = {};
Cube.core.TextureManager.prototype.constructor = Cube.core.TextureManager;

Cube.core.TextureManager.prototype.getTexture = function(name) {
    var texture = this.textures[name];
    if (!!texture && !texture.isReady()) {
	this.loadTexture(texture);
    }
    return texture;
};

Cube.core.TextureManager.prototype.loadTexture = function(texture) {
    var img = new Image();
    var tm = this;
    var gl = tm.gl;
    img.onload = function() {
	var textureObject = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, textureObject);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, /*gl.LINEAR*/ gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, /*gl.LINEAR_MIPMAP_NEAREST*/ gl.NEAREST);
//	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);

	texture.texture = textureObject;
	texture.ready = true;
    };
    img.src = this.res[texture.getName()];
};
