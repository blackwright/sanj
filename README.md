# sanj

Notes about working with THREE and react-three-fiber

## Creating geometry from font

Convert font file to glyph JSON using https://gero3.github.io/facetype.js

TextGeometry:

```jsx
import { useLoader } from 'react-three-fiber';

const font = useLoader(THREE.FontLoader, '/roboto_regular.json');

const options = {
  font: font
  size: 80,
  height: 5,
  curveSegments: 12,
  bevelEnabled: true,
  bevelThickness: 10,
  bevelSize: 8,
  bevelOffset: 0,
  bevelSegments: 5
};

<mesh>
  <textGeometry attach="geometry" args={[children, options]} />
  <meshNormalMaterial attach="material" />
</mesh>
```

ShapeBufferGeometry:

```jsx
import { useLoader } from 'react-three-fiber';

const font = useLoader(THREE.FontLoader, '/roboto_regular.json');

const shapes = font.generateShapes('Hello world', 20);

<mesh>
  <shapeBufferGeometry attach="geometry" args={[shapes]}>
  <meshNormalMaterial attach="material" />
</mesh>
```

## Visualizing vertices

Render a point cloud with disabled size attenuation using the geometry in question:

```jsx
<points geometry={geometry}>
  <pointsMaterial
    attach="material"
    size={3}
    vertexColors={true}
    sizeAttenuation={false}
  />
</points>
```

## Tessellation

Looping to increase vertex count:

```jsx
import { TessellateModifier } from 'three/examples/jsm/modifiers/TessellateModifier';

const modifier = new TessellateModifier(8);

for (let i = 0; i < 6; i++) {
  modifier.modify(geometry); // non-buffer geometry
}
```
