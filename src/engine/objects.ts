import * as THREE from 'three';

export type PhysicsObject = {
  rigidBody: import('@dimforge/rapier3d-compat').RigidBody;
  collider: import('@dimforge/rapier3d-compat').Collider;
  mesh: THREE.Mesh;
};

export function createGround(
  RAPIER: typeof import('@dimforge/rapier3d-compat'),
  world: import('@dimforge/rapier3d-compat').World,
  scene: THREE.Scene
): PhysicsObject {
  const geometry = new THREE.BoxGeometry(20, 1, 20);
  const material = new THREE.MeshStandardMaterial({ color: '#1e293b' });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, -0.5, 0);
  mesh.receiveShadow = true;

  const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0);
  const rigidBody = world.createRigidBody(rigidBodyDesc);
  const colliderDesc = RAPIER.ColliderDesc.cuboid(10, 0.5, 10);
  const collider = world.createCollider(colliderDesc, rigidBody);

  scene.add(mesh);

  return { rigidBody, collider, mesh };
}

export function createBox(
  RAPIER: typeof import('@dimforge/rapier3d-compat'),
  world: import('@dimforge/rapier3d-compat').World,
  scene: THREE.Scene,
  position: THREE.Vector3,
  size: THREE.Vector3 = new THREE.Vector3(1, 1, 1)
): PhysicsObject {
  const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  const material = new THREE.MeshStandardMaterial({ color: '#38bdf8' });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;

  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
    position.x,
    position.y,
    position.z
  );
  const rigidBody = world.createRigidBody(rigidBodyDesc);
  const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
  const collider = world.createCollider(colliderDesc, rigidBody);

  scene.add(mesh);

  return { rigidBody, collider, mesh };
}

export function syncMeshFromRigidBody(obj: PhysicsObject): void {
  const translation = obj.rigidBody.translation();
  obj.mesh.position.set(translation.x, translation.y, translation.z);

  const rotation = obj.rigidBody.rotation();
  obj.mesh.setRotationFromQuaternion(
    new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
  );
}
