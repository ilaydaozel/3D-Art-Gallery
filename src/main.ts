import * as THREE from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {createDirectionalLightWithTarget, createInitialRoomLight, createTrackLighting} from './components/Light'
import {createRoom, roomHeight} from "./components/Room"
import artworks from './data/artworks';
import { IArtwork } from './types';
import { createBoundingBoxOfGroup } from './components/BoundingBox';
import { createMobileControls, createPointerLockControls } from './components/Controls';
import { createAndHangPaintings } from './components/Painting';

//scene
const scene = new THREE.Scene();
//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 0;
camera.position.y = 15;
scene.add(camera);

//renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.setClearColor(0xffffff, 1); //backgroundColor
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// Initial Light
createInitialRoomLight(scene);

const isMobileDevice =
  'ontouchstart' in window || navigator.maxTouchPoints > 0;

// add event listeners for menu
const menuPanel = document.getElementById('menuPanel') as HTMLDivElement
const startButton = document.getElementById('startButton') as HTMLButtonElement
const loadingBarTrack = document.getElementById('loadingBarTrack') as HTMLDivElement
const loadingBarFill = document.getElementById('loadingBarFill') as HTMLDivElement
const menuHint = document.getElementById('menuHint') as HTMLDivElement
const movementIconsMenu = document.getElementById('movementIconsMenu') as HTMLDivElement

// Pointer Lock isn't available on mobile browsers, so the desktop "lock the
// mouse" flow never fires and the welcome screen would otherwise never go
// away. On touch devices just hide the menu directly instead.
if (isMobileDevice) {
  menuHint.textContent = 'Drag to look around · use the arrows to move';
  startButton.addEventListener(
    'click',
    () => (menuPanel.style.display = 'none'),
    false
  );
} else {
  movementIconsMenu.style.display = 'none';
  startButton.addEventListener(
    'click',
    function () {
        controls.lock()
    },
    false
  );
}
const controls = new PointerLockControls(camera, renderer.domElement)
controls.addEventListener('lock', () => (menuPanel.style.display = 'none'))
controls.addEventListener('unlock', () => (menuPanel.style.display = 'flex'))

// All painting/floor/ceiling textures load through this manager so the start
// button only becomes usable once the gallery is actually ready to look at,
// instead of dropping the visitor into a room full of blank paintings.
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (_url, itemsLoaded, itemsTotal) => {
  const pct = itemsTotal > 0 ? Math.round((itemsLoaded / itemsTotal) * 100) : 100;
  loadingBarFill.style.width = `${pct}%`;
};
loadingManager.onLoad = () => {
  startButton.disabled = false;
  startButton.textContent = 'Enter the Gallery';
  loadingBarTrack.style.display = 'none';
};

const floorDimensions = { width: 80, height: 100 };
const {ceiling, floor, walls } = createRoom(floorDimensions, loadingManager);
scene.add(ceiling, floor, walls)

createDirectionalLightWithTarget(
  walls.children[2],
  new THREE.Vector3(-40, 20, 0)
);
createTrackLighting(scene, floorDimensions, roomHeight);

const roomBoundingBox: THREE.Box3[] = createBoundingBoxOfGroup(walls);

const updateMovement = isMobileDevice
? createMobileControls(camera, renderer, roomBoundingBox)
: createPointerLockControls(camera, roomBoundingBox);

const paintings = createAndHangPaintings(artworks, floorDimensions, loadingManager);
for (let i = 0; i < paintings.length; i++) {
  scene.add(paintings[i]);
}

// Look at a painting to see its title, artist and description.
const infoPanel = document.getElementById('infoPanel') as HTMLDivElement;
const infoTitle = document.getElementById('infoTitle') as HTMLParagraphElement;
const infoMeta = document.getElementById('infoMeta') as HTMLParagraphElement;
const infoDescription = document.getElementById('infoDescription') as HTMLParagraphElement;
const raycaster = new THREE.Raycaster();
const screenCenter = new THREE.Vector2(0, 0);
const maxLookDistance = 45;

const updateArtworkInfo = () => {
  raycaster.setFromCamera(screenCenter, camera);
  const [hit] = raycaster.intersectObjects(paintings, false);
  const artwork = hit?.object.userData.artwork as IArtwork | undefined;
  if (hit && artwork && hit.distance <= maxLookDistance) {
    infoTitle.textContent = artwork.title;
    infoMeta.textContent = [artwork.artistName, artwork.artistSurname]
      .filter(Boolean)
      .join(' ') + (artwork.creationYear ? ` · ${artwork.creationYear}` : '');
    infoDescription.textContent = artwork.description ?? '';
    infoPanel.classList.add('visible');
  } else {
    infoPanel.classList.remove('visible');
  }
};

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', onWindowResize, false);

// Render with animation
const clock = new THREE.Clock();
const renderLoop = () => {
  requestAnimationFrame(renderLoop);
  const delta = clock.getDelta();
  updateMovement(delta);
  updateArtworkInfo();
  renderer.render(scene, camera);
};
renderLoop();