import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Nebula — a cosmic backdrop sphere rendered from the inside.
 *
 * Uses a fragment shader with 4-octave fBm (fractional Brownian motion) over
 * value noise, blended between two brand colors (cyan-neon + electric-violet)
 * on top of a Deep Void Blue base. A `uTime` uniform gently drifts the noise
 * so the background feels alive without ever pulling attention.
 *
 * Rendered with `side: BackSide` on a large sphere (radius ~500 world units,
 * well beyond the farthest drei <Stars />) so it acts as a skybox.
 */
const vertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec3 vWorldPosition;
  uniform float uTime;
  uniform vec3 uVoid;
  uniform vec3 uCyan;
  uniform vec3 uViolet;

  // Tiny hash + value noise — enough texture for a subtle backdrop.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Project world position onto the XY plane and scale down for soft bands.
    vec2 uv = vWorldPosition.xy * 0.0016 + uTime * 0.004;
    float cloud = fbm(uv);
    float tint = fbm(uv + 7.3);
    // Cap the cloud peak — we want a ghostly whisper, not visible color.
    vec3 warm = mix(uViolet, uCyan, tint) * 0.45;
    // Ultra-low blend — at peak cloud density we contribute ~2% of warm
    // over the pure black base. Effectively invisible except as occasional
    // texture in the corner of the eye.
    vec3 color = mix(uVoid, warm, cloud * 0.05);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function Nebula() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVoid: { value: new THREE.Color("#000000") },
      uCyan: { value: new THREE.Color("#00f2ff") },
      uViolet: { value: new THREE.Color("#8a2be2") },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh scale={[500, 500, 500]}>
      <sphereGeometry args={[1, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
      />
    </mesh>
  );
}
