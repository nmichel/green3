Cube.core.ResourceLoader = function() {
};

Cube.core.ResourceLoader.prototype = {};
Cube.core.ResourceLoader.prototype.constructor = Cube.core.ResourceLoader;

Cube.core.ResourceLoader.prototype.getResource = function(name) {
    return document.getElementById(name).text;
};
