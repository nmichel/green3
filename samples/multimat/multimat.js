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
						                         shaders: {colorspace: {src: ["color-vertex-shader", "color-fragment-shader"],
									                                    params: {
									                                        uniforms: {
										                                        u_color: renderer.shaderParameterTypes.VEC4
									                                        }},
									                                    mappings: mappings,
									                                    preload: true},
							                               flat: {src: ["flat-vertex-shader", "flat-fragment-shader"],
								                                  params: {
								                                      uniforms: {
									                                      texture0: renderer.shaderParameterTypes.TEXTURE2D,
                                                                          u_axis: renderer.shaderParameterTypes.FLOAT,
                                                                          u_alpha: renderer.shaderParameterTypes.FLOAT
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
var scene = new Cube.core.ArrayNode({});
var viewport = new Cube.core.ViewportNode({x: 0, y: 0, width: canvas.width, height: canvas.height});
var camera = new Cube.core.CameraNode({optic: new Cube.core.OpticNode({fov: Math.PI*0.3, ratio: canvas.width/canvas.height, near: 1, far: 1000}),
				                       parent: new Cube.core.TranslationNode({z: 4})});

var shaderedTransformationRotationNode = new Cube.core.RotationXYZNode({});

var modelTransfoCommonBaseNode =
    (new Cube.core.TransformStackNode({}))
    .push(shaderedTransformationRotationNode);

var sphereGeoBufferSet =
    Cube.core.GeometryHelpers.buildSphere(
	    1.0,
	    new Cube.core.OutputToBufferSet({
	        hasVertex: true,
	        hasNormal: true,
	        hasColor: true,
	        hasUV: true,
	        hasIndex: true,
	        factory: renderer.getBufferFactory()}));

var materialNodeColor = new Cube.core.MaterialNode({shader: shaderManager.getShader("colorspace"),
						    bindings: {
    							u_color: [1.0, 1.0, 1.0, 0.5]}});

var materialNodeColor2 = new Cube.core.MaterialNode({shader: shaderManager.getShader("colorspace"),
						     bindings: {
    							 u_color: [1.0, 0.5, 0.0, 1.0]}});

var materialNodeCaisse = new Cube.core.MaterialNode({shader: shaderManager.getShader("flat"),
						     bindings: {
    							 texture0: textureManager.getTexture("caisse"),
                                 u_axis: 2.0,
                                 u_alpha: 1.0}});

var materialNodeEarth = new Cube.core.MaterialNode({shader: shaderManager.getShader("flat"),
						    bindings: {
    							texture0: textureManager.getTexture("earth"),
                                u_axis: 1.0,
                                u_alpha: 0.5}});

// -----

var compositeMaterial = new Cube.core.CompositeMaterialNode({layers: [{material: materialNodeColor2},
                                                                      {material: materialNodeCaisse},
                                                                      {material: materialNodeEarth}],
                                                             isTransparent: false,
                                                            });
compositeMaterial.setProxyNode(new Cube.core.ArrayNode({nodes: [modelTransfoCommonBaseNode, sphereGeoBufferSet]}));

// -----

scene.push(viewport);
scene.push(camera);

scene.push(materialNodeColor);
scene.push(new Cube.core.TranslationNode({x: -1.5}));
scene.push(sphereGeoBufferSet);

/*
scene.push(materialNodeColor2);
scene.push(new Cube.core.MaterialLayerNode({isFirst: true}));
scene.push(modelTransfoCommonBaseNode);
scene.push(sphereGeoBufferSet);

scene.push(materialNodeCaisse);
scene.push(new Cube.core.MaterialLayerNode({}));
scene.push(modelTransfoCommonBaseNode);
scene.push(sphereGeoBufferSet);

scene.push(materialNodeEarth);
scene.push(new Cube.core.MaterialLayerNode({isLast: true}));
scene.push(modelTransfoCommonBaseNode);
scene.push(sphereGeoBufferSet);
*/

scene.push(compositeMaterial);

scene.push(materialNodeColor);
scene.push(new Cube.core.TranslationNode({x: 1.5}));
scene.push(sphereGeoBufferSet);

var a = 0;
animate();

function render() {
    a += Math.PI / 200;
    a %= Math.PI * 2;
    shaderedTransformationRotationNode.set(null, a, null);
    shaderedTransformationRotationNode.update();

    renderer.clear();
    scene.accept(visitor);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}
