import * as THREE from 'three';
import { Raycaster, Vector2 } from 'three';
import { createRenderer, renderFrame } from './engine/renderer';
import { createPhysics } from './engine/physics';
import {
  createBox,
  createGround,
  syncMeshFromRigidBody,
  type PhysicsObject,
} from './engine/objects';
import { createInputState, type InputState } from './engine/input';

async function main() {
  const renderCtx = createRenderer();
  const inputState: InputState = createInputState(renderCtx.renderer.domElement);
  const physicsCtx = await createPhysics();

  const { scene, camera } = renderCtx;
  const { world, RAPIER } = physicsCtx;

  camera.position.set(6, 6, 10);
  camera.lookAt(0, 1, 0);

  const objects: PhysicsObject[] = [];
  const raycaster = new Raycaster();
  const mouseNdc = new Vector2();
  let wasMouseDown = false;

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

    if (inputState.mouseDown && !wasMouseDown) {
      mouseNdc.x = (inputState.mouseX / window.innerWidth) * 2 - 1;
      mouseNdc.y = -(inputState.mouseY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseNdc, camera);

      const meshes = objects.map((obj) => obj.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const hitIndex = meshes.indexOf(hit.object as THREE.Mesh);
        const label = hit.object.name || `mesh-${hitIndex}`;
        console.log(`Hit ${label} at`, hit.point);
      }
    }

    wasMouseDown = inputState.mouseDown;
    renderFrame(renderCtx);
    requestAnimationFrame(animate);
  }

  animate();
}

main();
