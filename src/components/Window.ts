import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { createDirectionalLightWithTarget } from './Light';

const createHole = (size: THREE.Vector2, position: THREE.Vector3) => {
  const geometry = new THREE.BoxGeometry(size.x, size.y, 1);
  const material = new THREE.MeshLambertMaterial();
  const hole = new THREE.Mesh(geometry, material);
  hole.position.set(position.x, position.y, position.z);
  return hole;
};

const subtractTheHoleFromTheWall = (wall: THREE.Mesh, hole: THREE.Mesh) => {
  wall.updateMatrix();
  hole.updateMatrix();

  // Convert meshes to CSG objects
  const wallCSG = CSG.fromMesh(wall);
  const holeCSG = CSG.fromMesh(hole);

  // Subtract the window from the right wall using CSG
  const wallWithHoleCSG = wallCSG.subtract(holeCSG);
  const wallWithHole = CSG.toMesh(wallWithHoleCSG, wall.matrix, wall.material);
  return wallWithHole;
};

const frameBarThickness = 1.6;
const frameBarDepth = 1.2;
const mullionThickness = 1;

// A bronze window frame with a cross mullion, built from simple bars so it
// reads as a proper architectural window rather than a bare glass hole.
const createWindowFrame = (size: THREE.Vector2) => {
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a6d3b,
    metalness: 0.55,
    roughness: 0.35,
  });
  const halfW = size.x / 2;
  const halfH = size.y / 2;

  const bars = [
    // top / bottom
    { w: size.x + frameBarThickness, h: frameBarThickness, x: 0, y: halfH + frameBarThickness / 2 },
    { w: size.x + frameBarThickness, h: frameBarThickness, x: 0, y: -halfH - frameBarThickness / 2 },
    // left / right
    { w: frameBarThickness, h: size.y + frameBarThickness, x: -halfW - frameBarThickness / 2, y: 0 },
    { w: frameBarThickness, h: size.y + frameBarThickness, x: halfW + frameBarThickness / 2, y: 0 },
    // cross mullions
    { w: mullionThickness, h: size.y, x: 0, y: 0 },
    { w: size.x, h: mullionThickness, x: 0, y: 0 },
  ];

  const group = new THREE.Group();
  for (const bar of bars) {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(bar.w, bar.h, frameBarDepth),
      frameMaterial
    );
    mesh.position.set(bar.x, bar.y, 0);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  return group;
};

const createGlass = (size: THREE.Vector2) => {
  const paleSky = '#eaf6f8';
  const glassGeometry = new THREE.BoxGeometry(size.x, size.y, 0.5);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: paleSky,
    transparent: true,
    opacity: 0.5,
    transmission: 0.8,
    roughness: 0.1,
    ior: 1.5,
  });

  const glass = new THREE.Mesh(glassGeometry, glassMaterial);
  glass.add(createWindowFrame(size));
  return glass;
};

const addLightToTheGlass = (
  glass: THREE.Mesh,
  lightDirection: THREE.Vector3
) => {
  createDirectionalLightWithTarget(glass, lightDirection);
};

export const createWindowsInTheWall = (
  wall: THREE.Mesh,
  windows: {
    size: THREE.Vector2;
    position: THREE.Vector3;
    lightDirection: THREE.Vector3;
  }[]
) => {
  let wallWithWindows: THREE.Mesh = wall;

  for (let i = 0; i < windows.length; i++) {
    const { size, position } = windows[i];
    const windowHole = createHole(size, position);
    const wallWithHole = subtractTheHoleFromTheWall(
      wallWithWindows,
      windowHole
    );
    wallWithWindows = wallWithHole;
  }

  for (let i = 0; i < windows.length; i++) {
    const { size, position, lightDirection } = windows[i];
    const glass = createGlass(size);
    glass.position.set(
      position.x - wall.position.x,
      position.y - wall.position.y,
      position.z - wall.position.z - 0.5
    );
    /*
    const frameWidth = 2;
    const frameSize = new THREE.Vector2(
      size.x + frameWidth,
      size.y + frameWidth
    );
    // add frame to the window
    const frame = createFrame(frameSize, frameWidth);
    frame.position.set(0 - frameSize.x / 2, 0 - frameSize.y / 2, -0.3);
    glass.add(frame);
    */
    wallWithWindows.add(glass);
    addLightToTheGlass(glass, lightDirection);
  }

  return wallWithWindows;
};
