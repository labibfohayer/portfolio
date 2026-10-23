# Blender 3D to WebGL (.glb) Optimization Workflow
## For Interactive 3D Room Portfolios (Henry Heffernan & Lusion Style)

This guide documents the production-grade pipeline for modeling, baking, exporting, and loading 3D room environments in Next.js with `@react-three/fiber` and Three.js.

---

### 1. Blender Modeling Guidelines
- **Scene Scale:** Set Blender Units to **Metric** with **Unit Scale = 1.0** (1 Blender unit = 1 meter in Three.js).
- **Origin Pivot Points:** 
  - Ensure the room ground is at `Z = 0`.
  - Set pivots of interactable objects (Mac mini, Monitor, Chair, Posters) to their logical base (`Object > Set Origin > Origin to Geometry` or `3D Cursor at Base`).
- **Polygon Budget:**
  - Keep the full room mesh under **80,000 to 150,000 polygons**.
  - Apply Bevel modifiers (`Segments: 2, Width: 2-4mm`) to catch realistic specular highlights, then use **Shade Auto Smooth**.
- **Naming Conventions:** Name interactable meshes clearly (e.g. `MacMini`, `Monitor_Screen`, `Frame_01`, `Lamp_Bulb`, `Helmet`).

---

### 2. Materials & Texture Baking (Light Baking)
For photorealistic Henry Heffernan / Lusion aesthetic at 120 FPS without heavy runtime lights:
1. **UV Unwrap:** Select all static room elements (`A`), press `U > Smart UV Project` with `Island Margin: 0.003`.
2. **Bake Ambient Occlusion & Diffuse:**
   - In Cycles render engine, use the **Bake** panel.
   - Bake type: `Combined` or `Diffuse` + `Ambient Occlusion`.
   - Texture resolution: **2048x2048** (main room) and **1024x1024** (props).
3. **Principled BSDF:** Only use Blender's default `Principled BSDF` shader nodes (unsupported shader nodes will not export to glTF).

---

### 3. Exporting to .glb from Blender
Export via `File > Export > glTF 2.0 (.glb/.gltf)` with these exact settings:
- **Format:** `glTF Binary (.glb)`
- **Include:** `Selected Objects` (or visible objects)
- **Transform:** `+Y Up` (Checked)
- **Geometry:**
  - `Apply Modifiers`: Checked
  - `UVs`: Checked
  - `Normals`: Checked
  - `Tangents`: Checked (if using normal maps)
  - `Compression (Draco)`: Checked (reduces file size by 70%)
- **Animation / Skinning:** Enable only if your room has character or mechanical animations.

---

### 4. CLI Compression & Optimization Pipeline
Use `@gltf-transform/cli` to compress textures to modern WebP / KTX2:

```bash
# Install gltf-transform globally
npm install --global @gltf-transform/cli

# Deduplicate, weld vertices, and Draco-compress
gltf-transform optimize public/models/raw_room.glb public/models/room.glb --compress draco

# Optional: Compress textures inside GLB to WebP
gltf-transform webp public/models/room.glb public/models/room_optimized.glb
```

---

### 5. Generating React Three Fiber Components (`gltfjsx`)
Generate type-safe declarative JSX components from your `.glb` file:

```bash
npx gltfjsx public/models/room.glb -t -r public/
```

This creates a `Room.tsx` component that preloads geometries and materials with full TypeScript types, ready to mount inside `<Canvas>`.
