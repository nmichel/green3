Cube.core.MeshNode = function (attributes) {

    checkGeometry(attributes.geometry);
    checkMaterial(attributes.material);

    this.geometry = attributes.geometry;
    this.material = attributes.material;

    this.nodes.push(this.material);
    this.nodes.push(this.geometry);

    Cube.core.ArrayNode.call(this, attributes);

};

Cube.core.MeshNode.prototype = new Cube.core.ArrayNode({});
Cube.core.MeshNode.prototype.constructor = Cube.core.MeshNode;

Cube.core.MeshNode.prototype.checkGeometry = function(geometry) {
    Cube.core.Utilities.checkReference(geometry);
    Cube.core.Utilities.checkType(geometry, Cube.core.GeometryNode);
    return geometry;
};

Cube.core.MeshNode.prototype.checkMaterial = function(material) {
    Cube.core.Utilities.checkReference(material);
    Cube.core.Utilities.checkType(material, Cube.core.MaterialNode);
    return material;
};
