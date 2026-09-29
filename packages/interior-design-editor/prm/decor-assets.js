import * as THREE from "three";

export const decorCatalog = {
  poster: [0.6, 0.025, 0.85], painting: [0.85, 0.055, 0.65],
  mirror: [0.6, 0.06, 0.9], wall_clock: [0.32, 0.06, 0.32],
  wall_shelf: [0.8, 0.22, 0.32], vase: [0.22, 0.22, 0.34],
};
export const wallDecor = ["poster", "painting", "mirror", "wall_clock", "wall_shelf"];

// Code-native decorative assets need no image downloads or texture allocations.
export function addDecoration(group, name, box) {
  if (!decorCatalog[name]) return;
  group.userData.detailed = false;
  const [w, d, h] = decorCatalog[name];
  const material = color => new THREE.MeshStandardMaterial({ color, roughness: 0.78 });
  const frame = material("#6a4a35"), paper = material("#f3e4c7"), ink = material("#285d64"), accent = material("#c36d42");
  // Allocate only finishes used by this asset; unused finishes never reach the GPU.
  const mesh = (geometry, finish, x = 0, y = 0, z = 0) => {
    const part = new THREE.Mesh(geometry, finish);
    part.position.set(x, y, z); part.castShadow = part.receiveShadow = true;
    group.add(part); return part;
  };
  if (name === "vase") {
    const profile = [[0.055, 0], [0.09, 0.025], [0.11, 0.11], [0.075, 0.23], [0.045, 0.3], [0.05, 0.34], [0.04, 0.34], [0.035, 0.3], [0.065, 0.23], [0.1, 0.11], [0.075, 0.025]];
    mesh(new THREE.LatheGeometry(profile.map(([x,y]) => new THREE.Vector2(x,y)), 24), accent);
  } else if (name === "wall_clock") {
    const rim = mesh(new THREE.CylinderGeometry(w/2, w/2, d, 32), frame, 0, h/2);
    rim.rotation.x = Math.PI/2;
    const face = mesh(new THREE.CircleGeometry(w*0.44,32), paper,0,h/2,d/2+0.001);
    for (let i=0;i<12;i++) {
      const angle=i*Math.PI/6;
      const tick=box(group,0.009,0.02,0.005,Math.sin(angle)*w*0.36,h/2+Math.cos(angle)*w*0.36,d/2+0.006,ink);
      tick.rotation.z=-angle;
    }
    box(group,0.009,h*0.28,0.007,0,h*0.62,d/2+0.01,ink);
    const hand=box(group,w*0.24,0.009,0.009,w*0.1,h/2,d/2+0.012,accent);
    hand.rotation.z=-0.35;
  } else if (name === "wall_shelf") {
    box(group,w,0.04,d,0,0.02,0,frame);
    for(let i=0;i<5;i++) box(group,0.07,0.18+i%2*0.04,d*0.65,-w*0.3+i*0.085,0.14+i%2*0.02,0,i%2?accent:ink);
    for(const x of [-w*0.36,w*0.36]) box(group,0.03,h,0.025,x,h/2,-d/2+0.015,frame);
  } else {
    box(group,w,h,d,0,h/2,0,frame);
    if(name === "mirror") {
      const silver=new THREE.MeshStandardMaterial({color:"#c0d4d7",metalness:0.92,roughness:0.08});
      box(group,w-0.05,h-0.05,0.004,0,h/2,d/2+0.002,silver);
    } else {
      box(group,w-0.025,h-0.025,0.003,0,h/2,d/2+0.002,paper);
      box(group,w*0.62,h*0.3,0.003,-w*0.07,h*0.35,d/2+0.006,ink);
      mesh(new THREE.CircleGeometry(w*0.16,24),accent,w*0.17,h*0.69,d/2+0.009);
      for(let i=0;i<3;i++) box(group,w*(0.55-i*0.08),0.009,0.003,0,h*(0.85+i*0.035),d/2+0.006,ink);
    }
  }
}

export const decorationExample = `# Posters, artwork, a clock, a shelf, and a ceramic vase
GRID 1
ROOM gallery 8x8 AT 0,0
WALLS north east south west
DOORS south
WINDOWS north east west
MOUNT south 1 poster
MOUNT south 6 mirror
MOUNT east 0 painting
MOUNT east 7 wall_shelf
MOUNT north 0 wall_clock
LIGHT track_light AT 2,2 POWER 24
LIGHT pendant_light AT 5,5 POWER 18
LAYOUT gallery
. | . | . | . | . | . | . | .
. | . | . | . | . | . | . | .
. | . | . | . | . | . | . | .
. | . | . | . | . | . | . | .
. | . | . | . | . | . | . | .
. | . | . | . | . | . | . | .
. | . | vase | . | . | . | . | .
. | . | . | . | . | . | . | .
END`;
