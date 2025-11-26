export type PhysicsContext = {
  RAPIER: typeof import('@dimforge/rapier3d-compat');
  world: import('@dimforge/rapier3d-compat').World;
};

export async function createPhysics(): Promise<PhysicsContext> {
  const RAPIER = await import('@dimforge/rapier3d-compat');
  await RAPIER.init();

  const gravity = new RAPIER.Vector3(0, -9.81, 0);
  const world = new RAPIER.World(gravity);

  return { RAPIER, world };
}
