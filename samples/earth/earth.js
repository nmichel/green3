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
                                           [renderer.shaderParameters.uniforms.matrixModel,      "u_matrix"],
                                           [renderer.shaderParameters.uniforms.matrixNormal,     "u_normalMatrix"]]),
                attributes: mapFromPairList([[renderer.shaderParameters.attributes.vertex,       "aPosition"],
                                             [renderer.shaderParameters.attributes.normal,       "aNormal"],
                                             [renderer.shaderParameters.attributes.color,        "aColor"],
                                             [renderer.shaderParameters.attributes.uv,           "aUV"]])};
var shaderManager = new Cube.core.ShaderManager({engine: engine,
                                                 loader: new Cube.core.ResourceLoader({}),
                                                 shaders: {shaded: {src: ["shaded-vertex-shader", "shaded-fragment-shader"],
                                                                    params: {
                                                                        uniforms: {
                                                                            texture0: renderer.shaderParameterTypes.TEXTURE2D,
                                                                            texture1: renderer.shaderParameterTypes.TEXTURE2D,
                                                                            texture2: renderer.shaderParameterTypes.TEXTURE2D
                                                                        }},
                                                                    mappings: mappings,
                                                                    preload: true},
                                                           halo: {src: ["halo-vertex-shader", "halo-fragment-shader"],
                                                                  params: {uniforms: {}},
                                                                  mappings: mappings,
                                                                  preload: true},
                                                           flat: {src: ["flat-vertex-shader", "flat-fragment-shader"],
                                                                  params: {
                                                                      uniforms: {
                                                                          texture0: renderer.shaderParameterTypes.TEXTURE2D
                                                                      }},
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
                                                       earthocean: {res: "../common/img/earth_ocean.jpg",
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
//    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 3)}))
    .push(cameraRotation)
    .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 0.3)}));

var camera = new Cube.core.CameraNode({optic: new Cube.core.OpticNode({fov: Math.PI*0.3, ratio: canvas.width/canvas.height, near: 0.1, far: 10000}),
                                       parent: cameraTransform});

scene.push(camera);

// Light

var pointLight = new Cube.core.LightPositionalNode({color: [0.5, 0.0, 0.0, 0.0],
                                                    position: [0.2, 0.0, 0.0, 1.0]});
var directionalLight = new Cube.core.LightDirectionalNode({color: [0.5, 0.0, 0.0, 0.0],
                                                           direction: [1.0, 0.0, 0.0, 0.0]});
var light = pointLight;

// Earth

var earthRotation = new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, 0, 0)});
var earthTransfo =
    (new Cube.core.TransformStackNode({}))
    .push(new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(0, 0, 0.704)}))
    .push(earthRotation);

var earthMaterial = new Cube.core.MaterialNode({shader: shaderManager.getShader("shaded"),
                                                bindings: {
                                                    texture0: textureManager.getTexture("earthbynight1"),
                                                    texture1: textureManager.getTexture("earth"),
                                                    texture2: textureManager.getTexture("earthocean")}});

var earthGeom =
    Cube.core.GeometryHelpers.buildSphere(
        0.1,
        new Cube.core.OutputToBufferSet({
            hasVertex: true,
            hasNormal: true,
            hasColor: true,
            hasUV: true,
            hasIndex: true,
            factory: renderer.getBufferFactory()}));

scene.push(earthMaterial);
scene.push(light); // earth is enlighted
scene.push(earthTransfo);
scene.push(earthGeom);

// Star field

var rot = Math.PI/2.0;
var textures = ["spacebox_front", "spacebox_right", "spacebox_left", "spacebox_back", "spacebox_top", "spacebox_bottom"];
var rotations = [new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3( 0.0,  0.0, 0.0)}),    // Front
                 new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3( 0.0,  rot, 0.0)}),    // Right
                 new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3( 0.0, -rot, 0.0)}),    // Left
                 new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3( 0.0, 2.0*rot, 0.0)}), // Back
                 new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(-rot,  0.0, 0.0)}),    // Top
                 new Cube.core.RotationXYZNode({vector: new Cube.core.math.Vector3(rot,  0.0, 0.0)})];    // Bottom

var starfieldTransfo =
    (new Cube.core.TransformStackNode({}))
    .push(new Cube.core.TranslationCompensatorNode({reference: camera.getTransform()}))
    .push(new Cube.core.ScalingNode({vector: new Cube.core.math.Vector3(2.0, 2.0, 2.0)}));

var starfieldGeom =
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
    var mat = new Cube.core.MaterialNode({shader: shaderManager.getShader("flat"),
                                          transparent: true,
                                          insideOut: true,
                                          bindings: {
                                              texture0: textureManager.getTexture(textures[i])
                                          }});
    
    var transfo =
        (new Cube.core.TransformStackNode({parent: starfieldTransfo}))
        .push(rotations[i])
        .push(new Cube.core.TranslationNode({vector: new Cube.core.math.Vector3(0, 0, 1.0)}));

    scene.push(mat);
    scene.push(transfo);
    scene.push(starfieldGeom);
}

// Halo

var haloMaterial = new Cube.core.MaterialNode({shader: shaderManager.getShader("halo"),
                                               transparent: true,
                                               bindings: {}});

var haloTransfo =
    (new Cube.core.TransformStackNode({parent: earthTransfo}))
    .push(new Cube.core.FaceObjectNode({reference: earthTransfo}))
    .push(new Cube.core.FaceCameraNode({reference: camera.getTransform()}));

var haloGeom =
    Cube.core.GeometryHelpers.buildPlane(
        0.125,
        new Cube.core.OutputToBufferSet({
            hasVertex: true,
            hasNormal: true,
            hasColor: true,
            hasUV: true,
            hasIndex: true,
            factory: renderer.getBufferFactory()}));

scene.push(haloMaterial);
scene.push(haloTransfo);
scene.push(haloGeom);

// Animate

var earthRot = 0;
var a = 0;
animate();

function render() {
    a += Math.PI / 900;
    //a %= Math.PI * 2;
    earthRot += Math.PI / 200;
    earthRot %= Math.PI * 2;

    earthRotation.set(null, earthRot, null);
    cameraRotation.set(null, a, null);

    camera.update();
    earthTransfo.update();
    haloTransfo.update();
    starfieldTransfo.update();

    renderer.clear();
    scene.accept(visitor);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

