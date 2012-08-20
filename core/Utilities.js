Cube.core.Utilities = {
    buildName: (function() {
	var id = 0;
	return function() {
	    return "Node" + id++;
	};
    })(),

    checkReference: function(ref, msg) {
	if (!ref) {
	    throw "invalid reference " + (msg || "");
	}
    },

    checkType: function (ref, type, msg) {
	if (!(ref instanceof type)) {
	    throw "unexpected type " + (msg || "");
	}
    }
};
