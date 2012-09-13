Cube.core.GeometryHelpers = {
    buildSphere: function(radius, output) {
        var nbSlices = 20,
        nbPoints = (nbSlices+1)*(2*nbSlices+1),
        nbFaces = nbSlices * 2 * nbSlices
        nbTris = nbFaces * 2,
        nbIndices = nbTris * 3;
	
	output.begin(nbPoints, nbIndices);

        var startLatitudes = -Math.PI/2.0,
            stopLatitudes = Math.PI/2.0,
            deltaLatitude = (stopLatitudes - startLatitudes) / nbSlices,
            startLongitudes = 0,
            stopLongitudes = 2.0 * Math.PI,
            deltaLongitude = (stopLongitudes - startLongitudes) / (2 * nbSlices);

	var iterLat;
        for (iterLat = 0; iterLat <= nbSlices; ++iterLat) {
            var latitude = startLatitudes + iterLat * (stopLatitudes - startLatitudes) / nbSlices,
                y = Math.sin(latitude),
                rad = Math.cos(latitude),
                v = (1.0 - iterLat / nbSlices);

	    var iterLong;
            for (iterLong = 0; iterLong <= 2*nbSlices; ++iterLong) {
                var longitude = startLongitudes + iterLong * (stopLongitudes - startLongitudes) / (2 * nbSlices),
                    x = Math.cos(longitude) * rad,
                    z = Math.sin(longitude) * rad,
                    u = (1.0 - iterLong / (nbSlices*2));

		output.addVertex(x*radius, y*radius, z*radius);
		output.addNormal(x, y, z);
		output.addColor(x, y, z, 1.0);
            }
        }

	var pInd = 0;
        var nbPointsPerLat = nbSlices * 2 + 1,
	    latitude;
        for (latitude = 0; latitude < nbSlices; ++latitude) {
            var base = latitude * nbPointsPerLat,
	        longitude;
            for (longitude = 0; longitude < nbSlices*2; ++longitude) {
                var p1 = base + longitude,
                    p2 = base + longitude + 1,
                    p3 = base + nbPointsPerLat + longitude,
                    p4 = base + nbPointsPerLat + longitude + 1;

		output.addTriplet(p1, p3, p2);
		output.addTriplet(p2, p3, p4);
            }
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
    }
};
