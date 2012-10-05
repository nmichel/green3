Cube.core.OrthographicOpticNode = function(attributes) {
    Cube.core.Node.call(this, attributes);

    this.matrix = (new Cube.core.math.Matrix4()).initToIdentity();

    this.setup(attributes);
};

Cube.core.OrthographicOpticNode.prototype = new Cube.core.Node({});
Cube.core.OrthographicOpticNode.prototype.constructor = Cube.core.OrthographicOpticNode;

Cube.core.OrthographicOpticNode.prototype.accept = function(visitor) {
    visitor.visitOptic(this);
};

Cube.core.OrthographicOpticNode.prototype.setup = function(attributes) {
    Cube.core.Utilities.checkReference(attributes);

    this.fov  = attributes.fov || this.default_fov;
    this.ratio  = attributes.ratio || this.default_ratio;
    this.near  = attributes.near || this.default_near;
    this.far  = attributes.far || this.default_far;

    this.updateMatrix();
};

Cube.core.OrthographicOpticNode.prototype.updateMatrix = function() {

    var top = this.near * Math.tan(this.fov * 0.5);
    var bottom = -top;

    var right = top * this.ratio;
    var left = -right;

    var m11 = 2 / (right - left);
    var m22 = 2 / (top - bottom);
    var m33 = -2 / (this.far - this.near);
    var m14 = - (right + left) / (right - left);
    var m24 = - (top + bottom) / (top - bottom);
    var m34 = - (this.far + this.near) / (this.far - this.near);
    
    this.matrix.initFromRawData([m11, 0.0, 0.0, 0.0,
                                 0.0, m22, 0.0, 0.0,
                                 0.0, 0.0, m33, 0.0,
                                 m14, m24, m34, 1.0]);
};

Cube.core.OrthographicOpticNode.prototype.getMatrix = function() {
    return this.matrix;
};

Cube.core.OrthographicOpticNode.prototype.default_fov = Math.PI / 2.0;
Cube.core.OrthographicOpticNode.prototype.default_ratio = 1.0;
Cube.core.OrthographicOpticNode.prototype.default_near = 1.0;
Cube.core.OrthographicOpticNode.prototype.default_far = 1000.0;
