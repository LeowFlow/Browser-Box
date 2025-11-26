import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

const canvas = document.createElement('canvas');
canvas.id = 'scene-canvas';
document.body.style.margin = '0';
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0f172a');

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(6, 4, 10);
camera.lookAt(0, 1, 0);

const light = new THREE.DirectionalLight('#ffffff', 1);
light.position.set(5, 10, 7);
scene.add(light, new THREE.AmbientLight('#ffffff', 0.25));

await RAPIER.init();

const gravity = new RAPIER.Vector3(0, -9.81, 0);
const world = new RAPIER.World(gravity);

const groundBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
const groundCollider = RAPIER.ColliderDesc.cuboid(10, 0.1, 10);
world.createCollider(groundCollider, groundBody);

const sphereBody = world.createRigidBody(
  RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 4, 0)
);
const sphereCollider = RAPIER.ColliderDesc.ball(0.5);
world.createCollider(sphereCollider, sphereBody);

const groundMaterial = new THREE.MeshStandardMaterial({ color: '#1e293b' });
const groundGeometry = new THREE.BoxGeometry(20, 0.2, 20);
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const sphereMaterial = new THREE.MeshStandardMaterial({ color: '#38bdf8' });
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.castShadow = true;
scene.add(sphereMesh);

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleResize);

function animate() {
  world.step();

  const translation = sphereBody.translation();
  sphereMesh.position.set(translation.x, translation.y, translation.z);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
