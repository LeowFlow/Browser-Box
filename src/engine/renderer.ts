import * as THREE from 'three';

export type RenderContext = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
};

export function createRenderer(): RenderContext {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.style.margin = '0';
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0f172a');

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(6, 4, 10);
  camera.lookAt(0, 0, 0);

  const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
  const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
  directionalLight.position.set(5, 10, 7);
  scene.add(ambientLight, directionalLight);

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  return { scene, camera, renderer };
}

export function renderFrame(context: RenderContext): void {
  const { renderer, scene, camera } = context;
  renderer.render(scene, camera);
}
