
var tests = [
    function (parameters) {
	var n = new Cube.core.Tree({name: "toto",
				    root: new Cube.core.Node({name: null})});
    },
    
    function (parameters) {
	var n = new Cube.core.Node({name: "toto"});
    },
    
    function (parameters) {
	var n = new Cube.core.ArrayNode({name: "toto",
					 nodes: [new Cube.core.Node({name: "n1"}),
						 new Cube.core.Node({name: "n2"}),
						 new Cube.core.Node({name: "n3"})]});
    },

    function (parameters) {
	var n = new Cube.core.ArrayNode({name: "toto",
					 nodes: null});
    },
    
    function (parameters) {
	var n = new Cube.core.ArrayNode({name: "toto",
					 nodes: [{}]});
    },

    function (parameters) {
	var visitor = new Cube.core.Visitor();
	var node = new Cube.core.ArrayNode({name: "tree",
					    nodes: [new Cube.core.StatePushNode(),
						    new Cube.core.StatePopNode()]});
	node.accept(visitor);
    },

    function (parameters) {
	var visitor = new Cube.core.Visitor();
	var node = new Cube.core.MeshNode({name: "mesh",
					   geometry: new Cube.core.GeometryNode(),
					   material: new Cube.core.MaterialNode()});
	node.accept(visitor);
    }
];


var i;
for (i = 0; i < tests.length; ++i) {
    try {
	print("Running test " + i);
	var r = tests[i].call();
	print("=> Returned : ", r || "<undefined>");
    }
    catch (e) {
	print("=> Exception caught : ", e);
    }
}
