import * as THREE from "three";

// Accumulate direct lighting in linear HDR batches. Every fixture contributes;
// camera movement never selects which fixtures are allowed to illuminate a room.
export function createFixtureRenderer(renderer, scene, camera, sunlight) {
  const passTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
  const sumTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false });
  const quadScene = new THREE.Scene(), quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const vertexShader = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';
  const sumMaterial = new THREE.ShaderMaterial({
    uniforms: { source: { value: passTarget.texture } }, vertexShader,
    fragmentShader: 'uniform sampler2D source; varying vec2 vUv; void main() { gl_FragColor = texture2D(source, vUv); }',
    blending: THREE.AdditiveBlending, transparent: true, depthTest: false, depthWrite: false, toneMapped: false,
  });
  const outputMaterial = new THREE.ShaderMaterial({
    uniforms: { source: { value: sumTarget.texture } }, vertexShader,
    fragmentShader: `uniform sampler2D source; varying vec2 vUv;
      void main() { gl_FragColor = vec4(texture2D(source, vUv).rgb, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    depthTest: false, depthWrite: false,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), sumMaterial);
  quadScene.add(quad);
  const size = new THREE.Vector2(), black = new THREE.Color(0);
  return function renderFixtures() {
    const lights = [], materials = new Set();
    scene.traverseVisible(node => {
      if (node.isPointLight && node.intensity > 0) lights.push(node);
      for (const material of [node.material].flat().filter(Boolean)) materials.add(material);
    });
    if (lights.length <= 4) {
      renderer.render(scene, camera);
      return;
    }
    renderer.getDrawingBufferSize(size);
    if (passTarget.width !== size.x || passTarget.height !== size.y) {
      passTarget.setSize(size.x, size.y);
      sumTarget.setSize(size.x, size.y);
    }
    const saved = {
      target: renderer.getRenderTarget(), toneMapping: renderer.toneMapping,
      autoClear: renderer.autoClear, background: scene.background,
      sunVisible: sunlight.visible, shadows: renderer.shadowMap.needsUpdate,
      clearColor: renderer.getClearColor(new THREE.Color()), clearAlpha: renderer.getClearAlpha(),
    };
    const emission = [...materials].filter(m => m.emissive).map(m => [m, m.emissiveIntensity]);
    const unlit = [...materials].filter(m => !m.isMeshStandardMaterial && !m.isMeshPhysicalMaterial && m.colorWrite).map(m => [m, m.colorWrite]);
    try {
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.setClearColor(0, 1);
      renderer.setRenderTarget(sumTarget);
      renderer.clear();
      for (let start = 0; start < lights.length; start += 4) {
        lights.forEach((light, index) => { light.visible = index >= start && index < start + 4; });
        if (start > 0) {
          scene.background = black;
          sunlight.visible = false;
          emission.forEach(([material]) => { material.emissiveIntensity = 0; });
          unlit.forEach(([material]) => { material.colorWrite = false; });
        }
        renderer.shadowMap.needsUpdate = saved.shadows;
        renderer.autoClear = true;
        renderer.setRenderTarget(passTarget);
        renderer.render(scene, camera);
        renderer.autoClear = false;
        renderer.setRenderTarget(sumTarget);
        quad.material = sumMaterial;
        renderer.render(quadScene, quadCamera);
      }
      renderer.toneMapping = saved.toneMapping;
      renderer.setRenderTarget(saved.target);
      renderer.autoClear = true;
      quad.material = outputMaterial;
      renderer.render(quadScene, quadCamera);
    } finally {
      lights.forEach(light => { light.visible = true; });
      emission.forEach(([material, intensity]) => { material.emissiveIntensity = intensity; });
      unlit.forEach(([material, colorWrite]) => { material.colorWrite = colorWrite; });
      sunlight.visible = saved.sunVisible;
      scene.background = saved.background;
      renderer.toneMapping = saved.toneMapping;
      renderer.autoClear = saved.autoClear;
      renderer.setClearColor(saved.clearColor, saved.clearAlpha);
      renderer.setRenderTarget(saved.target);
    }
  };
}
