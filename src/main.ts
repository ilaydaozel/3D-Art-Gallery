import * as THREE from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {createDirectionalLightWithTarget, createInitialRoomLight} from './components/Light'
import {createRoom} from "./components/Room"
import artworks from './data/artworks';
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
createInitialRoomLight(scene, camera);

// add event listeners for menu
const menuPanel = document.getElementById('menuPanel') as HTMLDivElement
const startButton = document.getElementById('startButton') as HTMLInputElement
startButton.addEventListener(
    'click',
    function () {
        controls.lock()
    },
    false
)
const controls = new PointerLockControls(camera, renderer.domElement)
controls.addEventListener('lock', () => (menuPanel.style.display = 'none'))
controls.addEventListener('unlock', () => (menuPanel.style.display = 'block'))

const floorDimensions = { width: 80, height: 100 };
const {ceiling, floor, walls } = createRoom(floorDimensions);
scene.add(ceiling, floor, walls)

createDirectionalLightWithTarget(
  walls.children[2],
  new THREE.Vector3(-40, 20, 0)
);

const roomBoundingBox: THREE.Box3[] = createBoundingBoxOfGroup(walls);
const isMobileDevice =
'ontouchstart' in window || navigator.maxTouchPoints > 0;

const updateMovement = isMobileDevice
? createMobileControls(camera, renderer, roomBoundingBox)
: createPointerLockControls(camera, roomBoundingBox);

const light = new THREE.SpotLight(0xFF000F, 1, 1, 1, 0.8, 1)
//renderer.shadowMap.enabled = true
//renderer.shadowMap.type = THREE.PCFSoftShadowMap
light.position.x = -15
light.position.z = 0
light.position.y = 20
scene.add(light)

const paintings = createAndHangPaintings(artworks, floorDimensions);
for (let i = 0; i < paintings.length; i++) {
  scene.add(paintings[i]);
}
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
  renderer.render(scene, camera);
};
renderLoop();