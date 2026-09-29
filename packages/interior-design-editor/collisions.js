import { Box3, Matrix3, Matrix4, Vector3 } from "three";
import { OBB } from "three/addons/math/OBB.js";
import RBush from "rbush";

const trees = new Set(["olive_tree", "citrus_tree", "topiary_tree", "palm"]);
const ignored = new Set([
  "rug", "kilim_rug", "ceiling_fan", "floor_drain", "curtain_pair", "gym_mat",
  "stone_path", "archway", "timber_pergola", "awning",
]);

// Index plan footprints independently of visibility, cutaways, and furniture meshes.
export function createCollisionIndex(entries) {
  const floors = new Map();
  const items = entries.map((entry, id) => {
    const { token, x, z } = entry;
    const [width, depth] = token.dimensions;
    const angle = token.yaw * Math.PI / 180;
    const rotation = new Matrix3().setFromMatrix4(new Matrix4().makeRotationY(angle));
    const box = new OBB(new Vector3(x, 0, z), new Vector3(width / 2, 1, depth / 2), rotation);
    const walkingBox = box.clone();
    walkingBox.halfSize.x += 0.2;
    walkingBox.halfSize.z += 0.2;
    const footprintWidth = trees.has(token.name) ? Math.max(0.3, width * 0.16) : width;
    const footprintDepth = trees.has(token.name) ? footprintWidth : depth;
    const boundWidth = Math.max(width, footprintWidth);
    const boundDepth = Math.max(depth, footprintDepth);
    const bounds = new Box3(
      new Vector3(-boundWidth / 2, -1, -boundDepth / 2), new Vector3(boundWidth / 2, 1, boundDepth / 2),
    ).applyMatrix4(new Matrix4().makeRotationY(angle)).translate(box.center);
    const warningBox = new OBB(box.center.clone(), new Vector3(
      Math.max(0, footprintWidth / 2 - 0.04), 1, Math.max(0, footprintDepth / 2 - 0.04),
    ), rotation);
    const item = {
      entry, id, walkingBox, warningBox,
      minX: bounds.min.x, minY: bounds.min.z, maxX: bounds.max.x, maxY: bounds.max.z,
    };
    if (!floors.has(token.floor)) floors.set(token.floor, new RBush());
    return item;
  });
  for (const [floor, index] of floors) {
    index.load(items.filter((item) => item.entry.token.floor === floor));
  }
  return {
    items,
    search: (floor, bounds) => floors.get(floor)?.search(bounds) || [],
  };
}

export function overlapWarnings(index, overheadLights) {
  const warnings = [];
  const skip = (item) => ignored.has(item.entry.token.name) || overheadLights.includes(item.entry.token.name);
  for (const a of index.items) {
    if (skip(a)) continue;
    const candidates = index.search(a.entry.token.floor, a).sort((a, b) => a.id - b.id);
    for (const b of candidates) {
      if (b.id <= a.id || skip(b)) continue;
      if (a.warningBox.intersectsOBB(b.warningBox)) {
        warnings.push(`${a.entry.token.name} overlaps ${b.entry.token.name}`);
      }
    }
  }
  return warnings;
}
