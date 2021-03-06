var container = document.createElement('div');
var canvas = document.createElement('canvas');
document.getElementById('container').appendChild(container);
canvas.width =  window.innerWidth;
canvas.height = window.innerHeight;
container.appendChild(canvas);

// -----

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
                                                 shaders: {flat: {src: ["flat-vertex-shader", "flat-fragment-shader"],
                                                                  params: {
                                                                      uniforms: {
                                                                          u_color: renderer.shaderParameterTypes.VEC4
                                                                      }},
                                                                  mappings: mappings,
                                                                  preload: true}}});

var visitor = new Cube.core.RenderVisitor({renderer: renderer});
var scene = new Cube.core.ArrayNode({});

// Viewport

var viewport = new Cube.core.ViewportNode({x: 0, y: 0, width: canvas.width, height: canvas.height});

scene.push(viewport);

// Camera 

var cameraRotation = new Cube.core.RotationXYZNode({});
var cameraTransform =
    new Cube.core.TransformStackNode({})
    .push(cameraRotation)
    .push(new Cube.core.RotationXYZNode({x: -Math.PI/4.0}))
    .push(new Cube.core.TranslationNode({z: 50.0}));

var camera = new Cube.core.CameraNode({optic: new Cube.core.OpticNode({fov: Math.PI*0.3, ratio: canvas.width/canvas.height, near: 0.1, far: 10000}),
                                       parent: cameraTransform});

scene.push(camera);

// -----

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

var transfos = [];

var SUBDIV = 7;
var DELTA = 2.0 * Math.PI / SUBDIV;

function buildCircles(parent, radius, depth) {
    var a = 0.0;
    for (var i = 0; i < SUBDIV; ++i) {
        a += DELTA;

        var localNode = 
            (new Cube.core.TransformStackNode({parent: parent}))
            .push(new Cube.core.RotationXYZNode({}))
            .push(new Cube.core.RotationXYZNode({y: a}))
            .push(new Cube.core.TranslationNode({z: radius}));

        transfos.push(localNode);

        if (depth <= 1) {
            return; // <== 
        }

        buildCircles(localNode, radius/2.0, depth-1);
    }
}

var root = new Cube.core.TransformNode({});
buildCircles(root, 15, 4);

var earthMaterial = new Cube.core.MaterialNode({shader: shaderManager.getShader("flat"),
                                                bindings: {
                                                    u_color: [1.0, 1.0, 0.0, 1.0]}});

var earthGeom =
    Cube.core.GeometryHelpers.buildCube(
    0.2,
    new Cube.core.OutputToBufferSet({
        hasVertex: true,
        hasNormal: true,
        hasColor: true,
        hasUV: true,
        hasIndex: true,
        factory: renderer.getBufferFactory()}));

for (var i = 0; i < transfos.length; ++i) {
    scene.push(earthMaterial);
    scene.push(transfos[i]);
    scene.push(earthGeom);
}

var a1 = (new Cube.anim.Animator({range: new Cube.anim.Range(0, 2.0*Math.PI),
                                  delay: 10000/*, // millisec
                                                ease: Animator.Ease.LINEAR, // LINEAR_SMOOTH, SMOOTH_SMOOTH, SMOOTH_LINEAR
                                                repeat: Animator.Reapeat.LOOP*/ // FORTH_AND_BACK, LOOP, NONE});
                                 }))
    .bind(function(val) {
        for (var i = 0; i < transfos.length; ++i) {
            var node = transfos[i].at(0);
            node.set(val, null, null);
        };
    });

var a2 = (new Cube.anim.Animator({range: new Cube.anim.Scale([0.0, 1.0, 0.0]),
                                  delay: 5000/*, // millisec
                                               ease: Animator.Ease.LINEAR, // LINEAR_SMOOTH, SMOOTH_SMOOTH, SMOOTH_LINEAR
                                               repeat: Animator.Reapeat.LOOP*/ // FORTH_AND_BACK, LOOP, NONE});
                                 }))
    .bind(function(val) {
        earthMaterial.getBinding("u_color").setParameterValue([val, val, val, 1.0]);
    });

var a3 = (new Cube.anim.Animator({range: new Cube.anim.Scale([[0.0, 0.0, 0.0, 1.0],
                                                              [1.0, 0.0, 1.0, 1.0],
                                                              [0.0, 1.0, 1.0, 0.0],
                                                              [0.0, 0.0, 0.0, 1.0]]),
                                  delay: 5000/*, // millisec
                                               ease: Animator.Ease.LINEAR, // LINEAR_SMOOTH, SMOOTH_SMOOTH, SMOOTH_LINEAR
                                               repeat: Animator.Reapeat.LOOP*/ // FORTH_AND_BACK, LOOP, NONE});
                                 }))
    .bind(function(val) {
        earthMaterial.getBinding("u_color").setParameterValue(val);
    });

// Animate

var delta = 1/60.0*1000; // 1/60th of second

animate();

function render() {
    a1.animate(delta);
    a3.animate(delta);

    root.update();
    cameraTransform.update();
    camera.update();

    renderer.clear();
    scene.accept(visitor);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

