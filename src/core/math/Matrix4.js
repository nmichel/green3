Cube.core.math.Matrix4 = function() {
    this.data = new Float32Array(16);
};

Cube.core.math.Matrix4.prototype = {
    constructor: Cube.core.math.Matrix4,

    clone: function() {
        return (new Cube.core.math.Matrix4()).initFromRawData(this.data);
    },

    copyTo: function(other) {
        var td = this.data;
        var od = other.data;

        for (var i = 0; i < 16; ++i) {
            od[i] = td[i];
        }
        return this;
    },

    initToIdentity: function() {
        return this.initFromRawData(Cube.core.math.Matrix4.rawdata_identity);
    },

    initFromRawData: function(data) {
        var i;
        for (i = 0; i < 16; ++i) {
            this.data[i] = data[i];
        }
        return this;
    },

    getRawData: function() {
        return this.data;
    },

    setElement: function(x, y, v) {
        this.data[y*4+x] = v;
        return this;
    },

    multiply: function(other) {
        var res = this.clone();
        return res.multiplyToSelf(other);
    },

    invertTo: function(other) {
        // -----
        // http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
        // -----

        var td = this.data;
        var od = other.data;

        var m00 = td[0*4+0], m01 = td[1*4+0], m02 = td[2*4+0], m03 = td[3*4+0];
        var m10 = td[0*4+1], m11 = td[1*4+1], m12 = td[2*4+1], m13 = td[3*4+1];
        var m20 = td[0*4+2], m21 = td[1*4+2], m22 = td[2*4+2], m23 = td[3*4+2];
        var m30 = td[0*4+3], m31 = td[1*4+3], m32 = td[2*4+3], m33 = td[3*4+3];
        
        var det = this.determinant();

        od[0*4+0] = m12*m23*m31 - m13*m22*m31 + m13*m21*m32 - m11*m23*m32 - m12*m21*m33 + m11*m22*m33;
        od[1*4+0] = m03*m22*m31 - m02*m23*m31 - m03*m21*m32 + m01*m23*m32 + m02*m21*m33 - m01*m22*m33;
        od[2*4+0] = m02*m13*m31 - m03*m12*m31 + m03*m11*m32 - m01*m13*m32 - m02*m11*m33 + m01*m12*m33;
        od[3*4+0] = m03*m12*m21 - m02*m13*m21 - m03*m11*m22 + m01*m13*m22 + m02*m11*m23 - m01*m12*m23;

        od[0*4+1] = m13*m22*m30 - m12*m23*m30 - m13*m20*m32 + m10*m23*m32 + m12*m20*m33 - m10*m22*m33;
        od[1*4+1] = m02*m23*m30 - m03*m22*m30 + m03*m20*m32 - m00*m23*m32 - m02*m20*m33 + m00*m22*m33;
        od[2*4+1] = m03*m12*m30 - m02*m13*m30 - m03*m10*m32 + m00*m13*m32 + m02*m10*m33 - m00*m12*m33;
        od[3*4+1] = m02*m13*m20 - m03*m12*m20 + m03*m10*m22 - m00*m13*m22 - m02*m10*m23 + m00*m12*m23;
        
        od[0*4+2] = m11*m23*m30 - m13*m21*m30 + m13*m20*m31 - m10*m23*m31 - m11*m20*m33 + m10*m21*m33;
        od[1*4+2] = m03*m21*m30 - m01*m23*m30 - m03*m20*m31 + m00*m23*m31 + m01*m20*m33 - m00*m21*m33;
        od[2*4+2] = m01*m13*m30 - m03*m11*m30 + m03*m10*m31 - m00*m13*m31 - m01*m10*m33 + m00*m11*m33;
        od[3*4+2] = m03*m11*m20 - m01*m13*m20 - m03*m10*m21 + m00*m13*m21 + m01*m10*m23 - m00*m11*m23;

        od[0*4+3] = m12*m21*m30 - m11*m22*m30 - m12*m20*m31 + m10*m22*m31 + m11*m20*m32 - m10*m21*m32;
        od[1*4+3] = m01*m22*m30 - m02*m21*m30 + m02*m20*m31 - m00*m22*m31 - m01*m20*m32 + m00*m21*m32;
        od[2*4+3] = m02*m11*m30 - m01*m12*m30 - m02*m10*m31 + m00*m12*m31 + m01*m10*m32 - m00*m11*m32;
        od[3*4+3] = m01*m12*m20 - m02*m11*m20 + m02*m10*m21 - m00*m12*m21 - m01*m10*m22 + m00*m11*m22;

        other.scaleToSelf(1/det);
        return this;
    },

    invertToSelf: function() {
        return this.invertTo(this);
    },

    determinant: function() {
        var td = this.data;
        var m00 = td[0*4+0], m01 = td[1*4+0], m02 = td[2*4+0], m03 = td[3*4+0];
        var m10 = td[0*4+1], m11 = td[1*4+1], m12 = td[2*4+1], m13 = td[3*4+1];
        var m20 = td[0*4+2], m21 = td[1*4+2], m22 = td[2*4+2], m23 = td[3*4+2];
        var m30 = td[0*4+3], m31 = td[1*4+3], m32 = td[2*4+3], m33 = td[3*4+3];
        var value =
            m03*m12*m21*m30 - m02*m13*m21*m30 - m03*m11*m22*m30 + m01*m13*m22*m30+
            m02*m11*m23*m30 - m01*m12*m23*m30 - m03*m12*m20*m31 + m02*m13*m20*m31+
            m03*m10*m22*m31 - m00*m13*m22*m31 - m02*m10*m23*m31 + m00*m12*m23*m31+
            m03*m11*m20*m32 - m01*m13*m20*m32 - m03*m10*m21*m32 + m00*m13*m21*m32+
            m01*m10*m23*m32 - m00*m11*m23*m32 - m02*m11*m20*m33 + m01*m12*m20*m33+
            m02*m10*m21*m33 - m00*m12*m21*m33 - m01*m10*m22*m33 + m00*m11*m22*m33;
        return value;
    },
    
    multiplyTo: function(other, target) {
        var td = this.data;
        var od = other.data;
        var tgtd = target.data;

        var m00 = td[0*4+0], m01 = td[1*4+0], m02 = td[2*4+0], m03 = td[3*4+0];
        var m10 = td[0*4+1], m11 = td[1*4+1], m12 = td[2*4+1], m13 = td[3*4+1];
        var m20 = td[0*4+2], m21 = td[1*4+2], m22 = td[2*4+2], m23 = td[3*4+2];
        var m30 = td[0*4+3], m31 = td[1*4+3], m32 = td[2*4+3], m33 = td[3*4+3];

        var o00 = od[0*4+0], o01 = od[1*4+0], o02 = od[2*4+0], o03 = od[3*4+0];
        var o10 = od[0*4+1], o11 = od[1*4+1], o12 = od[2*4+1], o13 = od[3*4+1];
        var o20 = od[0*4+2], o21 = od[1*4+2], o22 = od[2*4+2], o23 = od[3*4+2];
        var o30 = od[0*4+3], o31 = od[1*4+3], o32 = od[2*4+3], o33 = od[3*4+3];

        tgtd[0*4+0] = m00 * o00 + m01 * o10 + m02 * o20 + m03 * o30;
        tgtd[1*4+0] = m00 * o01 + m01 * o11 + m02 * o21 + m03 * o31;
        tgtd[2*4+0] = m00 * o02 + m01 * o12 + m02 * o22 + m03 * o32;
        tgtd[3*4+0] = m00 * o03 + m01 * o13 + m02 * o23 + m03 * o33;

        tgtd[0*4+1] = m10 * o00 + m11 * o10 + m12 * o20 + m13 * o30;
        tgtd[1*4+1] = m10 * o01 + m11 * o11 + m12 * o21 + m13 * o31;
        tgtd[2*4+1] = m10 * o02 + m11 * o12 + m12 * o22 + m13 * o32;
        tgtd[3*4+1] = m10 * o03 + m11 * o13 + m12 * o23 + m13 * o33;

        tgtd[0*4+2] = m20 * o00 + m21 * o10 + m22 * o20 + m23 * o30;
        tgtd[1*4+2] = m20 * o01 + m21 * o11 + m22 * o21 + m23 * o31;
        tgtd[2*4+2] = m20 * o02 + m21 * o12 + m22 * o22 + m23 * o32;
        tgtd[3*4+2] = m20 * o03 + m21 * o13 + m22 * o23 + m23 * o33;

        tgtd[0*4+3] = m30 * o00 + m31 * o10 + m32 * o20 + m33 * o30;
        tgtd[1*4+3] = m30 * o01 + m31 * o11 + m32 * o21 + m33 * o31;
        tgtd[2*4+3] = m30 * o02 + m31 * o12 + m32 * o22 + m33 * o32;
        tgtd[3*4+3] = m30 * o03 + m31 * o13 + m32 * o23 + m33 * o33;

        return this;
    },

    multiplyToSelf: function(other) {
        return this.multiplyTo(other, this);
    },

    scaleToSelf: function(factor) {
        var i;
        var td = this.data;
        for (i = 0; i < 4*4; ++i) {
            td[i] *= factor;
        }
        return this;
    },
    
    transposeTo: function(other) {
        var td = this.data;
        var od = other.data;

        var m00 = td[0*4+0], m01 = td[1*4+0], m02 = td[2*4+0], m03 = td[3*4+0];
        var m10 = td[0*4+1], m11 = td[1*4+1], m12 = td[2*4+1], m13 = td[3*4+1];
        var m20 = td[0*4+2], m21 = td[1*4+2], m22 = td[2*4+2], m23 = td[3*4+2];
        var m30 = td[0*4+3], m31 = td[1*4+3], m32 = td[2*4+3], m33 = td[3*4+3];

        od[0*4+0] = m00
        od[1*4+1] = m11;
        od[2*4+2] = m22;
        od[3*4+3] = m33;
        od[1*4+0] = m10; od[0*4+1] = m01;
        od[2*4+0] = m20; od[0*4+2] = m02;
        od[3*4+0] = m30; od[0*4+3] = m03;
        od[2*4+1] = m21; od[1*4+2] = m12;
        od[3*4+1] = m31; od[1*4+3] = m13;
        od[3*4+2] = m32; od[2*4+3] = m23;
        
        return this;
    },

    transposeToSelf: function() {
        return this.transposeTo(this);
    },

    setRotationFrom: function(other) {
        var td = this.data;
        var od = other.data;

        for (var i = 0; i < 3*4+0; ++i) {
            td[i] = od[i];
        }

        return this;
    },

    setTranslationFrom: function(other) {
        var td = this.data;
        var od = other.data;

        for (var i = 3*4+0; i < 3*4+3; ++i) {
            td[i] = od[i];
        }

        return this;
    },

    transformRawVector4: function(vector) {
        var res = [];
        var td = this.data;
        for (var i = 0; i < 3; ++i) {
            res[i] =
                vector[0] * td[0*4+i] +
                vector[1] * td[1*4+i] +
                vector[2] * td[2*4+i] +
                vector[3] * td[3*4+i];
        }
        return res;
    }
};

Cube.core.math.Matrix4.rawdata_identity = [1, 0, 0, 0,
                                           0, 1, 0, 0,
                                           0, 0, 1, 0,
                                           0, 0, 0, 1];

Cube.core.math.Matrix4.identity = (new Cube.core.math.Matrix4()).initToIdentity();
