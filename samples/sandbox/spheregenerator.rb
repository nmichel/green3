require "matrix.rb"

radius = 0.5
nbSlices = 30

nbPoints = (nbSlices+1)*(2*nbSlices+1)
nbFaces = nbSlices * 2 * nbSlices
nbTris = nbFaces * 2
nbIndices = nbTris * 3

position = Array.new
normal = Array.new
color = Array.new
uv = Array.new

startLatitudes = -Math::PI/2.0
stopLatitudes = Math::PI/2.0
deltaLatitude = (stopLatitudes - startLatitudes) / nbSlices
startLongitudes = 0
stopLongitudes = 2.0 * Math::PI
deltaLongitude = (stopLongitudes - startLongitudes) / (2 * nbSlices)

0.upto(nbSlices).each {
    |iterLat|
    latitude = startLatitudes + iterLat * (stopLatitudes - startLatitudes) / nbSlices
    y = Math.sin(latitude)
    rad = Math.cos(latitude)
    v = (1.0 - iterLat.to_f / nbSlices)

    0.upto(2*nbSlices).each {
        |iterLong|
        longitude = startLongitudes + iterLong * (stopLongitudes - startLongitudes) / (2 * nbSlices)
        x = Math.cos(longitude) * rad
        z = Math.sin(longitude) * rad
        u = (1.0 - iterLong.to_f / (nbSlices*2))

        position << x*radius << y*radius << z*radius
        normal << x << y << z
        color << x << y << z << 1.0
        uv << u << v
    }
}

indice = Array.new

nbPointsPerLat = nbSlices * 2 + 1
0.upto(nbSlices-1) {
    |latitude|
    base = latitude * nbPointsPerLat
    0.upto(nbSlices*2-1) {
        |longitude|
        p1 = base + longitude
        p2 = base + longitude + 1
        p3 = base + nbPointsPerLat + longitude
        p4 = base + nbPointsPerLat + longitude + 1

        indice << p1 << p3 << p2 << p2 << p3 << p4
    }
}

tan1 = Array.new position.length * 3, 0.0
tan2 = Array.new position.length * 3, 0.0

0.upto(indice.length/3 - 1) {
    |i|
    triangle = i*3

    i1, i2, i3 = indice[triangle, 3]

    x1 = position[i2*3+0] - position[i1*3+0]
    x2 = position[i3*3+0] - position[i1*3+0]
    y1 = position[i2*3+1] - position[i1*3+1]
    y2 = position[i3*3+1] - position[i1*3+1]
    z1 = position[i2*3+2] - position[i1*3+2]
    z2 = position[i3*3+2] - position[i1*3+2]
    s1 = uv[i2*2+0] - uv[i1*2+0]
    s2 = uv[i3*2+0] - uv[i1*2+0]
    t1 = uv[i2*2+1] - uv[i1*2+1]
    t2 = uv[i3*2+1] - uv[i1*2+1]
    r = 1.0 / (s1 * t2 - s2 * t1)

    sdir = [(t2 * x1 - t1 * x2) * r, (t2 * y1 - t1 * y2) * r, (t2 * z1 - t1 * z2) * r]
    tdir = [(s1 * x2 - s2 * x1) * r, (s1 * y2 - s2 * y1) * r, (s1 * z2 - s2 * z1) * r]

    add = lambda {
        |to, idx, what|
        to[idx*3+0] += what[0]
        to[idx*3+1] += what[1]
        to[idx*3+2] += what[2]
    }

    add.call tan1, i1, sdir
    add.call tan1, i2, sdir
    add.call tan1, i3, sdir

    add.call tan2, i1, tdir
    add.call tan2, i2, tdir
    add.call tan2, i3, tdir
}

tangent = Array.new 

0.upto(position.length/3 - 1) {
    |a|
    n = Vector.[] normal[a*3+0], normal[a*3+1], normal[a*3+2]
    t1 = Vector.[] tan1[a*3+0], tan1[a*3+1], tan1[a*3+2]
    t2 = Vector.[] tan2[a*3+0], tan2[a*3+1], tan2[a*3+2]

    t = (t1 - (n * n.inner_product(t1))).normalize(); # Gram-Schmidt orthogonalize.

    c = Vector.[] n[1]*t1[2] - n[2]*t1[1],  n[2]*t1[0] - n[0]*t1[2], n[0]*t1[1] - n[1]*t1[0]
    w = (c.inner_product(t2) < 0.0) ? -1.0 : 1.0; # Calculate handedness.

    tangent << t[0] << t[1] << t[2] << w
}

print "{\"model\": {
    \"types\": {
        \"vf2\": [\"FLOAT\", 2],
        \"vf3\": [\"FLOAT\", 3],
        \"vf4\": [\"FLOAT\", 4]
    },
    \"attributes\": {
        \"position\": \"vf3\",
        \"normal\":   \"vf3\",
        \"color\":    \"vf4\",
        \"uv\":       \"vf2\",
        \"tangent\":  \"vf4\"
    },"

print "
    \"vertices\": {
        \"count\": #{nbPoints},
        \"data\": {"

print "
            \"position\": #{position},
            \"normal\": #{normal},
            \"color\": #{color},
            \"uv\": #{uv},
            \"tangent\": #{tangent}"

print "
        }
    },"
print "
    \"indices\": {
        \"count\": #{nbIndices},"

print "
        \"data\": #{indice}"
print "
    }
    "

print "
}}
"
