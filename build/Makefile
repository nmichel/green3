SRCDIR = ../src
DEPLOYDIR = ../deploy
DEPLOYDIRJS = $(DEPLOYDIR)/js

FILELIST = \
	./cube.js \
	./core/core.js \
	./core/math/math.js \
	./core/math/Vector3.js \
	./core/math/Matrix4.js \
	./core/Utilities.js \
	./core/RenderVisitor.js \
	./core/Node.js \
	./core/ArrayNode.js \
	./core/BufferSetNode.js \
	./core/OutputToBufferSet.js \
	./core/GeometryNode.js \
	./core/MeshNode.js \
	./core/OpticNode.js \
	./core/OrthographicOpticNode.js \
	./core/TransformNode.js \
	./core/RotationXYZNode.js \
	./core/ScalingNode.js \
	./core/TranslationNode.js \
	./core/FaceCameraNode.js \
	./core/FaceObjectNode.js \
	./core/TransformStackNode.js \
	./core/ViewNode.js \
	./core/ViewportNode.js \
	./core/GeometryHelpers.js \
	./core/MeshLoader.js \
	./core/ShaderNode.js \
	./core/TextureNode.js \
	./core/ResourceLoader.js \
	./core/ShaderManager.js \
	./core/TextureManager.js \
	./core/MaterialBindingNode.js \
	./core/MaterialNode.js \
	./core/LightAmbiantNode.js \
	./core/LightDirectionalNode.js \
	./core/LightPositionalNode.js \
	./core/CameraNode.js \
	./core/ObjectEnlighterNode.js \
	./core/Object.js \
	./core/Scene.js \
	./core/Engine.js \
	./core/Renderer.js

all: clean concat minify

clean:
	@echo "* Cleaning"
	@rm -rf $(DEPLOYDIR)

concat:
	@echo "* Concating files"
	@mkdir -p $(DEPLOYDIR)
	@mkdir -p $(DEPLOYDIRJS)
	@echo -n "/* Generated on " > $(DEPLOYDIRJS)/green3.js
	@date -R >> $(DEPLOYDIRJS)/green3.js
	@echo "*/ " >> $(DEPLOYDIRJS)/green3.js
	@for file in $(FILELIST); \
	do \
		cat $(SRCDIR)/$$file >> $(DEPLOYDIRJS)/green3.js; \
	done

minify:
	@echo "* Minifying (YUI)"
	@java -jar ./tools/yuicompressor-2.4.7.jar --charset UTF8 --line-break 4000 -v -o $(DEPLOYDIRJS)/green3.min.js $(DEPLOYDIRJS)/green3.js > /dev/null 2>&1 

check-with-jslint:
	@for file in $(FILELIST); \
	do \
		echo "* Scanning " $$file; \
		java -jar ./tools/jslint4java-1.4.7.jar $(SRCDIR)/$$file; \
	done

check-with-yui:
	@for file in $(FILELIST); \
	do \
		echo "* processing " $$file; \
		java -jar ./tools/yuicompressor-2.4.7.jar --charset UTF8 --line-break 4000 -v $(SRCDIR)/$$file; \
	done

minify-with-closure-copiler:
	@echo "* Minifying (Google Closure Compiler)"
	@java -jar ./tools/compiler.jar --js $(DEPLOYDIRJS)/green3.js --js_output_file $(DEPLOYDIRJS)/green3.min.js

