import React from 'react';
import { useThree, useUpdate, useFrame } from 'react-three-fiber';
import { shader } from './shaders/test';

export const App: React.FC = () => {
  const { clock } = useThree();

  const material = useUpdate<THREE.ShaderMaterial>(material => {
    material.uniforms.u_resolution.value.x = window.innerWidth;
    material.uniforms.u_resolution.value.y = window.innerHeight;
  }, []);

  useFrame(() => {
    if (material.current) {
      material.current.uniforms.u_time.value += clock.getDelta();
    }
  });

  const handleClick = (event: React.MouseEvent) => {
    if (material.current) {
      material.current.uniforms.u_mouse.value.x = event.pageX;
      material.current.uniforms.u_mouse.value.y = event.pageY;
    }
  };

  return (
    <mesh onClick={handleClick}>
      <planeBufferGeometry attach="geometry" args={[2, 2]} />
      <shaderMaterial ref={material} attach="material" args={[shader]} />
    </mesh>
  );
}

export default App;
