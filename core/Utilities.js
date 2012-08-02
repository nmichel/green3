Cube.core.Utilities = {
    buildName: (function() {
	var id = 0;
	return function() {
	    return "Node" + id++;
	};
    })()
};
