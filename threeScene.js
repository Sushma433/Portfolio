// ----- threeScene.js -----
// Enhanced Three.js Scene with Red/Cyber theme

(function initThree() {
  const container = document.getElementById('three-canvas');
  if (!container) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0e14);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 12);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Red-themed particles
  const particlesGeo = new THREE.BufferGeometry();
  const particleCount = 2000;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const radius = 6 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions[i*3] = x;
    positions[i*3+1] = y;
    positions[i*3+2] = z;

    // Red/Orange/Purple color scheme
    const r = 0.8 + 0.4 * Math.random();
    const g = 0.1 + 0.2 * Math.random();
    const b = 0.1 + 0.3 * Math.random();
    colors[i*3] = r;
    colors[i*3+1] = g * 0.5;
    colors[i*3+2] = b * 0.5;
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleTexture = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,50,50,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
  })();

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    map: particleTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    vertexColors: true,
    opacity: 0.9,
  });

  const particleSystem = new THREE.Points(particlesGeo, particlesMaterial);
  scene.add(particleSystem);

  // Connection lines (red tint)
  const linesGeo = new THREE.BufferGeometry();
  const linePositions = [];
  const pointArray = positions;
  for (let i = 0; i < particleCount; i+=3) {
    for (let j = i+3; j < particleCount && j < i+30; j+=3) {
      const dx = pointArray[i*3] - pointArray[j*3];
      const dy = pointArray[i*3+1] - pointArray[j*3+1];
      const dz = pointArray[i*3+2] - pointArray[j*3+2];
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      if (dist < 1.8) {
        linePositions.push(pointArray[i*3], pointArray[i*3+1], pointArray[i*3+2]);
        linePositions.push(pointArray[j*3], pointArray[j*3+1], pointArray[j*3+2]);
      }
    }
  }
  linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

  const linesMat = new THREE.LineBasicMaterial({
    color: 0x8a2a2a,
    transparent: true,
    opacity: 0.06,
  });
  const linesMesh = new THREE.LineSegments(linesGeo, linesMat);
  scene.add(linesMesh);

  // Red glowing rings
  const ringGeo = new THREE.TorusGeometry(2.5, 0.04, 32, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xff3333,
    emissive: 0x8a1a1a,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.3,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.8;
  ring.rotation.z = 0.3;
  scene.add(ring);

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(3.5, 0.03, 24, 64),
    new THREE.MeshStandardMaterial({
      color: 0xaa2222,
      emissive: 0x5a1a1a,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.15,
    })
  );
  ring2.rotation.x = Math.PI / 1.8;
  ring2.rotation.y = 0.8;
  scene.add(ring2);

  // Skull/cyber symbol using small particles (optional)
  const skullGeo = new THREE.SphereGeometry(0.3, 8, 8);
  const skullMat = new THREE.MeshStandardMaterial({
    color: 0xcc3333,
    emissive: 0x8a1a1a,
    emissiveIntensity: 0.3,
  });
  const skull = new THREE.Mesh(skullGeo, skullMat);
  skull.position.set(0, 0, 0);
  scene.add(skull);

  // Lights
  const ambient = new THREE.AmbientLight(0x2a1a1a);
  scene.add(ambient);
  const pointLight = new THREE.PointLight(0xff4757, 1.5, 20);
  pointLight.position.set(2, 3, 5);
  scene.add(pointLight);
  const backLight = new THREE.PointLight(0x8a1a1a, 0.8);
  backLight.position.set(-3, -1, -4);
  scene.add(backLight);

  // Animation
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.0012;

    particleSystem.rotation.y += 0.0003;
    particleSystem.rotation.x = Math.sin(time * 0.1) * 0.03;
    particleSystem.rotation.z += 0.0001;

    linesMesh.rotation.y = particleSystem.rotation.y;
    linesMesh.rotation.x = particleSystem.rotation.x;
    linesMesh.rotation.z = particleSystem.rotation.z;

    ring.rotation.y += 0.0025;
    ring2.rotation.y -= 0.0022;
    ring2.rotation.x += 0.001;

    skull.rotation.x += 0.005;
    skull.rotation.y += 0.008;

    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  animate();

  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
})();