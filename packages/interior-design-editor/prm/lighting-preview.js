import * as THREE from "three";
import { GradientEquirectTexture, WebGLPathTracer } from "three-gpu-pathtracer";

// The pinned WebGL release matches the editor's Three.js version.
// A separate scene keeps editing cutaways from becoming openings for daylight.
export function createLightingPreview(renderer, camera, status, fallback) {
  const tracer = new WebGLPathTracer(renderer),
    sky = new GradientEquirectTexture(64),
    view = new THREE.Matrix4(),
    projection = new THREE.Matrix4(),
    ownedMaterials = new Set(),
    ownedGeometries = new Set(),
    previousShaderError = renderer.debug.onShaderError;
  let dirtyAt = performance.now(),
    ready = false,
    sampleLimit = 128,
    lastMotion = 0,
    shaderFailed = false,
    lastStatus = "";
  tracer.bounces = 6;
  tracer.transmissiveBounces = 6;
  tracer.renderScale = 0.65;
  tracer.tiles.set(3, 3);
  tracer.textureSize.set(256, 256);
  tracer.renderDelay = 350;
  tracer.minSamples = 1;
  tracer.rasterizeSceneCallback = fallback;
  renderer.debug.onShaderError = () => {
    shaderFailed = true;
  };
  sky.topColor.set("#c9e0ff");
  sky.bottomColor.copy(sky.topColor).multiplyScalar(0.15);
  sky.update();

  function report(message) {
    if (lastStatus !== message) {
      status.textContent = message;
      lastStatus = message;
    }
  }

  function releaseMaterials() {
    for (const item of ownedMaterials) {
      item.dispose();
    }
    ownedMaterials.clear();
    for (const geometry of ownedGeometries) geometry.dispose();
    ownedGeometries.clear();
  }

  function rebuild(root, sunlight, background) {
    releaseMaterials();
    const snapshot = new THREE.Scene(),
      building = root.clone(true),
      materials = new Map(),
      sun = sunlight.clone();
    function previewMaterial(source) {
      if (!materials.has(source)) {
        const copy = source.userData.windowPane
          ? new THREE.MeshPhysicalMaterial({
              color: "#f5fcff",
              ior: 1.5,
              roughness: 0.05,
              transmission: 1,
              thickness: 0.025,
            })
          : source.clone();
        if (source.userData.enclosure) {
          copy.opacity = 1;
          copy.transparent = false;
          copy.depthWrite = true;
        }
        materials.set(source, copy);
        ownedMaterials.add(copy);
      }
      return materials.get(source);
    }
    building.traverse((node) => {
      node.visible = !node.isLine && !node.isPoints;
      if (node.userData.fullHeight) {
        node.scale.y = 1;
      }
      if (node.isMesh) {
        node.material = Array.isArray(node.material)
          ? node.material.map(previewMaterial)
          : previewMaterial(node.material);
      }
    });
    // This path-tracer release assigns one material index per mesh. Split facade
    // faces in the snapshot so multi-material walls cannot shift later indices.
    const multiMaterialMeshes = [];
    building.traverse(node => {
      if (node.isMesh && Array.isArray(node.material)) multiMaterialMeshes.push(node);
    });
    for (const node of multiMaterialMeshes) {
      const source = node.geometry, faces = new Map();
      for (const group of source.groups) {
        const material = node.material[group.materialIndex];
        if (!faces.has(material)) faces.set(material, []);
        const indices = faces.get(material);
        for (let i = group.start; i < group.start + group.count; i++) {
          indices.push(source.index ? source.index.getX(i) : i);
        }
      }
      for (const [material, indices] of faces) {
        const part = node.clone(false), geometry = source.clone();
        geometry.setIndex(indices);
        geometry.clearGroups();
        ownedGeometries.add(geometry);
        part.geometry = geometry;
        part.material = material;
        node.parent.add(part);
      }
      node.removeFromParent();
    }
    sun.target = sunlight.target.clone();
    snapshot.add(building, sun, sun.target);
    snapshot.environment = sky;
    snapshot.environmentIntensity = (sunlight.intensity / 2.4) * 0.6;
    snapshot.background = background.clone();
    tracer.setScene(snapshot, camera);
    view.copy(camera.matrixWorld);
    projection.copy(camera.projectionMatrix);
    ready = true;
  }

  return {
    setQuality(quality) {
      tracer.renderScale = quality === "fast" ? 0.4 : quality === "high" ? 1 : 0.65;
      sampleLimit = quality === "fast" ? 64 : quality === "high" ? 256 : 128;
      tracer.reset();
    },
    invalidate() {
      dirtyAt = performance.now();
      ready = false;
      report("Preparing realistic lighting…");
    },
    render(root, sunlight, background) {
      if (shaderFailed) {
        throw new Error("The graphics driver could not compile realistic lighting");
      }
      if (!ready) {
        report("Preparing realistic lighting…");
        if (performance.now() - dirtyAt < 250) {
          return false;
        }
        rebuild(root, sunlight, background);
      }
      camera.updateMatrixWorld();
      if (
        camera.matrixWorld.elements.some((value, index) => Math.abs(value - view.elements[index]) > 0.00001) ||
        !projection.equals(camera.projectionMatrix)
      ) {
        lastMotion = performance.now();
        tracer.updateCamera();
        view.copy(camera.matrixWorld);
        projection.copy(camera.projectionMatrix);
      }
      if (performance.now() - lastMotion < 200) return false;
      if (tracer.samples >= sampleLimit) {
        report(`Realistic preview · ${sampleLimit} samples · complete`);
        return true;
      }
      tracer.renderSample();
      report(
        tracer.isCompiling
          ? "Preparing realistic lighting · first use can take a while"
          : tracer.samples < 1
            ? "Realistic preview · stop moving to refine"
            : `Realistic preview · ${Math.floor(tracer.samples)} samples · refining`,
      );
      return true;
    },
    dispose() {
      renderer.debug.onShaderError = previousShaderError;
      tracer.dispose();
      sky.dispose();
      releaseMaterials();
    },
  };
}
