import bpy
import sys
import functools
import textwrap
import mathutils

def expand(acc, t):
    acc.extend(t)
    return acc

# -----

class BlenderMeshVisitor:
    def __init__(self):
        pass
    
    def enterMesh(self, mesh, hasFlat):
        self._mesh = mesh
        self._hasFlat = hasFlat
    
    def leaveMesh(self):
        pass

    def enterPolygon(self, poly):
        pass
    
    def leavePolygon(self):
        pass
    
    def visitPolygonVertex(self, vertex):
        pass

# -----

class SingleMeshBlenderMeshVisitor(BlenderMeshVisitor):
    def __init__(self):
        super().__init__()

    def enterMesh(self, mesh, hasFlat):
        super().enterMesh(mesh, hasFlat)
        self._vertices =  []
        self._indices =  []
        
    def leaveMesh(self):
        super().leaveMesh()

    def enterPolygon(self, poly):
        v = mathutils.Vector(poly.normal)
        v.normalize()
        self._faceNormal = v
        self._smooth = poly.use_smooth
        
    def visitPolygonVertex(self, vertex):
        if self._hasFlat:
            if not self._smooth:
               vertex[1] = self._faceNormal
    
        gen = (i for i,x in enumerate(self._vertices) if x == vertex)
        try:
            idx = next(gen)
            self._indices.append(idx)
        except StopIteration:
            self._indices.append(len(self._vertices))
            self._vertices.append(vertex)

    def output(self, output):
        rawpositions = functools.reduce(expand, [(v[0].x, v[0].y, v[0].z) for v in self._vertices], [])
        rawnormals = functools.reduce(expand, [(v[1].x, v[1].y, v[1].z) for v in self._vertices], [])
        rawuv = functools.reduce(expand, [(v[2].x, v[2].y) for v in self._vertices], [])
        rawcolors = functools.reduce(expand, [(v[3].r, v[3].g, v[3].b, 1.0) for v in self._vertices], [])
        
        output.write(
            textwrap.dedent(
            '''\
            {"model": { \n\
            \t"types": {\n\
            \t\t"vf2": ["FLOAT", 2],\n\
            \t\t"vf3": ["FLOAT", 3],\n\
            \t\t"vf4": ["FLOAT", 4]\n\
            \t},\n\
            \t"attributes": {\n\
            \t\t"position": "vf3",\n\
            \t\t"normal":   "vf3",\n\
            \t\t"color":    "vf4",\n\
            \t\t"uv":       "vf2",\n\
            \t\t"tangent":  "vf4"\n\
            \t},\n\
            '''))
        output.write('\t"vertices": {\n' )
        output.write('\t\t"count": {},\n'.format(len(self._vertices)))
        output.write('\t\t"data": {\n')
        output.write('\t\t\t"position": {},\n'.format(rawpositions))
        output.write('\t\t\t"normal": {},\n'.format(rawnormals))
        output.write('\t\t\t"color": {},\n'.format(rawcolors))
        output.write('\t\t\t"uv": {}\n'.format(rawuv))
        output.write('\t\t}\n')
        output.write('\t},\n')
        output.write('\t"submeshes": [\n')
        output.write('\t\t{\n' )
        output.write('\t\t\t"material": "{}",\n'.format("material"))
        output.write('\t\t\t"indices": {}\n'.format(self._indices))
        output.write('\t\t}')
        output.write(']}}\n')

# -----

class MultiMeshBlenderMeshVisitor(BlenderMeshVisitor):
    def __init__(self):
        super().__init__()

    def enterMesh(self, mesh, hasFlat):
        super().enterMesh(mesh, hasFlat)
        self._meshes = {}

    def leaveMesh(self):
        super().leaveMesh()

    def enterPolygon(self, poly):
        mat = self._mesh.materials[poly.material_index].name
        self._submesh = self._getMeshDesc(mat)

        v = mathutils.Vector(poly.normal)
        v.normalize()
        self._faceNormal = v
        self._smooth = poly.use_smooth
    
    def visitPolygonVertex(self, vertex):
        if self._hasFlat:
            if not self._smooth:
               vertex[1] = self._faceNormal
    
        gen = (i for i,x in enumerate(self._submesh['vertices']) if x == vertex)
        try:
            idx = next(gen)
            self._submesh['indices'].append(idx)
        except StopIteration:
            self._submesh['indices'].append(len(self._submesh['vertices']))
            self._submesh['vertices'].append(vertex)

    def output(self, output):
        vertices = []
        submeshes = []
        base = len(vertices)
        for k, v in self._meshes.items():
            vertices.extend(v['vertices'])
            indices = [x + base for x in v['indices']]
            base = base + len(v['vertices'])
            submeshes.append([k, indices])

        rawpositions = functools.reduce(expand, [(v[0].x, v[0].y, v[0].z) for v in vertices], [])
        rawnormals = functools.reduce(expand, [(v[1].x, v[1].y, v[1].z) for v in vertices], [])
        rawuv = functools.reduce(expand, [(v[2].x, v[2].y) for v in vertices], [])
        rawcolors = functools.reduce(expand, [(v[3].r, v[3].g, v[3].b, 1.0) for v in vertices], [])

        output.write(
            textwrap.dedent(
            '''\
           {"model": { \n\
           \t"types": {\n\
           \t\t"vf2": ["FLOAT", 2],\n\
           \t\t"vf3": ["FLOAT", 3],\n\
           \t\t"vf4": ["FLOAT", 4]\n\
           \t},\n\
           \t"attributes": {\n\
           \t\t"position": "vf3",\n\
           \t\t"normal":   "vf3",\n\
           \t\t"color":    "vf4",\n\
           \t\t"uv":       "vf2",\n\
           \t\t"tangent":  "vf4"\n\
           \t},\n\
           '''))
        output.write('\t"vertices": {\n' )
        output.write('\t\t"count": {},\n'.format(len(vertices)))
        output.write('\t\t"data": {\n')
        output.write('\t\t\t"position": {},\n'.format(rawpositions))
        output.write('\t\t\t"normal": {},\n'.format(rawnormals))
        output.write('\t\t\t"color": {},\n'.format(rawcolors))
        output.write('\t\t\t"uv": {}\n'.format(rawuv))
        output.write('\t\t}\n')
        output.write('\t},\n')
        output.write('\t"submeshes": [\n')
        count = 1
        for [n, i] in submeshes:
            output.write('\t\t{\n' )
            output.write('\t\t\t"material": "{}",\n'.format(n))
            output.write('\t\t\t"indices": {}\n'.format(i))
            output.write('\t\t}')
            if count < len(submeshes):
                output.write(',\n')
            else:
                output.write('\n')
            count = count + 1
        output.write(']}}\n')

    def _getMeshDesc(self, name):
        mesh = None
        if name not in self._meshes:
            mesh = {'vertices': [],
                    'indices': [],
                    'material': name}
            self._meshes[name] = mesh
        else:
            mesh = self._meshes[name]
        return mesh

# -----

class MeshExplorer:
    def __init__(self):
        self._reset(None, None);

    def exploreMesh(self, mesh, visitor, hasFlat):
        self._reset(mesh, visitor)
        visitor.enterMesh(mesh, hasFlat)
        for poly in mesh.polygons:
            self._explorePolygon(poly)
        visitor.leaveMesh()
    
    def _reset(self, mesh, visitor):
        self._mesh = mesh
        self._visitor = visitor

        self._uf = None
        self._uc = None
        if self._mesh:
            if self._mesh.uv_layers.active:
                self._uf = self._mesh.uv_layers.active.data
            if self._mesh.vertex_colors.active:
                self._uc = self._mesh.vertex_colors.active.data

    def _explorePolygon(self, poly):
        self._visitor.enterPolygon(poly)
        for loop_index in range(poly.loop_start, poly.loop_start + poly.loop_total):
            co = self._mesh.vertices[self._mesh.loops[loop_index].vertex_index].co
            normal = self._mesh.vertices[self._mesh.loops[loop_index].vertex_index].normal
            color = None
            uv = None
            if self._uf:
                uv = self._uf[loop_index].uv
            if self._uc:
                color = self._uc[loop_index].color

            vert = [co, normal, uv, color]
            self._visitor.visitPolygonVertex(vert)
        self._visitor.leavePolygon()

try:
    mesh = bpy.data.meshes[1]
    
    print("opening output file")    
    output = open('C:/Users/nmichel/Desktop/myText.txt', 'w')
#    output = open('C:/Users/nicolas/Desktop/myText.txt', 'w')

    print("exporting")
    try:
        explorer = MeshExplorer()
        visitor = MultiMeshBlenderMeshVisitor()
#        visitor = SingleMeshBlenderMeshVisitor()
        explorer.exploreMesh(mesh, visitor, True)
        visitor.output(output)
    except:
        print("Failed to export mesh data {}".format(sys.exc_info()[1]))

    print("closing file")
    output.close()
except:
    print("Failed to open file")
finally:
    print("finished")
