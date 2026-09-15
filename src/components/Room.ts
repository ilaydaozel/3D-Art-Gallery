import * as THREE from 'three';
import { createWindowsInTheWall } from './Window';

const roomHeight = 55;

// Shared with Painting.ts so the painting-hanging algorithm knows to leave
// this stretch of the right wall clear instead of hanging a painting over the window.
export const rightWallWindowConfig = {
  size: new THREE.Vector2(40, 42),
  positionAlongWall: 20,
  verticalCenter: 24,
};

const wallColor = '#F4F0E6';
const trimColor = '#2b2620';

const createFloor = (width: number, height: number, manager?: THREE.LoadingManager) => {
  const planeGeometry = new THREE.PlaneGeometry(width, height);
  const floorTexture = new THREE.TextureLoader(manager).load(
    './img/marmer.jpg'
  );
  floorTexture.colorSpace = THREE.SRGBColorSpace;
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(width / 10, height / 20);
  const materialFloor = new THREE.MeshPhongMaterial({
    map: floorTexture,
    side: THREE.DoubleSide,
    shininess: 100,
  });
  const floor = new THREE.Mesh(planeGeometry, materialFloor);
  floor.rotation.x = Math.PI / 2; //90 degrees
  floor.rotation.y = -Math.PI; //180 degrees
  floor.position.y = 0;
  floor.receiveShadow = true;
  return floor;
};

const createCeiling = (width: number, height: number, manager?: THREE.LoadingManager) => {
  const ceilingTexture = new THREE.TextureLoader(manager).load(
    './img/textureWall.jpg'
  );
  ceilingTexture.colorSpace = THREE.SRGBColorSpace;
  ceilingTexture.wrapS = THREE.RepeatWrapping;
  ceilingTexture.wrapT = THREE.RepeatWrapping;
  ceilingTexture.repeat.set(width /2, height / 2);
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshPhongMaterial({ map: ceilingTexture })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = roomHeight;
  ceiling.receiveShadow = true;
  return ceiling;
};


const createWall = (color: string, width: number) => {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(width, roomHeight, 1),
    new THREE.MeshLambertMaterial({ color })
  );
  wall.position.y = roomHeight / 2;
  wall.receiveShadow = true;
  wall.castShadow = true;
  return wall;
};

// A dark baseboard along the bottom of a wall — a small architectural touch
// that keeps the room from reading as a plain white box.
const baseboardHeight = 3;
const createBaseboard = (width: number) => {
  const baseboard = new THREE.Mesh(
    new THREE.BoxGeometry(width, baseboardHeight, 1.1),
    new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.6 })
  );
  // Local to the wall's own center-origin geometry, so this lands at floor level.
  baseboard.position.y = -roomHeight / 2 + baseboardHeight / 2;
  baseboard.receiveShadow = true;
  baseboard.castShadow = true;
  return baseboard;
};

const createAllWalls = (floorWidth: number, floorHeight: number) => {
  const wallGroup = new THREE.Group();
  const frontWall = createWall(wallColor, floorWidth);
  frontWall.position.z = -floorHeight / 2;
  frontWall.add(createBaseboard(floorWidth));

  const leftWall = createWall(wallColor, floorHeight);
  leftWall.position.x = -floorWidth / 2;
  leftWall.rotation.y = Math.PI / 2;
  leftWall.add(createBaseboard(floorHeight));

  let rightWall: THREE.Mesh = createWall(wallColor, floorHeight);
  let rightWallWithWindows: THREE.Mesh = createWindowsInTheWall(rightWall, [
    {
      size: rightWallWindowConfig.size,
      position: new THREE.Vector3(
        rightWallWindowConfig.positionAlongWall,
        rightWallWindowConfig.verticalCenter,
        0
      ),
      lightDirection: new THREE.Vector3(0, 20, 30),
    },
  ]);
  rightWall = rightWallWithWindows;
  rightWall.add(createBaseboard(floorHeight));

  rightWall.position.x = floorWidth / 2;
  rightWall.rotation.y = Math.PI / 2;

  const backWall = createWall(wallColor, floorWidth);
  backWall.position.z = floorHeight / 2;
  backWall.add(createBaseboard(floorWidth));

  wallGroup.add(leftWall, frontWall, backWall, rightWall);
  return wallGroup;
};

export const createRoom = (
  floorDimensions: {
    width: number;
    height: number;
  },
  manager?: THREE.LoadingManager
) => {
  const { width, height } = floorDimensions;
  const ceiling = createCeiling(width, height, manager);
  const floor = createFloor(width, height, manager);
  const walls = createAllWalls(width, height);
  return { ceiling, floor, walls };
};

export { roomHeight };
