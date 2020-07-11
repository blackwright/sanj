# sanj

Notes about working with THREE and react-three-fiber

## Text

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

Converting to shape geometry more efficient than text geometry, as it does not extrude:

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

## Randomly generating points within a bounding box

```ts
function generatePointsWithinBoundingBox(
  geometry: THREE.Geometry,
  numberOfPoints: number
): void {
  for (let i = 0; i < numberOfPoints; i++) {
    geometry.vertices.push(generatePointWithinBoundingBox(geometry));
  }
}

function generatePointWithinBoundingBox(
  geometry: THREE.Geometry
): THREE.Vector3 {
  if (!geometry.boundingBox) {
    geometry.computeBoundingBox();
  }

  const point = new THREE.Vector3(
    THREE.MathUtils.randFloat(
      geometry.boundingBox!.min.x,
      geometry.boundingBox!.max.x
    ),
    THREE.MathUtils.randFloat(
      geometry.boundingBox!.min.y,
      geometry.boundingBox!.max.y
    ),
    0.0
  );

  if (isPointInside(point, geometry)) {
    return point;
  } else {
    return generatePointWithinBoundingBox(geometry);
  }
}

function isPointInside(
  point: THREE.Vector3,
  geometry: THREE.Geometry
): boolean {
  if (!geometry.faces.length) {
    throw new Error('Geometry has no faces');
  }

  for (let i = 0; i < geometry.faces.length; i++) {
    const face = geometry.faces[i];

    const vectorA = geometry.vertices[face.a];
    const vectorB = geometry.vertices[face.b];
    const vectorC = geometry.vertices[face.c];

    if (isPointWithinTriangle(point, vectorA, vectorB, vectorC)) {
      return true;
    }
  }

  return false;
}

function isPointWithinTriangle(
  point: THREE.Vector3,
  vectorA: THREE.Vector3,
  vectorB: THREE.Vector3,
  vectorC: THREE.Vector3
): boolean {
  const A =
    0.5 *
    (-vectorB.y * vectorC.x +
      vectorA.y * (-vectorB.x + vectorC.x) +
      vectorA.x * (vectorB.y - vectorC.y) +
      vectorB.x * vectorC.y);

  const sign = A > 0 ? 1 : -1;

  const s =
    (vectorA.y * vectorC.x -
      vectorA.x * vectorC.y +
      (vectorC.y - vectorA.y) * point.x +
      (vectorA.x - vectorC.x) * point.y) *
    sign;

  const t =
    (vectorA.x * vectorB.y -
      vectorA.y * vectorB.x +
      (vectorA.y - vectorB.y) * point.x +
      (vectorB.x - vectorA.x) * point.y) *
    sign;

  return s > 0 && t > 0 && s + t < 2 * A * sign;
}
```
