Cube.core.TextureManager = function(attributes) {
    this.engine = attributes.engine;
    this.gl = attributes.engine.gl;
    this.textures = {};
    this.desc = {};
    for (var name in attributes.desc) {
	var desc = attributes.desc[name];
	this.desc[name] = desc;
	this.textures[name] = new Cube.core.TextureNode({manager: this, name: name});
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
    var desc = this.desc[texture.getName()]
    img.onload = function() {
	var magFilter = desc.quality == Cube.core.Renderer.prototype.textureQuality.POOR ? gl.NEAREST : gl.LINEAR;
	var minFilter = desc.quality == Cube.core.Renderer.prototype.textureQuality.POOR ? gl.NEAREST : (desc.quality == Cube.core.Renderer.prototype.textureQuality.GOOD ? gl.LINEAR : gl.LINEAR_MIPMAP_NEAREST);
	var textureObject = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, textureObject);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
	if (desc.quality == Cube.core.Renderer.prototype.textureQuality.BEST) {
	    gl.generateMipmap(gl.TEXTURE_2D);
	}
	gl.bindTexture(gl.TEXTURE_2D, null);

	texture.texture = textureObject;
	texture.ready = true;
    };
    img.src = desc.res;
};
