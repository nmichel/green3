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
						 shaders: {colorspace: {src: ["3d-vertex-shader", "3d-fragment-shader"],
									params: {
									    uniforms: {
										u_color: renderer.shaderParameterTypes.vec4
									    }},
									mappings: mappings,
									preload: true},
							   flat: {src: ["flat-vertex-shader", "flat-fragment-shader"],
								  params: {
								      uniforms: {
									  mixRatio: renderer.shaderParameterTypes.float,
									  texture0: renderer.shaderParameterTypes.texture2D,
									  texture1: renderer.shaderParameterTypes.texture2D,
								      }},
								  mappings: mappings,
								  preload: true}}});
var textureManager = new Cube.core.TextureManager({engine: engine,
						   desc: {
						       logo: {res: "logo.png",
							      quality: Cube.core.Renderer.prototype.textureQuality.BEST},
						       caisse: {res: "caisse.jpg",
								quality: Cube.core.Renderer.prototype.textureQuality.GOOD}}});

var visitor = new Cube.core.RenderVisitor({renderer: renderer});
var scene = new Cube.core.ArrayNode({});
var viewport = new Cube.core.ViewportNode({x: 0, y: 0, width: canvas.width, height: canvas.height});
var optic = new Cube.core.OpticNode({fov: Math.PI*0.5, ratio: canvas.width/canvas.height, near: 1, far: 1000});
var camera = new Cube.core.ViewNode({parent: new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 4)})});
camera.update();

var aY = new Cube.core.math.Vector3(0, 0, 0);
var modelTransfoCommonBaseNode =
    (new Cube.core.TransformStackNode({}))
    .push(new Cube.core.RotationXYZNode({vector: aY}));
    
var modelTransfoCommonNode = 
    (new Cube.core.TransformStackNode({parent: modelTransfoCommonBaseNode}))
    .push(new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, Math.PI*2/4.0, 0)}))
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 2)}))
    .push(new Cube.core.RotationXYZNode({vector: aY}));

var modelTransfoCommonNode2 = 
    (new Cube.core.TransformStackNode({parent: modelTransfoCommonBaseNode}))
    .push(new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, 2*Math.PI*2/4.0, 0)}))
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 2)}))
    .push(new Cube.core.RotationXYZNode({vector: aY}));

var modelTransfoCommonNode3 = 
    (new Cube.core.TransformStackNode({parent: modelTransfoCommonBaseNode}))
    .push(new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, 0, 0)}))
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 2)}))
    .push(new Cube.core.RotationXYZNode({vector: aY}));

var modelTransfoCommonNode4 = 
    (new Cube.core.TransformStackNode({parent: modelTransfoCommonBaseNode}))
    .push(new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, 3*Math.PI*2/4.0, 0)}))
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 2)}))
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

var cubeGeoBufferSet =
    Cube.core.GeometryHelpers.buildCube(
	0.5,
	new Cube.core.OutputToBufferSet({
	    hasVertex: true,
	    hasNormal: true,
	    hasColor: true,
	    hasUV: true,
	    hasIndex: true,
	    factory: renderer.getBufferFactory()}));

var materialNodeColor = new Cube.core.MaterialNode({shader: shaderManager.getShader("colorspace"),
						    bindings: {
							u_color: [1.0, 0.5, 0.0, 1.0]}});

var materialNodeColor2 = new Cube.core.MaterialNode({shader: shaderManager.getShader("colorspace"),
						     bindings: {
							 u_color: [0.0, 0.5, 1.0, 1.0]}});

var materialNodeCaisse = new Cube.core.MaterialNode({shader: shaderManager.getShader("flat"),
						     bindings: {
							 texture0: textureManager.getTexture("caisse")}});

var materialNodeLogo = new Cube.core.MaterialNode({shader: shaderManager.getShader("flat"),
						   transparent: true,
						   bindings: {
						       mixRatio: 0.8,
						       texture0: textureManager.getTexture("logo"),
						       texture1: textureManager.getTexture("caisse")}});

scene.push(viewport);
scene.push(optic);
scene.push(camera);

scene.push(materialNodeColor);
scene.push(modelTransfoCommonNode);
scene.push(geoBufferSet);

scene.push(materialNodeCaisse);
scene.push(modelTransfoCommonNode2);
scene.push(cubeGeoBufferSet);

scene.push(materialNodeColor2);
scene.push(modelTransfoCommonNode4);
scene.push(geoBufferSet);

scene.push(materialNodeLogo);
scene.push(modelTransfoCommonNode3);
scene.push(cubeGeoBufferSet);

var a = 0;
animate();

function render() {
    a += Math.PI / 200;
    a %= Math.PI * 2;
    aY.setY(a);
    aY.setX(a);
    modelTransfoCommonBaseNode.update();
    modelTransfoCommonNode.update();
    modelTransfoCommonNode2.update();
    modelTransfoCommonNode3.update();
    modelTransfoCommonNode4.update();

    renderer.clear();
    scene.accept(visitor);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

