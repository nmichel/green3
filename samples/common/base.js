var error = function(msg) {
    if (window.console) {
	if (window.console.error) {
	    window.console.error(msg);
	}
	else if (window.console.log) {
	    window.console.log(msg);
	}
    }
};

var loadShader = function(gl, shaderSource, shaderType, opt_errorCallback) {
    var errFn = opt_errorCallback || error;
  // Create the shader object
    var shader = gl.createShader(shaderType);

  // Load the shader source
    gl.shaderSource(shader, shaderSource);

  // Compile the shader
    gl.compileShader(shader);

  // Check the compile status
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
    // Something went wrong during compilation; get the error
	lastError = gl.getShaderInfoLog(shader);
	errFn("*** Error compiling shader '" + shader + "':" + lastError);
	gl.deleteShader(shader);
	return null;
    }

    return shader;
}

var createShaderFromScript = function(
    gl, scriptId, opt_shaderType, opt_errorCallback) {
    var shaderSource = "";
    var shaderType;
    var shaderScript = document.getElementById(scriptId);
    if (!shaderScript) {
	throw("*** Error: unknown script element" + scriptId);
    }
    shaderSource = shaderScript.text;

    if (!opt_shaderType) {
	if (shaderScript.type == "x-shader/x-vertex") {
	    shaderType = gl.VERTEX_SHADER;
	} else if (shaderScript.type == "x-shader/x-fragment") {
	    shaderType = gl.FRAGMENT_SHADER;
	} else if (shaderType != gl.VERTEX_SHADER && shaderType != gl.FRAGMENT_SHADER) {
	    throw("*** Error: unknown shader type");
	    return null;
	}
    }

    return loadShader(
	gl, shaderSource, opt_shaderType ? opt_shaderType : shaderType,
	opt_errorCallback);
};

var loadProgram = function(
    gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
    var errFn = opt_errorCallback || error;
    var program = gl.createProgram();
    for (var ii = 0; ii < shaders.length; ++ii) {
	gl.attachShader(program, shaders[ii]);
    }
    if (opt_attribs) {
	for (var ii = 0; ii < opt_attribs.length; ++ii) {
	    gl.bindAttribLocation(
		program,
		opt_locations ? opt_locations[ii] : ii,
		opt_attribs[ii]);
	}
    }
    gl.linkProgram(program);

  // Check the link status
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      // something went wrong with the link
	lastError = gl.getProgramInfoLog (program);
	errFn("Error in program linking:" + lastError);

	gl.deleteProgram(program);
	return null;
    }
    return program;
};

