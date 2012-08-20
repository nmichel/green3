var container = document.createElement('div');
var canvas = document.createElement('canvas');
document.body.appendChild(container);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
container.appendChild(canvas);

// -----

var renderer = new Cube.core.Renderer({canvas: canvas});
renderer.clear();

ctx = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));
function throwOnGLError(err, funcName, args) {
    throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
};
 
var gl = renderer.gl;
gl = WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);

gl.viewport(0, 0, canvas.width, canvas.height);

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

var optic = new Cube.core.OpticNode({fov: Math.PI*0.5, ratio: canvas.width/canvas.height, near: 1, far: 1000});
renderer.loadProjectionTransformation(optic);

var cameraTransform = new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 2)})
renderer.loadViewTransformation(cameraTransform);

var geoBufferSet =
    Cube.core.GeometryHelpers.buildCube(
	0.5,
	new Cube.core.OutputToBufferSet({
	    hasVertex: true,
	    hasNormal: true,
	    hasColor: true,
	    hasIndex: true,
	    factory: renderer.getBufferFactory()}));

var aY = new Cube.core.math.Vector3(0, 0, 0);
var modelTransfoCommonNode = 
    (new Cube.core.TransformStackNode({}))
//    .push(new Cube.core.ScalingNode({vector: new Cube.core.math.Vector3( 1, 0.5, 1)}))
    .push(new Cube.core.RotationXYZNode({vector: aY}));
var a = 0;

animate();

function render() {
    a += Math.PI / 200;
    a %= Math.PI * 2;
    aY.setY(a);
    modelTransfoCommonNode.update();

    renderer.clear();
    renderer.loadModelTransformation(modelTransfoCommonNode);
    renderer.loadNormalTransformation(modelTransfoCommonNode);
    renderer.renderBufferSet(renderer.mode.ELEMENT, geoBufferSet);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

