// three.js scene for the Signal Explorer (3.md): 2,400 points holding three layouts
// at once (grid, rings, sphere). The vertex shader blends them with uWeights.

const COLS = 60, ROWS = 40, N = COLS * ROWS;

const vertexShader = /* glsl */ `
attribute vec3 aTeach; attribute vec3 aConnect;
uniform vec3 uWeights; uniform float uTime; uniform float uPulse; uniform vec2 uPointer; uniform float uSize;
varying float vGlow;
void main(){
  vec3 p = position*uWeights.x + aTeach*uWeights.y + aConnect*uWeights.z;
  float d = distance(p.xy, uPointer);
  float wave = sin(length(p.xy)*9. - uTime*2.5);
  p.z += wave * (.06 + .2*uWeights.y);
  p.xy += normalize(p.xy + vec2(.001)) * sin(d*7. - uTime*4.) * exp(-d*1.5) * .16;
  p *= 1. + uPulse*.08;
  vGlow = .45 + .4*exp(-d*2.) + .15*wave;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uSize/-mv.z, 1., 4.5);
}`;

// Palette remap: dim grey-violet -> magenta #FF00A8 -> yellow #F5FF00 at the brightest crests.
const fragmentShader = /* glsl */ `
varying float vGlow;
void main(){
  float d = length(gl_PointCoord - .5);
  if (d > .5) discard;
  vec3 col = mix(vec3(.50,.46,.52), vec3(1., 0., .659), smoothstep(.45, .86, vGlow));
  col = mix(col, vec3(.961, 1., 0.), smoothstep(.9, 1., vGlow));
  gl_FragColor = vec4(col, (1. - smoothstep(.1, .5, d)) * .85);
}`;

function layouts() {
  const A = new Float32Array(N * 3), B = new Float32Array(N * 3), C = new Float32Array(N * 3);
  for (let e = 0; e < N; e++) {
    const t = (e % COLS) / (COLS - 1), r = Math.floor(e / COLS) / (ROWS - 1);
    A.set([(t - 0.5) * 3, (r - 0.5) * 2.8, 0.12 * Math.sin(18 * t)], e * 3);
    const ang = t * Math.PI * 2, rad = 0.2 + 1.5 * r;
    B.set([Math.cos(ang) * rad, Math.sin(ang) * rad, 0.2 * Math.sin(8 * rad)], e * 3);
    const y = 1 - (2 * e) / (N - 1), th = 2.399963 * e, k = Math.sqrt(1 - y * y);
    C.set([Math.cos(th) * k * 1.6, 1.6 * y, Math.sin(th) * k * 1.6], e * 3);
  }
  return [A, B, C];
}

export function createSignalScene(THREE, host, { onFail }) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  camera.position.z = 5.1;

  const [A, B, C] = layouts();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(A, 3));
  geometry.setAttribute("aTeach", new THREE.BufferAttribute(B, 3));
  geometry.setAttribute("aConnect", new THREE.BufferAttribute(C, 3));

  const uniforms = {
    uTime: { value: 0 },
    uWeights: { value: new THREE.Vector3(1, 0, 0) },
    uPointer: { value: new THREE.Vector2(4, 4) },
    uPulse: { value: 0 },
    uSize: { value: 13 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms, vertexShader, fragmentShader,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const fit = () => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    uniforms.uSize.value = 13 * (h / 480); // keep dot size proportional to the box
  };
  const ro = new ResizeObserver(fit);
  ro.observe(host);
  fit();

  let active = 0, kick = 0, last = 0, raf = 0, visible = true, failed = false;
  const target = new THREE.Vector3(1, 0, 0);

  const onMove = (e) => {
    const r = host.getBoundingClientRect();
    uniforms.uPointer.value.set(((e.clientX - r.left) / r.width) * 4 - 2, 2 - ((e.clientY - r.top) / r.height) * 4);
  };
  const onLeave = () => uniforms.uPointer.value.set(4, 4);
  const onClick = () => { kick = 1; };
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);
  host.addEventListener("pointerdown", onClick);

  const fail = () => { if (failed) return; failed = true; stop(); canvas.remove(); onFail?.(); };
  canvas.addEventListener("webglcontextlost", fail);
  renderer.debug.onShaderError = fail;

  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    if (now - last < 32) return; // ~30fps cap
    last = now;
    uniforms.uTime.value = now * 0.001;
    uniforms.uWeights.value.lerp(target.set(+(active === 0), +(active === 1), +(active === 2)), 0.065);
    uniforms.uPulse.value += (kick - uniforms.uPulse.value) * 0.13;
    kick *= 0.93;
    points.rotation.y = 0.18 * Math.sin(0.00015 * now);
    renderer.render(scene, camera);
  };
  const start = () => { if (!raf && visible && !document.hidden && !failed) raf = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVis);
  start();

  return {
    select(i) { active = i; kick = 1; },
    setVisible(v) { visible = v; v ? start() : stop(); },
    dispose() {
      stop();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onClick);
      canvas.removeEventListener("webglcontextlost", fail);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
