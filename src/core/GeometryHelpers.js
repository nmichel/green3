Cube.core.GeometryHelpers = {
    buildSphere: function(radius, output) {
        var nbSlices = 30,
            nbPoints = (nbSlices+1)*(2*nbSlices+1),
            nbFaces = nbSlices * 2 * nbSlices,
            nbTris = nbFaces * 2,
            nbIndices = nbTris * 3;

        var normals = [],
            vertices = [],
            uvs = [],
            indices = [];

        output.begin(nbPoints, nbIndices);

        var startLatitudes = -Math.PI/2.0,
            stopLatitudes = Math.PI/2.0,
            deltaLatitude = (stopLatitudes - startLatitudes) / nbSlices,
            startLongitudes = 0,
            stopLongitudes = 2.0 * Math.PI,
            deltaLongitude = (stopLongitudes - startLongitudes) / (2 * nbSlices);

        for (var iterLat = 0; iterLat <= nbSlices; ++iterLat) {
            var latitude = startLatitudes + iterLat * (stopLatitudes - startLatitudes) / nbSlices,
                y = Math.sin(latitude),
                rad = Math.cos(latitude),
                v = (1.0 - iterLat / nbSlices);

            for (var iterLong = 0; iterLong <= 2*nbSlices; ++iterLong) {
                var longitude = startLongitudes + iterLong * (stopLongitudes - startLongitudes) / (2 * nbSlices),
                    x = Math.cos(longitude) * rad,
                    z = Math.sin(longitude) * rad,
                    u = (1.0 - iterLong / (nbSlices*2));

                output.addVertex(x*radius, y*radius, z*radius);
                output.addNormal(x, y, z);
                output.addColor(x, y, z, 1.0);
                output.addUV(u, v);

                vertices.push([x*radius, y*radius, z*radius]);
                normals.push([x, y, z]);
                uvs.push([u, v]);
            }
        }

        var nbPointsPerLat = nbSlices * 2 + 1;
        for (var latitude = 0; latitude < nbSlices; ++latitude) {
            var base = latitude * nbPointsPerLat;
            for (var longitude = 0; longitude < nbSlices*2; ++longitude) {
                var p1 = base + longitude,
                    p2 = base + longitude + 1,
                    p3 = base + nbPointsPerLat + longitude,
                    p4 = base + nbPointsPerLat + longitude + 1;

                output.addTriplet(p1, p3, p2);
                output.addTriplet(p2, p3, p4);

                indices.push([p1, p3, p2]);
                indices.push([p2, p3, p4]);
            }
        }

        var tan1 = [],
            tan2 = [];

        for (var i = 0; i < vertices.length; ++i) {
            tan1.push([0, 0, 0]);
            tan2.push([0, 0, 0]);
        }

        for (var i = 0; i < indices.length; ++i) {
            var triangle = indices[i],

                i1 = triangle[0],
                i2 = triangle[1],
                i3 = triangle[2],

                v1 = vertices[i1],
                v2 = vertices[i2],
                v3 = vertices[i3],

                w1 = uvs[i1],
                w2 = uvs[i2],
                w3 = uvs[i3],

                x1 = v2[0] - v1[0],
                x2 = v3[0] - v1[0],
                y1 = v2[1] - v1[1],
                y2 = v3[1] - v1[1],
                z1 = v2[2] - v1[2],
                z2 = v3[2] - v1[2],
                s1 = w2[0] - w1[0],
                s2 = w3[0] - w1[0],
                t1 = w2[1] - w1[1],
                t2 = w3[1] - w1[1],
                r = 1.0 / (s1 * t2 - s2 * t1);

            var sdir = [(t2 * x1 - t1 * x2) * r, (t2 * y1 - t1 * y2) * r, (t2 * z1 - t1 * z2) * r];
            var tdir = [(s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r];

            var add = function(to, what) {
                to[0] += what[0];
                to[1] += what[1];
                to[2] += what[2];
            };

            add(tan1[i1], sdir);
            add(tan1[i2], sdir);
            add(tan1[i3], sdir);

            add(tan2[i1], tdir);
            add(tan2[i2], tdir);
            add(tan2[i3], tdir);
        }

        for (var a = 0; a < vertices.length; ++a) {
            var rawN = normals[a],
                rawT = tan1[a],
                rawT2 = tan2[a],
                n = new Cube.core.math.Vector3(rawN[0], rawN[1], rawN[2]),
                t = new Cube.core.math.Vector3(rawT[0], rawT[1], rawT[2]),
                t2 = new Cube.core.math.Vector3(rawT2[0], rawT2[1], rawT2[2]);

            var tangent = t.sub(n.scale(n.dot(t))).normalizeSelf(), // Gram-Schmidt orthogonalize.
                w = (n.cross(t).dot(t2) < 0.0) ? -1.0 : 1.0; // Calculate handedness.

            output.addTangent(tangent.x, tangent.y, tangent.z, w);
        }

        return output.end();
    },

    buildPlane: function(halfSide, output) {
        var verts = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0];
        var uvs = [1, 1, 0, 1, 0, 0, 1, 0];
        var normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
        var colors = [1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1];
        var indices = [0, 1, 2, 2, 3, 0 ];

        output.begin(verts.length/3, indices.length);

        var iterVert;
        for (iterVert = 0; iterVert < verts.length/3; ++iterVert) {
            var offset = iterVert * 3;
            var uvOffset = iterVert * 2;
            output.addVertex(verts[offset]*halfSide, verts[offset+1]*halfSide, verts[offset+2]*halfSide);
            output.addNormal(normals[offset], normals[offset+1], normals[offset+2]);
            output.addColor(colors[offset], colors[offset+1], colors[offset+2], 1.0);
            output.addUV(uvs[uvOffset], uvs[uvOffset+1]);
        }

        for (iterInd = 0; iterInd < indices.length/6; ++iterInd) {
            var offset = iterInd*6;
            output.addTriplet(indices[offset], indices[offset+1], indices[offset+2]);
            output.addTriplet(indices[offset+3], indices[offset+4], indices[offset+5]);
        }

        return output.end();
    },

    buildCube: function(halfSide, output) {
        var verts = [  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,   // v0,v1,v2,v3 (front)
                       1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,   // v0,v3,v4,v5 (right)
                       1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,   // v0,v5,v6,v1 (top)
                      -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,   // v1,v6,v7,v2 (left)
                      -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,   // v7,v4,v3,v2 (bottom)
                       1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]; // v4,v7,v6,v5 (back)

        var uvs = [  1, 1,   0, 1,   0, 0,   1, 0,   // v0,v1,v2,v3 (front)
                     1, 1,   0, 1,   0, 0,   1, 0,   // v0,v3,v4,v5 (right)
                     1, 1,   0, 1,   0, 0,   1, 0,   // v0,v5,v6,v1 (top)
                     1, 1,   0, 1,   0, 0,   1, 0,   // v1,v6,v7,v2 (left)
                     1, 1,   0, 1,   0, 0,   1, 0,   // v7,v4,v3,v2 (bottom)
                     1, 1,   0, 1,   0, 0,   1, 0 ]; // v4,v7,v6,v5 (back)

        var normals = [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   // v0,v1,v2,v3 (front)
                         1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   // v0,v3,v4,v5 (right)
                         0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   // v0,v5,v6,v1 (top)
                        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,   // v1,v6,v7,v2 (left)
                         0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,   // v7,v4,v3,v2 (bottom)
                         0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1 ]; // v4,v7,v6,v5 (back)

        var colors = [ 1, 1, 1,   1, 1, 0,   1, 0, 0,   1, 0, 1,   // v0,v1,v2,v3 (front)
                       1, 1, 1,   1, 0, 1,   0, 0, 1,   0, 1, 1,   // v0,v3,v4,v5 (right)
                       1, 1, 1,   0, 1, 1,   0, 1, 0,   1, 1, 0,   // v0,v5,v6,v1 (top)
                       1, 1, 0,   0, 1, 0,   0, 0, 0,   1, 0, 0,   // v1,v6,v7,v2 (left)
                       0, 0, 0,   0, 0, 1,   1, 0, 1,   1, 0, 0,   // v7,v4,v3,v2 (bottom)
                       0, 0, 1,   0, 0, 0,   0, 1, 0,   0, 1, 1 ]; // v4,v7,v6,v5 (back)

        var indices = [ 0, 1, 2,   2, 3, 0,      // front
                        4, 5, 6,   6, 7, 4,      // right
                        8, 9,10,  10,11, 8,      // top
                        12,13,14,  14,15,12,     // left
                        16,17,18,  18,19,16,     // bottom
                        20,21,22,  22,23,20 ];   // back

        output.begin(verts.length/3, indices.length);

        for (var iterVert = 0; iterVert < verts.length/3; ++iterVert) {
            var offset = iterVert * 3,
                uvOffset = iterVert * 2;
            output.addVertex(verts[offset]*halfSide, verts[offset+1]*halfSide, verts[offset+2]*halfSide);
            output.addNormal(normals[offset], normals[offset+1], normals[offset+2]);
            output.addColor(colors[offset], colors[offset+1], colors[offset+2], 1.0);
            output.addUV(uvs[uvOffset], uvs[uvOffset+1]);
        }

        for (var iterInd = 0; iterInd < indices.length/6; ++iterInd) {
            var offset = iterInd*6;
            output.addTriplet(indices[offset], indices[offset+1], indices[offset+2]);
            output.addTriplet(indices[offset+3], indices[offset+4], indices[offset+5]);
        }

        return output.end();
    }
};
