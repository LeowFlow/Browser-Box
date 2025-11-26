import * as THREE from 'three';
import { createRenderer, renderFrame } from './engine/renderer';
import { createPhysics } from './engine/physics';
import {
  createBox,
  createGround,
  syncMeshFromRigidBody,
  type PhysicsObject,
} from './engine/objects';

async function main() {
  const renderCtx = createRenderer();
  const physicsCtx = await createPhysics();

  const { scene, camera } = renderCtx;
  const { world, RAPIER } = physicsCtx;

  camera.position.set(6, 6, 10);
  camera.lookAt(0, 1, 0);

  const objects: PhysicsObject[] = [];

  const ground = createGround(RAPIER, world, scene);
  objects.push(ground);

  const boxCount = 8;
  for (let i = 0; i < boxCount; i += 1) {
    const position = new THREE.Vector3(0, 1 + i * 1.25, 0);
    const box = createBox(RAPIER, world, scene, position);
    objects.push(box);
  }

  function animate() {
    world.step();
    objects.forEach(syncMeshFromRigidBody);
    renderFrame(renderCtx);
    requestAnimationFrame(animate);
  }

  animate();
}

main();
