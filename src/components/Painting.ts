import { IArtwork } from './../types';
import * as THREE from 'three';
import { rightWallWindowConfig } from './Room';

const paintingDepth: number = 0.5;
const frameBorder: number = 1.4;
const frameDepth: number = 0.6;

// The right wall's window, expressed in the same world-Z coordinate that
// wallIndex 3 uses below, with a little extra clearance for the window frame/glass.
const rightWallWindowWorldZ = -rightWallWindowConfig.positionAlongWall;
const rightWallWindowHalfSpan = rightWallWindowConfig.size.x / 2 + 4;

const createFrameForPainting = (dimensions: {
  width: number;
  height: number;
}) => {
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b2a1e,
    roughness: 0.55,
    metalness: 0.25,
  });
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(
      dimensions.width + frameBorder,
      dimensions.height + frameBorder,
      frameDepth
    ),
    frameMaterial
  );
  // Sits just behind the artwork (in the painting's own local space) so the
  // artwork image is always the frontmost surface, never hidden behind the frame.
  frame.position.z = -(paintingDepth / 2 + frameDepth / 2 - 0.05);
  frame.castShadow = true;
  frame.receiveShadow = true;
  return frame;
};

export const createPainting = (
  url: string,
  dimensions: { width: number; height: number },
  manager?: THREE.LoadingManager
) => {
  const paintingTexture = new THREE.TextureLoader(manager).load(url);
  paintingTexture.colorSpace = THREE.SRGBColorSpace;
  const artworkFace = new THREE.MeshLambertMaterial({ map: paintingTexture });
  const edgeMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
  // BoxGeometry face order: +x, -x, +y, -y, +z, -z — only the front/back
  // faces get the artwork, the thin edges get a neutral matte color.
  const materials = [
    edgeMaterial,
    edgeMaterial,
    edgeMaterial,
    edgeMaterial,
    artworkFace,
    artworkFace,
  ];
  const painting = new THREE.Mesh(
    new THREE.BoxGeometry(dimensions.width, dimensions.height, paintingDepth),
    materials
  );
  painting.castShadow = true;
  painting.receiveShadow = true;
  painting.add(createFrameForPainting(dimensions));
  return painting;
};

export const createAndHangPaintings = (
  artworks: IArtwork[],
  floorDimensions: { width: number; height: number },
  manager?: THREE.LoadingManager
) => {
  let distanceBetween = 20;
  const baseHangingHeight = 18;
  const rowGap = 20;
  const maxHangingHeight = 38;
  let row = 0;
  let hangingHeight = baseHangingHeight;
  let wallIndex = 1;
  let wallTransitions = 0;
  let currentWallLength = 0;
  let positionX = 0;
  let positionZ = 0;
  const floorWidth = floorDimensions.width;
  const floorHeight = floorDimensions.height;
  const paintings: THREE.Mesh[] = [];
  for (let i = 0; i < artworks.length; i++) {
    const artwork: IArtwork = artworks[i];
    const artworkWidth: number = artwork.width ? artwork.width / 5 : 10;
    const artworkHeight: number = artwork.height ? artwork.height / 5 : 10;
    const painting = createPainting(
      artwork.url,
      { width: artworkWidth, height: artworkHeight },
      manager
    );

    const wouldOverflowWall =
      wallIndex === 0 || wallIndex === 2
        ? currentWallLength + artworkWidth + distanceBetween > floorWidth
        : currentWallLength + artworkWidth + distanceBetween > floorHeight;

    if (wouldOverflowWall) {
      wallIndex = (wallIndex + 1) % 4;
      currentWallLength = 0;
      wallTransitions += 1;
      // A full lap around the room's 4 walls just completed — start a new
      // row above the previous one instead of overlapping it.
      if (wallTransitions % 4 === 0) {
        row += 1;
        hangingHeight = Math.min(
          baseHangingHeight + row * rowGap,
          maxHangingHeight
        );
      }
    }

    if (wallIndex === 3) {
      // The right wall has a window — if this painting would land on top of
      // it (using the wall it actually ends up on this iteration), skip
      // past the window instead of hanging over it.
      const prospectiveZ = -floorHeight / 2 + currentWallLength + distanceBetween;
      const paintingHalfSpan = artworkWidth / 2 + frameBorder / 2;
      const windowStart = rightWallWindowWorldZ - rightWallWindowHalfSpan;
      const windowEnd = rightWallWindowWorldZ + rightWallWindowHalfSpan;
      const overlapsWindow =
        prospectiveZ + paintingHalfSpan > windowStart &&
        prospectiveZ - paintingHalfSpan < windowEnd;
      if (overlapsWindow) {
        const clearedZ = windowEnd + paintingHalfSpan + distanceBetween / 2;
        currentWallLength += clearedZ - prospectiveZ;
      }
    }

    switch (wallIndex) {
      case 0:
        // Front wall
        positionX = -floorWidth / 2 + currentWallLength + distanceBetween;
        positionZ = -(floorHeight / 2 - paintingDepth);
        break;
      case 1:
        // left wall
        positionZ = -floorHeight / 2 + currentWallLength + distanceBetween;
        positionX = -floorWidth / 2 + paintingDepth;
        painting.rotation.y = Math.PI / 2;
        break;
      case 2:
        // Back wall — rotate 180° so the painting's front face (and the
        // frame sitting behind it) point into the room, same convention as
        // the other three walls. Without this the frame ends up facing the
        // room and completely hides the artwork behind it.
        positionX = floorWidth / 2 - currentWallLength - distanceBetween;
        positionZ = floorHeight / 2 - paintingDepth;
        painting.rotation.y = Math.PI;
        break;
      case 3:
        // right wall
        positionX = floorWidth / 2 - paintingDepth;
        positionZ = -floorHeight / 2 + currentWallLength + distanceBetween;
        painting.rotation.y = -Math.PI / 2;
        break;
    }
    painting.position.set(positionX, hangingHeight, positionZ);
    painting.userData.artwork = artwork;
    paintings.push(painting);
    currentWallLength += artworkWidth + distanceBetween; // Update the current wall's length
  }
  return paintings;
};
