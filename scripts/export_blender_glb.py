# Blender Headless / One-Click GLB Export Script
# Usage: blender your_scene.blend --background --python export_blender_glb.py -- /path/to/public/models/room.glb

import bpy
import sys
import os

def export_optimized_glb(output_path):
    print(f"[+] Starting GLB export to: {output_path}")

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Select all mesh objects
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.context.scene.objects:
        if obj.type in {'MESH', 'LIGHT', 'CAMERA'}:
            obj.select_set(True)

    # Export glTF binary (.glb) with web optimizations
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        use_selection=True,
        export_apply=True, # Apply all modifiers automatically
        export_yup=True,   # Three.js +Y Up convention
        export_texcoords=True,
        export_normals=True,
        export_draco_mesh_compression_enable=True, # Built-in Draco compression
        export_draco_mesh_compression_level=7,
        export_materials='EXPORT',
        export_colors=True,
        export_cameras=True,
        export_lights=True
    )

    file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"[✓] GLB successfully exported! Size: {file_size_mb:.2f} MB")

if __name__ == "__main__":
    args = sys.argv
    if "--" in args:
        output_file = args[args.index("--") + 1]
    else:
        output_file = os.path.abspath("../public/models/room.glb")
    
    export_optimized_glb(output_file)
