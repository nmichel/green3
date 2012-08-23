var container = document.createElement('div');
var canvas = document.createElement('canvas');
document.body.appendChild(container);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
container.appendChild(canvas);

// -----

var renderer = new Cube.core.Renderer({canvas: canvas});
var visitor = new Cube.core.RenderVisitor({renderer: renderer});
var scene = new Cube.core.ArrayNode({});

var gl = renderer.gl;

/*
function throwOnGLError(err, funcName, args) {
    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
};
gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);
*/

var vertexShader = createShaderFromScript(gl, "3d-vertex-shader");
var fragmentShader = createShaderFromScript(gl, "3d-fragment-shader");
var program = loadProgram(gl, [vertexShader, fragmentShader]);
gl.useProgram(program);

var mappings = {};
mappings[renderer.shaderParameters.matrixProjection] = gl.getUniformLocation(program, "u_projection");
mappings[renderer.shaderParameters.matrixView] = gl.getUniformLocation(program, "u_view");
mappings[renderer.shaderParameters.matrixModel] = gl.getUniformLocation(program, "u_matrix");
mappings[renderer.shaderParameters.matrixNormal] = gl.getUniformLocation(program, "u_normalMatrix");
mappings[renderer.shaderParameters.vertex] = gl.getAttribLocation(program, "aPosition");
mappings[renderer.shaderParameters.normal] = gl.getAttribLocation(program, "aNormal");
mappings[renderer.shaderParameters.color] = gl.getAttribLocation(program, "aVertexColor");
renderer.loadMappings(mappings);

var viewport = new Cube.core.ViewportNode({x: 0, y: 0, width: canvas.width, height: canvas.height});
var optic = new Cube.core.OpticNode({fov: Math.PI*0.5, ratio: canvas.width/canvas.height, near: 1, far: 1000});
var camera = new Cube.core.ViewNode({parent: new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 2)})});
camera.update();


var aY = new Cube.core.math.Vector3(0, 0, 0);
var modelTransfoCommonNode = 
    (new Cube.core.TransformStackNode({}))
//    .push(new Cube.core.ScalingNode({vector: new Cube.core.math.Vector3( 1, 0.5, 1)}))
    .push(new Cube.core.RotationXYZNode({vector: aY}));

var geoBufferSet =
    Cube.core.GeometryHelpers.buildSphere(
	0.5,
	new Cube.core.OutputToBufferSet({
	    hasVertex: true,
	    hasNormal: true,
	    hasColor: true,
	    hasIndex: true,
	    factory: renderer.getBufferFactory()}));

scene.push(viewport);
scene.push(optic);
scene.push(camera);
scene.push(modelTransfoCommonNode);
scene.push(geoBufferSet);

var a = 0;
animate();

function render() {
    a += Math.PI / 200;
    a %= Math.PI * 2;
    aY.setY(a);
    aY.setX(a);
    modelTransfoCommonNode.update();

    renderer.clear();
    scene.accept(visitor);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

