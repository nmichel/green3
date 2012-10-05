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
										                                        u_color: renderer.shaderParameterTypes.VEC4
									                                        }},
									                                    mappings: mappings,
									                                    preload: true},
							                               flat: {src: ["flat-vertex-shader", "flat-fragment-shader"],
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
						                               logo: {res: "../common/img/logo.png",
							                                  quality: Cube.core.Renderer.prototype.textureQuality.BEST},
						                               caisse: {res: "../common/img/caisse.jpg",
								                                quality: Cube.core.Renderer.prototype.textureQuality.GOOD},
						                               earth: {res: "../common/img/earth.jpg",
							                                   quality: Cube.core.Renderer.prototype.textureQuality.BEST},
						                               earthbynight: {res: "../common/img/earth_night_1.jpg",
								                                      quality: Cube.core.Renderer.prototype.textureQuality.BEST}}});

var visitor = new Cube.core.RenderVisitor({renderer: renderer});
var scene = new Cube.core.Scene({});
var viewport = new Cube.core.ViewportNode({x: 0, y: 0, width: canvas.width, height: canvas.height});
var camera = new Cube.core.CameraNode({optic: new Cube.core.OpticNode({fov: Math.PI*0.5, ratio: canvas.width/canvas.height, near: 1, far: 1000}),
				                       parent: new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 4)})});

var aY = new Cube.core.math.Vector3(0, 0, 0);
var shaderedTransformationRotationNode = new Cube.core.RotationXYZNode({vector: aY});

var modelTransfoCommonBaseNode =
    (new Cube.core.TransformStackNode({}))
    .push(shaderedTransformationRotationNode);
    
var modelTransfoCommonNode = 
    (new Cube.core.TransformStackNode({parent: modelTransfoCommonBaseNode}))
    .push(new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, Math.PI*2/4.0, 0)}))
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 2)}))
    .push(shaderedTransformationRotationNode);

var modelTransfoCommonNode2 = 
    (new Cube.core.TransformStackNode({parent: modelTransfoCommonBaseNode}))
    .push(new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, 2*Math.PI*2/4.0, 0)}))
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 2)}))
    .push(shaderedTransformationRotationNode);

var modelTransfoCommonNode3 = 
    (new Cube.core.TransformStackNode({parent: modelTransfoCommonBaseNode}))
    .push(new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, 0, 0)}))
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 2)}))
    .push(shaderedTransformationRotationNode);

var modelTransfoCommonNode4 = 
    (new Cube.core.TransformStackNode({parent: modelTransfoCommonBaseNode}))
    .push(new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, 3*Math.PI*2/4.0, 0)}))
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 2)}))
    .push(shaderedTransformationRotationNode);


var geoBufferSet =
    Cube.core.GeometryHelpers.buildSphere(
	0.5,
	new Cube.core.OutputToBufferSet({
	    hasVertex: true,
	    hasNormal: true,
	    hasColor: true,
	    hasUV: true,
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

var materialNodeEarth = new Cube.core.MaterialNode({shader: shaderManager.getShader("flat"),
						    bindings: {
							mixRatio: 0.8,
							texture0: textureManager.getTexture("earthbynight"),
							texture1: textureManager.getTexture("earth")}});

scene.setViewport(viewport);
scene.setCamera(camera);
scene.addObject(new Cube.core.Object({material: materialNodeEarth, transformation: modelTransfoCommonNode, geometry: geoBufferSet}));
scene.addObject(new Cube.core.Object({material: materialNodeCaisse, transformation: modelTransfoCommonNode2, geometry: cubeGeoBufferSet}));
scene.addObject(new Cube.core.Object({material: materialNodeColor2, transformation: modelTransfoCommonNode4, geometry: geoBufferSet}));
scene.addObject(new Cube.core.Object({material: materialNodeLogo, transformation: modelTransfoCommonNode3, geometry: cubeGeoBufferSet}));

var a = 0;
animate();

function render() {
    a += Math.PI / 200;
    a %= Math.PI * 2;
    shaderedTransformationRotationNode.set(null, a, null);
    shaderedTransformationRotationNode.update();
    modelTransfoCommonBaseNode.update();
    modelTransfoCommonNode.update();
    modelTransfoCommonNode2.update();
    modelTransfoCommonNode3.update();
    modelTransfoCommonNode4.update();

    renderer.clear();
    scene.visit(visitor);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

