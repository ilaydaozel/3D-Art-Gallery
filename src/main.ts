import * as THREE from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {createInitialRoomLight} from './Light'
import {createRoom} from "./Room"

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
camera.position.y = 5;
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

const floorDimensions = { width: 40, height: 50 };
const {ceiling, floor, walls } = createRoom(floorDimensions);
scene.add(ceiling, floor, walls)


const light = new THREE.SpotLight(0xFF000F, 1, 1, 1, 0.8, 1)
//renderer.shadowMap.enabled = true
//renderer.shadowMap.type = THREE.PCFSoftShadowMap
light.position.x = -15
light.position.z = 0
light.position.y = 20
scene.add(light)

// movement controls
const onKeyDown = function (event: KeyboardEvent) {
  switch (event.code) {
      case 'KeyW':
          controls.moveForward(0.25)
          break
      case 'KeyA':
          controls.moveRight(-0.25)
          break
      case 'KeyS':
          controls.moveForward(-0.25)
          break
      case 'KeyD':
          controls.moveRight(0.25)
          break
  }
}
document.addEventListener('keydown', onKeyDown, false)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)
    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()