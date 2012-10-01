var container = document.createElement('div');
var canvas = document.createElement('canvas');
document.body.appendChild(container);
canvas.width =  window.innerWidth;
canvas.height = window.innerHeight;
container.appendChild(canvas);

// -----

function mapFromPairList(pairs) {
    return pairs.reduce(function(state, pair) {
	state[pair[0]] = pair[1];
	return state;
    }, {});
}

var engine = new Cube.core.Engine({canvas: canvas});
var renderer = engine.getRenderer();
var mappings = {uniforms: mapFromPairList([[renderer.shaderParameters.uniforms.matrixProjection, "u_projection"],
					   [renderer.shaderParameters.uniforms.matrixView,       "u_view"],
					   [renderer.shaderParameters.uniforms.matrixModel,      "u_matrix"],
					   [renderer.shaderParameters.uniforms.matrixNormal,     "u_normalMatrix"]]),
		attributes: mapFromPairList([[renderer.shaderParameters.attributes.vertex,       "aPosition"],
					     [renderer.shaderParameters.attributes.normal,       "aNormal"],
					     [renderer.shaderParameters.attributes.color,        "aColor"],
					     [renderer.shaderParameters.attributes.uv,           "aUV"]])};
var shaderManager = new Cube.core.ShaderManager({engine: engine,
						 loader: new Cube.core.ResourceLoader({}),
						 shaders: {flat: {src: ["flat-vertex-shader", "flat-fragment-shader"],
								  params: {
								      uniforms: {
									  mixRatio: renderer.shaderParameterTypes.FLOAT,
									  texture0: renderer.shaderParameterTypes.TEXTURE2D,
									  texture1: renderer.shaderParameterTypes.TEXTURE2D,
								      }},
								  mappings: mappings,
								  preload: true},
							   halo: {src: ["halo-vertex-shader", "halo-fragment-shader"],
								  params: {uniforms: {}},
								  mappings: mappings,
								  preload: true}}});
var textureManager = new Cube.core.TextureManager({engine: engine,
						   desc: {
						       earth: {res: "../common/img/earth.jpg",
							       flip: false,
							       quality: Cube.core.Renderer.prototype.textureQuality.BEST},
						       earthviolet: {res: "../common/img/earth_night_1.jpg",
								     flip: false,
								     quality: Cube.core.Renderer.prototype.textureQuality.BEST},
						       earthbynight1: {res: "../common/img/earth_night_2.png",
								       flip: false,
								       quality: Cube.core.Renderer.prototype.textureQuality.BEST},
						       earthbynight: {res: "../common/img/earth_night_3.jpg",
								      flip: false,
								      quality: Cube.core.Renderer.prototype.textureQuality.BEST}}});

var visitor = new Cube.core.RenderVisitor({renderer: renderer});
var scene = new Cube.core.ArrayNode({});

// Viewport

var viewport = new Cube.core.ViewportNode({x: 0, y: 0, width: canvas.width, height: canvas.height});

scene.push(viewport);

// Camera 

var cameraRotation = new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, 0, 0)});
var cameraTransform =
    new Cube.core.TransformStackNode({})
    .push(cameraRotation)
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 2.5)}));
cameraRotation.update();
cameraTransform.update();

var camera = new Cube.core.CameraNode({optic: new Cube.core.OpticNode({fov: Math.PI*0.5, ratio: canvas.width/canvas.height, near: 1, far: 1000}),
				       parent: cameraTransform});

scene.push(camera);

// Earth

var shaderedTransformationRotationNode = new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, 0, 0)});

var modelTransfoCommonBaseNode3 =
    (new Cube.core.TransformStackNode({}))
    .push(shaderedTransformationRotationNode);

var materialNodeEarth3 = new Cube.core.MaterialNode({shader: shaderManager.getShader("flat"),
						     bindings: {
							 texture0: textureManager.getTexture("earthbynight1"),
							 texture1: textureManager.getTexture("earth")}});

var geoBufferSet =
    Cube.core.GeometryHelpers.buildSphere(
	1.0,
	new Cube.core.OutputToBufferSet({
	    hasVertex: true,
	    hasNormal: true,
	    hasColor: true,
	    hasUV: true,
	    hasIndex: true,
	    factory: renderer.getBufferFactory()}));

scene.push(materialNodeEarth3);
scene.push(modelTransfoCommonBaseNode3);
scene.push(geoBufferSet);

// Halo

var materialNodeHalo = new Cube.core.MaterialNode({shader: shaderManager.getShader("halo"),
						   transparent: true,
						   bindings: {}});

var transfoHalo =
    (new Cube.core.TransformStackNode({parent: modelTransfoCommonBaseNode3}))
    .push(new Cube.core.FaceObjectNode({reference: modelTransfoCommonBaseNode3}))
    .push(new Cube.core.FaceCameraNode({reference: camera.getTransform()}));

var geoPlaneBufferSet =
    Cube.core.GeometryHelpers.buildPlane(
	1.25,
	new Cube.core.OutputToBufferSet({
	    hasVertex: true,
	    hasNormal: true,
	    hasColor: true,
	    hasUV: true,
	    hasIndex: true,
	    factory: renderer.getBufferFactory()}));

scene.push(materialNodeHalo);
scene.push(transfoHalo);
scene.push(geoPlaneBufferSet);

// Animate

var earthRot = 0;
var a = 0;
animate();

function render() {
    a += Math.PI / 200;
    a %= Math.PI * 2;
    earthRot += Math.PI / 300;
    earthRot %= Math.PI * 2;

    cameraRotation.set(null, a, null);
    cameraRotation.update();
    cameraTransform.update();
    camera.update();
    shaderedTransformationRotationNode.set(null, earthRot, null);
    shaderedTransformationRotationNode.update();
    modelTransfoCommonBaseNode3.update();
    transfoHalo.update();

    renderer.clear();
    scene.accept(visitor);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

