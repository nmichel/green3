Cube.core.MeshLoader = function() {
};

Cube.core.MeshLoader.prototype = {};
Cube.core.MeshLoader.prototype.constructor = Cube.core.MeshLoader;

Cube.core.MeshLoader.prototype.build = function(jsonData, bufferSetNode) {
    var rawMesh = JSON.parse(jsonData);
    for (b in rawMesh.model.vertices.data) {
        var name = (b == "position" ? "vertex" : b);
        bufferSetNode.createAttributeBuffer(name, rawMesh.model.vertices.data[b]);
    }
    if (rawMesh.model.indices) {
        bufferSetNode.createIndexBuffer("index", rawMesh.model.indices.data);
    }
    return bufferSetNode;
}