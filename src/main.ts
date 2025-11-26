import * as THREE from 'three';
import { createRenderer, renderFrame } from './engine/renderer';
import { createPhysics } from './engine/physics';

async function main() {
  const renderCtx = createRenderer();
  const physicsCtx = await createPhysics();

  const { scene, camera } = renderCtx;
  const { world } = physicsCtx;

  camera.position.set(4, 3, 6);
  camera.lookAt(0, 0, 0);

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cubeMaterial = new THREE.MeshStandardMaterial({ color: '#38bdf8' });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  scene.add(cube);

  function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    world.step();
    renderFrame(renderCtx);
    requestAnimationFrame(animate);
  }

  animate();
}

main();
