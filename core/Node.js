Cube.core.Node = function(attributes) {

    this.name = "";

    this.init(attributes);
}

Cube.core.Node.prototype = {};
Cube.core.Node.prototype.constructor = Cube.core.Node;

Cube.core.Node.prototype.accept = null;

Cube.core.Node.prototype.init = function(attributes) {
    var att;
    for (att in attributes){
	var objectToInspect;
	for(var objectToInspect = Object.getPrototypeOf(this); objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {
	    try {
		this[att] = objectToInspect.checkProperty(att, attributes[att]);
		break; // <== property successfuly set
	    }
	    catch (e if e instanceof TypeError) {
		// property not found at current level. Try next one.
	    }
	    catch (e) {
		// property found, but proposed value doesn't fit !
		throw e; // <== 
	    }
	}
    }
};

Cube.core.Node.prototype.checkProperty = function (name, value) {
    var funcs = {
	name: Cube.core.Node.prototype.setName
    };
    return funcs[name].call(this, value);
};

Cube.core.Node.prototype.setName = function(name) {
    return name || Cube.core.Utilities.buildName();
};

