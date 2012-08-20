Cube.core.OpticNode = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.matrix = (new Cube.core.math.Matrix4()).initToIdentity();

    this.setup(attributes);
};

Cube.core.OpticNode.prototype = new Cube.core.Node({});
Cube.core.OpticNode.prototype.constructor = Cube.core.OpticNode;

Cube.core.OpticNode.prototype.setup = function(attributes) {
    Cube.core.Utilities.checkReference(attributes);

    this.fov  = attributes.fov || this.default_fov;
    this.ratio  = attributes.ratio || this.default_ratio;
    this.near  = attributes.near || this.default_near;
    this.far  = attributes.far || this.default_far;

    this.updateMatrix();
};

Cube.core.OpticNode.prototype.updateMatrix = function() {

    var top = this.near * Math.tan(this.fov * 0.5);
    var bottom = -top;

    var right = top * this.ratio;
    var left = -right;

    var doubleznear = 2.0 * this.near;
    var one_deltax = 1.0 / (right - left);
    var one_deltay = 1.0 / (top - bottom);
    var one_deltaz = 1.0 / (this.far - this.near);

    this.matrix.initFromRawData([
	doubleznear * one_deltax,
	0.0,
	0.0,
	0.0,
	0.0,
	doubleznear * one_deltay,
	0.0,
	0.0,
	(right + left) * one_deltax,
	(top + bottom) * one_deltay,
	-(this.far + this.near) * one_deltaz,
	-1.0,
	0.0,
	0.0,
	-(this.far * doubleznear) * one_deltaz,
	0.0]);
};

Cube.core.OpticNode.prototype.getMatrix = function() {
    return this.matrix;
};

Cube.core.OpticNode.prototype.default_fov = Math.PI / 2.0;
Cube.core.OpticNode.prototype.default_ratio = 1.0;
Cube.core.OpticNode.prototype.default_near = 1.0;
Cube.core.OpticNode.prototype.default_far = 1000.0;
