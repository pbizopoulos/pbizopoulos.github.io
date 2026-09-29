import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export const lightAssets = ["ceiling_light", "fluorescent_light", "pendant_light", "track_light", "downlight", "garden_lamp", "lantern", "lamp", "table_lamp", "wall_lamp"];
export const overheadLights = lightAssets.slice(0, 5);

export function sharedWall(room, other, dir) {
  if (room === other || room.floor !== other.floor) return false;
  const horizontalOverlap = other.x < room.x + room.cols && other.x + other.cols > room.x;
  const verticalOverlap = other.z < room.z + room.rows && other.z + other.rows > room.z;
  return dir === "north" ? other.z + other.rows === room.z && horizontalOverlap
    : dir === "south" ? other.z === room.z + room.rows && horizontalOverlap
      : dir === "east" ? other.x === room.x + room.cols && verticalOverlap
        : other.x + other.cols === room.x && verticalOverlap;
}

// Example additions are written into the language, never hidden renderer defaults.
export function enrichExample(source, parse, name = "") {
  const program = parse(source), lines = source.split("\n");
  for (const room of program.rooms) {
    const additions = [];
    if (room.kind !== "balcony") {
      const exterior = ["north", "east", "south", "west"].filter(dir => !program.rooms.some(other => sharedWall(room, other, dir)));
      const walls = [...new Set([...room.walls, ...exterior])];
      const wallCommand = `WALLS ${walls.join(" ") || "none"}`;
      if (room.wallsLine) lines[room.wallsLine - 1] = wallCommand;
      else additions.push(wallCommand);
      const eligible = exterior.filter(dir => (dir === "east" || dir === "west" ? room.rows : room.cols) * program.grid > 2.2);
      const doors = [...room.doors];
      // Keep entrances and connecting doors, but use a redundant exterior door wall for a window.
      if (eligible.length && eligible.every(dir => doors.includes(dir)) && doors.length > 1) {
        doors.splice(doors.indexOf(eligible[0]), 1);
        const doorCommand = `DOORS ${doors.join(" ")}`;
        if (room.doorsLine) lines[room.doorsLine - 1] = doorCommand;
        else additions.push(doorCommand);
      }
      const windows = eligible.filter(dir => !doors.includes(dir));
      const command = `WINDOWS ${windows.join(" ") || "none"}`;
      if (room.windowsLine) lines[room.windowsLine - 1] = command;
      else additions.push(command);
      if (!windows.length) additions.push("# Enclosed room: artificial lighting; no eligible exterior window wall.");
    }
    const existing = program.layouts[room.name].flat().filter(token => token && lightAssets.includes(token.name)).length
      + room.mounts.filter(mount => mount.name === "wall_lamp").length + room.lights.length;
    const desired = Math.max(room.kind === "balcony" ? 1 : 2, Math.min(6, Math.ceil(room.cols * room.rows * program.grid ** 2 / 24)));
    const occupiedLights = [];
    for (let i = existing; i < desired; i++) {
      const fraction = (i + 1) / (desired + 1);
      let x = ((room.cols - 1) * fraction).toFixed(1), z = ((room.rows - 1) * (i % 2 ? 0.65 : 0.35)).toFixed(1);
      const asset = room.kind === "balcony" ? (i % 2 ? "lantern" : "garden_lamp")
        : room.style === "industrial" ? "track_light" : room.style === "liminal" ? "fluorescent_light"
          : room.style === "aquatic" ? "downlight" : i % 2 ? "pendant_light" : "downlight";
      if (room.kind === "balcony") {
        const candidates = [];
        const layout = program.layouts[room.name];
        for (let row = 0; row < room.rows; row++) for (let col = 0; col < room.cols; col++) {
          const clear = !layout[row]?.[col] && !occupiedLights.some(p => Math.hypot(p.x - col, p.z - row) < 1)
            && layout.every((tokens, r) => tokens.every((token, c) => {
              if (!token) return true;
              const angle = token.yaw * Math.PI / 180, [w, d] = token.dimensions;
              const halfX = (Math.abs(w * Math.cos(angle)) + Math.abs(d * Math.sin(angle)) + 0.35) / 2;
              const halfZ = (Math.abs(w * Math.sin(angle)) + Math.abs(d * Math.cos(angle)) + 0.35) / 2;
              return Math.abs((col - c) * program.grid) > halfX || Math.abs((row - r) * program.grid) > halfZ;
            }));
          if (clear) candidates.push({ x: col, z: row });
        }
        const nearest = candidates.sort((a, b) => Math.hypot(a.x - x, a.z - z) - Math.hypot(b.x - x, b.z - z))[0];
        if (!nearest) continue;
        x = nearest.x; z = nearest.z; occupiedLights.push(nearest);
      }
      additions.push(`LIGHT ${asset} AT ${x},${z} POWER ${room.kind === "balcony" ? 8 : 18}`);
    }
    lines[room.line - 1] += additions.length ? `\n${additions.join("\n")}` : "";
  }
  const site = /lunar/iu.test(name) ? "sand" : /cloud city/iu.test(name) ? "none" : /rooftop|drowned/iu.test(name) ? "paving" : "grass";
  const facade = /lunar|museum/iu.test(name) ? "concrete" : /loft|library/iu.test(name) ? "brick" : "plaster";
  return `SITE ${site} 5\nFACADE ${facade}\nROOF flat\n${lines.join("\n")}`;
}

export function facadeMaterial(kind) {
  if (kind === "none") return null;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d"), colors = { plaster: "#d6cdbb", brick: "#a56e50", timber: "#9e7955", concrete: "#a6aaa7" };
  ctx.fillStyle = colors[kind]; ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = kind === "brick" ? "#c5bcb0" : "#776d60";
  ctx.lineWidth = kind === "brick" ? 3 : 1;
  if (kind === "brick" || kind === "timber") {
    for (let y = 0; y <= 128; y += 16) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(128, y); ctx.stroke();
      if (kind === "brick") for (let x = (y / 16 % 2) * 32; x <= 128; x += 64) {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 16); ctx.stroke();
      }
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  const material = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.85, bumpMap: texture, bumpScale: kind === "brick" ? 0.018 : 0.004 });
  material.userData.ownedTexture = true;
  return material;
}

export function applyFacade(mesh, dir, finish) {
  if (!finish) return;
  const index = { east: 0, west: 1, south: 4, north: 5 }[dir];
  mesh.material = Array(6).fill(mesh.material);
  mesh.material[index] = finish;
  const { position, uv } = mesh.geometry.attributes;
  const face = mesh.geometry.groups[index];
  const indices = mesh.geometry.index;
  for (let i = face.start; i < face.start + face.count; i++) {
    const vertex = indices.getX(i);
    uv.setXY(vertex, dir === "east" || dir === "west" ? position.getZ(vertex) + mesh.position.z : position.getX(vertex) + mesh.position.x, position.getY(vertex) + mesh.position.y);
  }
}

export function addExterior(program, root, ceilings, box) {
  const finish = color => new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
  const trim = finish("#aaa497"), roof = finish(program.roof === "pitched" ? "#655149" : "#69716e");
  const width = program.cols * program.grid, depth = program.rows * program.grid;
  if (program.site !== "none") {
    const group = new THREE.Group(); root.add(group);
    const ground = finish({ grass: "#748961", paving: "#a5aaa5", sand: "#bcad88" }[program.site]);
    box(group, width + program.margin * 2, 0.12, depth + program.margin * 2, 0, -0.27, 0, ground);
    // A paving apron gives the building a ground contact and a route around it.
    for (const sign of [-1, 1]) {
      box(group, width + 2, 0.04, 1, 0, -0.19, sign * (depth / 2 + 0.5), trim);
      box(group, 1, 0.04, depth, sign * (width / 2 + 0.5), -0.19, 0, trim);
    }
  }
  for (const room of program.rooms) {
    if (room.kind === "balcony") continue;
    const w = room.cols * program.grid, d = room.rows * program.grid;
    const base = new THREE.Group(); base.userData.floor = room.floor; root.add(base);
    if (room.floor === 0 && program.site !== "none") box(base, w + 0.14, 0.18, d + 0.14, room.centerX, -0.19, room.centerZ, trim);
    const covered = program.rooms.some(other => other.floor > room.floor && other.x < room.x + room.cols && other.x + other.cols > room.x && other.z < room.z + room.rows && other.z + other.rows > room.z);
    if (covered || program.roof === "none") continue;
    const cap = new THREE.Group(); cap.userData.floor = room.floor; root.add(cap); ceilings.push(cap);
    cap.position.set(room.centerX, room.elevation + 2.82, room.centerZ);
    if (program.roof === "pitched") {
      const shape = new THREE.Shape(); shape.moveTo(-w / 2 - 0.2, 0); shape.lineTo(0, Math.min(w * 0.3, 2)); shape.lineTo(w / 2 + 0.2, 0); shape.closePath();
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: d + 0.4, bevelEnabled: false, steps: 1 });
      geometry.translate(0, 0, -d / 2 - 0.2);
      const mesh = new THREE.Mesh(geometry, roof); mesh.castShadow = mesh.receiveShadow = true; cap.add(mesh);
    } else {
      box(cap, w + 0.24, 0.12, d + 0.24, 0, 0, 0, roof);
      for (const dir of room.walls) {
        if (program.rooms.some(other => sharedWall(room, other, dir))) continue;
        const vertical = dir === "east" || dir === "west";
        box(cap, vertical ? 0.12 : w + 0.24, 0.2, vertical ? d + 0.24 : 0.12,
          dir === "east" ? w / 2 : dir === "west" ? -w / 2 : 0, 0.12,
          dir === "south" ? d / 2 : dir === "north" ? -d / 2 : 0, trim);
      }
    }
  }
}

// One depth-only mesh replaces hundreds of architectural draw calls per shadow face.
export function mergedEnclosure(root, material) {
  const copy = root.clone(true), parts = [];
  copy.traverse(node => { node.visible = true; if (node.userData.fullHeight) node.scale.y = 1; });
  copy.updateMatrixWorld(true);
  copy.traverse(node => {
    if (!node.isMesh || !node.castShadow) return;
    const geometry = node.geometry.index ? node.geometry.toNonIndexed() : node.geometry.clone();
    geometry.applyMatrix4(node.matrixWorld);
    for (const name of Object.keys(geometry.attributes)) if (name !== "position") geometry.deleteAttribute(name);
    parts.push(geometry);
  });
  if (!parts.length) return null;
  const geometry = mergeGeometries(parts);
  parts.forEach(part => part.dispose());
  const mesh = new THREE.Mesh(geometry, material); mesh.castShadow = true;
  return mesh;
}
