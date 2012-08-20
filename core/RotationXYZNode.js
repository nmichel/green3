Cube.core.RotationXYZNode = function(attributes) {
    Cube.core.TransformNode.call(this, attributes);

    this.vector = attributes.vector;
    
    this.update();
};

Cube.core.RotationXYZNode.prototype = new Cube.core.TransformNode({});
Cube.core.RotationXYZNode.prototype.constructor = Cube.core.RotationXYZNode;

Cube.core.RotationXYZNode.prototype.update = function() {
    // -----
    // "general rotation"
    // cf. http://en.wikipedia.org/wiki/Rotation_matrix
    // 
    // "Other Ways to Build a Rotation Matrix") (Inverting all sine terms to change handedness (from left to right))
    // cf. http://www.fastgraph.com/makegames/3drotation/
    // -----

    var v = this.vector;
    var matrix = this.getMatrix();

    var x = v.x, y = v.y, z = v.z;
    var cosX = Math.cos(x), sinX = Math.sin(x);
    var cosY = Math.cos(y), sinY = Math.sin(y);
    var cosZ = Math.cos(z), sinZ = Math.sin(z);

    var cosZsinX = cosZ * sinX,
        sinXsinZ = sinX * sinZ,
        cosXcosZ = cosX * cosZ;

    matrix.setElement(0, 0, cosY * cosZ);
    matrix.setElement(0, 1, cosY * -sinZ);
    matrix.setElement(0, 2, sinY);
    matrix.setElement(1, 0, cosZsinX * sinY + sinZ * cosX);
    matrix.setElement(1, 1, sinXsinZ * -sinY + cosXcosZ);
    matrix.setElement(1, 2, -sinX * cosY);
    matrix.setElement(2, 0, cosXcosZ * -sinY + sinXsinZ);
    matrix.setElement(2, 1, cosX * sinY * sinZ + cosZsinX);
    matrix.setElement(2, 2, cosX * cosY);

    return Cube.core.TransformNode.prototype.update.call(this);
};
