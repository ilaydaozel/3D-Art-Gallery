import * as THREE from 'three';

export const createInitialRoomLight = (scene: THREE.Scene) => {
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.9);
  scene.add(ambientLight);
  // Soft sky/ground tint so walls and floor don't look flat under pure ambient light.
  const hemisphereLight = new THREE.HemisphereLight(0xfff6e5, 0xe8e2d8, 0.9);
  scene.add(hemisphereLight);
};

// Warm, shadow-free "track lighting" spaced along the ceiling — cheap to
// render (no shadow maps) but gives the room a proper gallery glow instead
// of flat, uniform ambient light.
export const createTrackLighting = (
  scene: THREE.Scene,
  floorDimensions: { width: number; height: number },
  roomHeight: number
) => {
  const { width, height } = floorDimensions;
  const lightY = roomHeight - 4;
  const lightsAlongLength: number = 4;
  const margin = height * 0.15;
  for (let i = 0; i < lightsAlongLength; i++) {
    const t = lightsAlongLength === 1 ? 0.5 : i / (lightsAlongLength - 1);
    const z = -height / 2 + margin + t * (height - margin * 2);
    for (const x of [-width / 4, width / 4]) {
      const light = new THREE.PointLight(0xfff1d6, 35, width * 1.1, 1);
      light.position.set(x, lightY, z);
      scene.add(light);
    }
  }
};
export const createDirectionalLightWithTarget = (
  target: THREE.Object3D,
  position: THREE.Vector3
) => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
  //the position is relative to the glass and also relative to the wall
  directionalLight.position.set(position.x, position.y, position.z);
  directionalLight.target = target;

  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 512;
  directionalLight.shadow.mapSize.height = 512;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 100;
  target.add(directionalLight);
};

export const createSpotlightWithTarget = (
  target: THREE.Object3D,
  position?: THREE.Vector3
) => {
  const { x, z } = target.position;
  let spotlightPosition = new THREE.Vector3(x, 38, z);
  if (position) {
    spotlightPosition = position;
  }

  const spotlight = new THREE.SpotLight(0xffff00, 30);
  spotlight.position.set(
    spotlightPosition.x,
    spotlightPosition.y,
    spotlightPosition.z
  );
  spotlight.target = target;
  spotlight.castShadow = true;
  spotlight.angle = Math.PI / 2;
  spotlight.penumbra = 1;
  spotlight.decay = 1.5;
  spotlight.distance = 50;
  spotlight.shadow.mapSize.width = 1024;
  spotlight.shadow.mapSize.height = 1024;
  return spotlight;
};
