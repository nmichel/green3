$(function() {
    var container = document.createElement('div');
    var canvas = document.createElement('canvas');
    $('#content').append(container);
    canvas.width =  window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);
    
    // -----
    
    var engine = new Cube.core.Engine({canvas: canvas});
    var renderer = engine.getRenderer();
    var shaderManager = new Cube.core.ShaderManager({engine: engine,
						                             loader: new Cube.core.ResourceLoader({}),
						                             shaders: {
                                                         lighting: {src: ["vertex-shader-2", "fragment-shader-2"],
								                                    params: {
								                                        uniforms: {
                                                                            u_color: renderer.shaderParameterTypes.VEC4
                                                                        }},
								                                    preload: true}
                                                     }});
    
    var visitor = new Cube.core.RenderVisitor({renderer: renderer});
    var scene = new Cube.core.Scene({});
    
    // Viewport
    
    var viewport = new Cube.core.ViewportNode({x: 0, y: 0, width: canvas.width, height: canvas.height});
    scene.setViewport(viewport);
    
    // Camera 
    
    var cameraTransform =
        new Cube.core.TransformStackNode({})
        .push(new Cube.core.RotationXYZNode({}))
        .push(new Cube.core.TranslationNode({z: 3.5}))
        .update();
    var camera = new Cube.core.CameraNode({optic: new Cube.core.OpticNode({fov: Math.PI*0.5*0.9, ratio: canvas.width/canvas.height, near: 1, far: 1000}),
                                           parent: cameraTransform});
    scene.setCamera(camera);
    
    // Light
    
    //var ambiantLight = new Cube.core.LightAmbiantNode({color: [0.5, 0.0, 0.0, 0.0]});
    //var directionalLight = new Cube.core.LightDirectionalNode({color: [0.0, 1.0, 0.0, 0.0],
    //                                                           direction: [1.0, 0.0, 0.0]});
    var positionalLight = new Cube.core.LightPositionalNode({color: [0.0, 1.0, 1.0, 0.0],
                                                             position: [0.0, 0.0, 0.0, 1.0]});
    var transfoLight =
        new Cube.core.TransformStackNode({})
        .push(new Cube.core.RotationXYZNode({}))
        .push(new Cube.core.TranslationNode({z: 4}));
    transfoLight.update();
    scene.addLight(new Cube.core.LightSourceNode({light: positionalLight, transform: transfoLight}));
    
    // Earth
    
    var modelTransfo =
        (new Cube.core.TransformStackNode({}))
        .push(new Cube.core.RotationXYZNode({}))
        .push(new Cube.core.TranslationNode({}))
        .update();
    
    // Animate
    
    var earthRot = 0;
    var a = 0;
    animate();
    
    function render() {
        a += Math.PI / 200;
        a %= Math.PI * 2;
        earthRot += Math.PI / 300;
        earthRot %= Math.PI * 2;
        
        //    transfoLight.at(0).set(null, a, null);
        //    transfoLight.update();
        
        modelTransfo.at(0).set(null, a, null);
        modelTransfo.update();
        
        renderer.clear();
        scene.visit(visitor);
    }
    
    function animate() {
        requestAnimationFrame(animate);
        render();
    }
    
    var colors = [[1.0, 1.0, 1.0, 1.0],
                  [1.0, 1.0, 0.0, 1.0],
                  [0.0, 1.0, 1.0, 1.0],
                  [1.0, 0.0, 1.0, 1.0],
                  [0.0, 0.0, 1.0, 1.0],
                  [0.0, 1.0, 0.0, 1.0],
                  [1.0, 0.0, 0.0, 1.0]
                 ]
    
    var currentObject = null;

    // Build the list of models which can be loaded from server, and populate a combo box with it.
    // 
    function initMenu() {
        var height = $('#menu').height();
        var animating = false;
        $('#menu').mouseleave(function() {
            if (animating) {
                return; // <== 
            }
            animating = true;
            $(this).animate({
                top: -height
            }, 500, function() {
                animating = false;
            });
        });
        $('#content').mousemove(function(event) {
            if (event.pageY < 70) {
                if (animating) {
                    return; // <== 
                }
                animating = true;
                $('#menu').animate({
                    top: 0
                }, 500, function() {
                    animating = false;
                });
            }
        });
    }

    var list = $('<select id="ComboBox"/>');
    $("#menu").append(list);

    $.getJSON('files.json', function(data) {
        var items = [];
        for (var i = 0; i < data.files.length; ++i) {
            items.push("<option value='" + data.files[i] + "'>" + data.files[i] + "</option>");
        }
        list.append(items.join());
        initMenu();
    });

    // On value change of the combo box, load and display the relative file
    // 
    $("#ComboBox").change(function() {
        if (currentObject != null) {
            scene.removeObject(currentObject);
            currentObject = null;
        }
        
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState == 4) {
                if (httpRequest.status == 200) {
                    var rawMesh = JSON.parse(httpRequest.responseText);
                    var buffers = new Cube.core.BufferSetNode({factory: renderer.getBufferFactory()});
                    for (var b in rawMesh.model.vertices.data) {
                        var name = (b == "position" ? "vertex" : b);
                        buffers.createAttributeBuffer(name, rawMesh.model.vertices.data[b]);
                    }
                    
                    var submeshes = [];
                    for (var i = 0; i < rawMesh.model.submeshes.length; ++i) {
                        var subMeshDesc = rawMesh.model.submeshes[i];
                        var subMeshBuff = new Cube.core.BufferSetNode({factory: renderer.getBufferFactory()});
                        subMeshBuff.createIndexBuffer("index", subMeshDesc.indices);
                        
                        var mat = new Cube.core.MaterialNode({shader: shaderManager.getShader("lighting"),
						                                      bindings: {
                                                                  u_color: colors[i%colors.length]
                                                              }});

                        submeshes.push({material: mat, geometry: subMeshBuff});
                    }

                    currentObject = new Cube.core.Object({transformation: modelTransfo, geometry: buffers, submeshes: submeshes});
                    scene.addObject(currentObject);
                }
                else {
                    console.log("Failed to load file from server.");
                }
            }
        }
        
        httpRequest.open("GET", $("#ComboBox option:selected").text(), true);
        httpRequest.send();
    });
});
