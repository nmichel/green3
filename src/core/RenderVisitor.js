Cube.core.RenderVisitor = function (attributes) {
    Cube.core.Utilities.checkType(attributes.renderer, Cube.core.Renderer, "attribute.renderer should be of type Cube.core.Renderer");

    this.renderer = attributes.renderer;
};

Cube.core.RenderVisitor.prototype = {};
Cube.core.RenderVisitor.prototype.constructor = Cube.core.RenderVisitor;

Cube.core.RenderVisitor.prototype.visitArrayBegin = function(length) {
};

Cube.core.RenderVisitor.prototype.visitArrayEnd = function() {
};

Cube.core.RenderVisitor.prototype.visitViewport = function(viewportNode) {
    this.renderer.setViewport(viewportNode.getX(), viewportNode.getY(), viewportNode.getWidth(), viewportNode.getHeight());
};

Cube.core.RenderVisitor.prototype.visitOptic = function(opticNode) {
    this.renderer.loadProjectionTransformation(opticNode.getMatrix());
};

Cube.core.RenderVisitor.prototype.visitTransform = function(transformNode) {
    this.renderer.loadModelTransformation(transformNode.getMatrix());
    this.renderer.loadNormalTransformation(transformNode.getNormal());
};

Cube.core.RenderVisitor.prototype.visitView = function(viewNode) {
    this.renderer.loadViewTransformation(viewNode.getInvert());
};

Cube.core.RenderVisitor.prototype.visitBufferSet = function(bufferSetNode) {
    // FIXME : awkward ! rendering mode is hardwired ...
    // 
    this.renderer.renderBufferSet(this.renderer.mode.ELEMENT, bufferSetNode);
};

Cube.core.RenderVisitor.prototype.visitShader = function(shaderNode) {
    this.renderer.useShader(shaderNode);
};

Cube.core.RenderVisitor.prototype.visitTexture = function(textureNode) {
    this.renderer.useTexture(textureNode);
};

Cube.core.RenderVisitor.prototype.visitMaterial = function(materialNode) {
    this.renderer.deactivateAllTextureUnits();
    this.renderer.deactivateAllLights();
    this.renderer.setTransparentMode(materialNode.isTransparent());
};

Cube.core.RenderVisitor.prototype.visitMaterialBinding = function(materialBindingNode) {
    var paramName = materialBindingNode.getParameterName();
    var paramType = materialBindingNode.getParameterType();
    var paramValue = materialBindingNode.getParameterValue();
    this.renderer.bindShaderParamWithValue(paramName, paramType, paramValue);
};

Cube.core.RenderVisitor.prototype.visitLightAmbiant = function(lightAmbiantNode) {
    this.renderer.addAmbiantLight(lightAmbiantNode);
};

Cube.core.RenderVisitor.prototype.visitLightDirectional = function(lightDirectionalNode) {
    this.renderer.addDirectionalLight(lightDirectionalNode);
};

Cube.core.RenderVisitor.prototype.visitLightPositional = function(lightPositionalNode) {
    this.renderer.addPositionalLight(lightPositionalNode);
};
