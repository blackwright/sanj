import { Vector2 } from 'three';

const uniforms = {
  'u_time': { type: 'f', value: 0.0 },
  'u_resolution': { type: 'v2', value: new Vector2() },
  'u_mouse': { type: 'v2', value: new Vector2() }
};

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  gl_FragColor = vec4(st.x, st.y, 0.0, 1.0);
}
`;

export const shader = {
  uniforms,
  vertexShader,
  fragmentShader
};