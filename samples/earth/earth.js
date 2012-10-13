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
								                                      quality: Cube.core.Renderer.prototype.textureQuality.BEST},
                                                       spacebox_right: {res: "../common/img/spacebox_right1.png",
								                                        flip: true,
								                                        quality: Cube.core.Renderer.prototype.textureQuality.BEST},
                                                       spacebox_left: {res: "../common/img/spacebox_left2.png",
								                                       flip: true,
								                                       quality: Cube.core.Renderer.prototype.textureQuality.BEST},
                                                       spacebox_top: {res: "../common/img/spacebox_top3.png",
								                                      flip: true,
								                                      quality: Cube.core.Renderer.prototype.textureQuality.BEST},
                                                       spacebox_bottom: {res: "../common/img/spacebox_bottom4.png",
								                                         flip: true,
								                                         quality: Cube.core.Renderer.prototype.textureQuality.BEST},
                                                       spacebox_front: {res: "../common/img/spacebox_front5.png",
								                                        flip: true,
								                                        quality: Cube.core.Renderer.prototype.textureQuality.BEST},
                                                       spacebox_back: {res: "../common/img/spacebox_back6.png",
								                                       flip: true,
								                                       quality: Cube.core.Renderer.prototype.textureQuality.BEST},
                                                   }});

var visitor = new Cube.core.RenderVisitor({renderer: renderer});
var scene = new Cube.core.ArrayNode({});

// Viewport

var viewport = new Cube.core.ViewportNode({x: 0, y: 0, width: canvas.width, height: canvas.height});

scene.push(viewport);

// Camera 

var cameraRotation = new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, 0, 0)});
var cameraTransform =
    new Cube.core.TransformStackNode({})
//    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 3000)}))
    .push(cameraRotation)
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 0.5)}));

var camera = new Cube.core.CameraNode({optic: new Cube.core.OpticNode({fov: Math.PI*0.3, ratio: canvas.width/canvas.height, near: 0.1, far: 10000}),
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
	    0.1,
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

// Star field

var materialsStarfield = [];
var transfoStarfield = [];
var rot = Math.PI/2.0;
var textures = ["spacebox_front", "spacebox_right", "spacebox_left", "spacebox_back", "spacebox_top", "spacebox_bottom"];
var rotations = [new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3( 0.0,  0.0, 0.0)}),    // Front
                 new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3( 0.0,  rot, 0.0)}),    // Right
                 new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3( 0.0, -rot, 0.0)}),    // Left
                 new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3( 0.0, 2.0*rot, 0.0)}), // Back
                 new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(-rot,  0.0, 0.0)}),    // Top
                 new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(rot,  0.0, 0.0)})];    // Bottom
var cameraCompensation = new Cube.core.TranslationCompensatorNode({reference: camera.getTransform()});
var baseTransfoStarField =
    (new Cube.core.TransformStackNode({}))
    .push(cameraCompensation)
    .push(new Cube.core.ScalingNode({vector: new Cube.core.math.Vector3(5000.0, 5000.0, 5000.0)}));

for (var i = 0; i < 6; ++i) {
    var mat = new Cube.core.MaterialNode({shader: shaderManager.getShader("flat"),
                                          transparent: true,
                                          insideOut: true,
						                  bindings: {
							                  texture0: textureManager.getTexture(textures[i]),
							                  texture1: textureManager.getTexture(textures[i])}});
    materialsStarfield.push(mat);

    var transfo =
        (new Cube.core.TransformStackNode({parent: baseTransfoStarField}))
        .push(rotations[i])
        .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 1.0)}));
    transfoStarfield.push(transfo);
}

var starfieldBufferSet =
    Cube.core.GeometryHelpers.buildPlane(
	    1.0,
	    new Cube.core.OutputToBufferSet({
	        hasVertex: true,
	        hasNormal: true,
	        hasColor: true,
	        hasUV: true,
	        hasIndex: true,
	        factory: renderer.getBufferFactory()}));

for (var i = 0; i < 6; ++i) {
    scene.push(materialsStarfield[i]);
    scene.push(transfoStarfield[i]);
    scene.push(starfieldBufferSet);
}

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
	    0.125,
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
    a += Math.PI / 300;
    //a %= Math.PI * 2;
    earthRot += Math.PI / 200;
    earthRot %= Math.PI * 2;

    shaderedTransformationRotationNode.set(null, earthRot, null);
    cameraRotation.set(null, a, a*0.25);
    camera.update(); // In this case, all nodes are transitively updated thanks to this one and only method call :)

    renderer.clear();
    scene.accept(visitor);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

