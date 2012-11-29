import bpy

class ExplorePolygon():
    def __init__(p_self, p_mesh, p_poly, p_data):
        f_mat = p_mesh.materials[p_poly.material_index]
        uf = None
        uc = None
        vertices = p_data['vertices']['data']
        indices = p_data['indices']['data']
        if p_mesh.uv_layers.active:
            uf = p_mesh.uv_layers.active.data
        if p_mesh.vertex_colors.active:
            uc = p_mesh.vertex_colors.active.data
        for loop_index in range(p_poly.loop_start, p_poly.loop_start + p_poly.loop_total):
            p_data['vertices']['count'] += 1
            co = p_mesh.vertices[p_mesh.loops[loop_index].vertex_index].co
            vertices['position'].extend([co.x, co.y, co.z])
            normal = p_mesh.vertices[p_mesh.loops[loop_index].vertex_index].normal
            vertices['normal'].extend([normal.x, normal.y, normal.z])
            if uf:
                uv = uf[loop_index].uv
                vertices['uv'].extend([uv.x, uv.y])
            if uc:
                color = uc[loop_index].color
                vertices['color'].extend([color.r, color.g, color.b])
            indices.append(len(indices))

class ExploreMesh():
    def __init__(p_self, p_mesh, p_data):
        for poly in p_mesh.polygons:
            ExplorePolygon(p_mesh, poly, p_data)
 
try:
    mesh = bpy.data.meshes[1]
    
    print("opening output file")
    output = open('C:/Users/nmichel/Desktop/myText.txt', 'w')

    print("exporting")
    try:
        data = {"vertices": {"count": 0,
                             "data": {"position": [],
                                      "normal": [],
                                      "color": [],
                                      "uv": []}},
                "indices": {"count": 0,
                            "data": []}}
        ExploreMesh(mesh, data)

        output.write(
'\
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
')
        output.write('"vertices":{\n' )
        output.write('\t"count": {},\n'.format(data['vertices']['count']))
        output.write('\t"data":{\n')
        for k, v in data['vertices']['data'].items():
            output.write('\t\t"{}": {}\n'.format(k, v))
        output.write('}},\n')
        output.write('"indices":{\n' )
        output.write('\t"count": {},\n'.format(len(data['indices']['data'])))
        output.write('\t"data": {}\n'.format(data['indices']['data']))
        output.write('}}}\n')

#        for k, v in data.items():
#            output.write("{}: {}\n".format(k, v))
            
    except:
        print("Failed to export mesh data")
        
    print("closing file")
    output.close()
except:
    print("Failed to open file")
finally:
    print("finished")