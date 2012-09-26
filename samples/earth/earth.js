var container = document.createElement('div');
var canvas = document.createElement('canvas');
document.body.appendChild(container);
canvas.width = window.innerWidth;
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
								  preload: true}}});
var textureManager = new Cube.core.TextureManager({engine: engine,
						   desc: {
						       earth: {res: "../common/img/earth.jpg",
							       flip: false,
							       quality: Cube.core.Renderer.prototype.textureQuality.BEST},
						       earthviolet: {res: "../common/img/earth_night_1.png",
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
var viewport = new Cube.core.ViewportNode({x: 0, y: 0, width: canvas.width, height: canvas.height});
var camera = new Cube.core.CameraNode({optic: new Cube.core.OpticNode({fov: Math.PI*0.5, ratio: canvas.width/canvas.height, near: 1, far: 1000}),
				       parent: new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 4)})});

var aY = new Cube.core.math.Vector3(0, 0, 0);
var shaderedTransformationRotationNode = new Cube.core.RotationXYZNode({vector: aY});

var modelTransfoCommonBaseNode =
    (new Cube.core.TransformStackNode({}))
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(-2.5, 0, 0)}))
    .push(shaderedTransformationRotationNode);

var modelTransfoCommonBaseNode2 =
    (new Cube.core.TransformStackNode({}))
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(2.5, 0, 0)}))
    .push(shaderedTransformationRotationNode);

var modelTransfoCommonBaseNode3 =
    (new Cube.core.TransformStackNode({}))
    .push(shaderedTransformationRotationNode);


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

var materialNodeEarth = new Cube.core.MaterialNode({shader: shaderManager.getShader("flat"),
						    bindings: {
							texture0: textureManager.getTexture("earthviolet"),
							texture1: textureManager.getTexture("earth")}});

var materialNodeEarth2 = new Cube.core.MaterialNode({shader: shaderManager.getShader("flat"),
						     bindings: {
							 texture0: textureManager.getTexture("earthbynight"),
							 texture1: textureManager.getTexture("earth")}});

var materialNodeEarth3 = new Cube.core.MaterialNode({shader: shaderManager.getShader("flat"),
						     bindings: {
							 texture0: textureManager.getTexture("earthbynight1"),
							 texture1: textureManager.getTexture("earth")}});

scene.push(viewport);
scene.push(camera);

scene.push(materialNodeEarth);
scene.push(modelTransfoCommonBaseNode);
scene.push(geoBufferSet);

scene.push(materialNodeEarth2);
scene.push(modelTransfoCommonBaseNode2);
scene.push(geoBufferSet);

scene.push(materialNodeEarth3);
scene.push(modelTransfoCommonBaseNode3);
scene.push(geoBufferSet);

var a = 0;
animate();

function render() {
    a += Math.PI / 200;
    a %= Math.PI * 2;
    shaderedTransformationRotationNode.set(null, a, null);
    shaderedTransformationRotationNode.update();
    modelTransfoCommonBaseNode.update();
    modelTransfoCommonBaseNode2.update();
    modelTransfoCommonBaseNode3.update();

    renderer.clear();
    scene.accept(visitor);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

