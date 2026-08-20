"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { type CSSProperties, useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./FlagHero.module.css";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    vec3 p = position;

    // The left edge behaves as if it were attached to the pole.
    float freeEdge = smoothstep(0.0, 0.22, uv.x);
    float amplitude = 0.16 + uScroll * 0.12;
    float broadWave = sin(uv.x * 7.5 - uTime * 2.0 + uv.y * 1.8) * amplitude;
    float detailWave = sin(uv.x * 15.0 + uTime * 1.35 - uv.y * 3.0) * 0.055;
    float edgeFlutter = sin(uv.x * 23.0 - uTime * 3.2) * 0.035 * uv.x;

    p.z += freeEdge * (broadWave + detailWave + edgeFlutter) * uv.x;
    p.y += freeEdge * sin(uv.x * 5.0 - uTime * 1.45) * 0.055;
    p.x += freeEdge * sin(uv.y * 4.0 + uTime * 0.7) * 0.025;
    vDepth = p.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vec4 color = texture2D(uTexture, vUv);
    float foldLight = 0.92 + vDepth * 0.32;
    float edgeShade = 0.92 + smoothstep(0.0, 0.12, vUv.x) * 0.08;
    color.rgb *= foldLight * edgeShade;
    color.rgb = mix(color.rgb, color.rgb * vec3(1.06, 0.98, 0.88), 0.12);
    gl_FragColor = vec4(color.rgb, color.a * uOpacity);
  }
`;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

export default function FlagHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const host = canvasHostRef.current;
    if (!section || !host) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0.35, 0, 9.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const texture = loader.load("/images/bandeira-capadocia.jpg");
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uOpacity: { value: 1 },
      uTexture: { value: texture },
    };

    const flagGeometry = new THREE.PlaneGeometry(6, 6, 96, 96);
    flagGeometry.translate(3, 0, 0);
    const flagMaterial = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: true,
    });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(-2.48, 0.08, 0);
    scene.add(flag);

    const gold = new THREE.MeshStandardMaterial({
      color: 0xd8a82f,
      metalness: 0.78,
      roughness: 0.25,
    });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 7.25, 20), gold);
    pole.position.set(-2.55, -0.18, -0.03);
    scene.add(pole);

    const finial = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), gold);
    finial.scale.set(0.72, 1.45, 0.72);
    finial.position.set(-2.55, 3.56, -0.03);
    scene.add(finial);

    const ambient = new THREE.AmbientLight(0xffffff, 1.7);
    const warmLight = new THREE.DirectionalLight(0xffd27a, 3.2);
    warmLight.position.set(4, 4, 7);
    const coolLight = new THREE.DirectionalLight(0x779cff, 1.7);
    coolLight.position.set(-5, 1, 4);
    scene.add(ambient, warmLight, coolLight);

    let targetScroll = 0;
    let smoothScroll = 0;
    let animationFrame = 0;
    const clock = new THREE.Clock();

    function updateScroll() {
      const rect = section!.getBoundingClientRect();
      const distance = Math.max(section!.offsetHeight - window.innerHeight, 1);
      targetScroll = clamp(-rect.top / distance);
      section!.style.setProperty("--hero-progress", targetScroll.toFixed(4));
      section!.style.setProperty("--hero-progress-percent", `${targetScroll * 100}%`);
      section!.style.setProperty("--copy-y", `${targetScroll * -24}px`);
      section!.style.setProperty("--copy-opacity", clamp(1 - targetScroll * 1.15).toFixed(4));
    }

    function resize() {
      const width = Math.max(host!.clientWidth, 1);
      const height = Math.max(host!.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      const mobile = width < 720;
      flag.scale.setScalar(mobile ? 0.82 : 1);
      pole.scale.setScalar(mobile ? 0.82 : 1);
      finial.scale.set(mobile ? 0.59 : 0.72, mobile ? 1.19 : 1.45, mobile ? 0.59 : 0.72);
      camera.position.z = mobile ? 10.4 : 9.2;
    }

    function animate() {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      smoothScroll += (targetScroll - smoothScroll) * (1 - Math.pow(0.001, delta));

      uniforms.uTime.value = reducedMotion ? 0.35 : elapsed;
      uniforms.uScroll.value = smoothScroll;
      uniforms.uOpacity.value = 1 - clamp((smoothScroll - 0.84) / 0.16);

      // The scroll first reveals the flag, then flies past it into the page.
      const intro = clamp(smoothScroll / 0.35);
      const exit = clamp((smoothScroll - 0.78) / 0.22);
      flag.rotation.y = THREE.MathUtils.lerp(-0.28, 0.08, intro) + exit * 0.3;
      flag.rotation.z = THREE.MathUtils.lerp(-0.035, 0.018, intro);
      flag.position.x = -2.48 - exit * 1.1;
      pole.position.x = -2.55 - exit * 1.1;
      finial.position.x = -2.55 - exit * 1.1;
      camera.position.x = THREE.MathUtils.lerp(0.9, 0.05, intro) + exit * 1.4;
      camera.position.z = (host!.clientWidth < 720 ? 10.4 : 9.2) - intro * 0.65 - exit * 1.6;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    }

    resize();
    updateScroll();
    animate();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateScroll);
      window.cancelAnimationFrame(animationFrame);
      flagGeometry.dispose();
      flagMaterial.dispose();
      pole.geometry.dispose();
      finial.geometry.dispose();
      gold.dispose();
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  function skipHero() {
    const section = sectionRef.current;
    if (!section) return;
    window.scrollTo({
      top: section.offsetTop + section.offsetHeight - window.innerHeight,
      behavior: "smooth",
    });
  }

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className={styles.hero}
      style={{
        "--hero-progress": "0",
        "--hero-progress-percent": "0%",
        "--copy-y": "0px",
        "--copy-opacity": "1",
      } as CSSProperties}
    >
      <div className={styles.stage}>
        <div ref={canvasHostRef} className={styles.canvasHost} aria-hidden="true" />
        <div className={styles.atmosphere} aria-hidden="true" />

        <div className={styles.copy}>
          <span className={styles.eyebrow}>G.R.E.S. Guardiões da Capadócia</span>
          <h1>
            Nossa bandeira.
            <br />
            <strong>Nossa história.</strong>
          </h1>
          <p>Uma tradição que ganha vida a cada movimento.</p>
          <a href="#quem-somos">
            Conheça a escola <ChevronRight size={18} />
          </a>
        </div>

        <div className={styles.progress} aria-hidden="true">
          <span><i /></span>
          <small>Role para sentir o vento</small>
        </div>

        <button type="button" className={styles.skip} onClick={skipHero}>
          Pular apresentação <ChevronDown size={16} />
        </button>
      </div>
    </section>
  );
}
