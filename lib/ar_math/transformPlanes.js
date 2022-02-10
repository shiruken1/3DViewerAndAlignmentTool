import { XYZ } from './vector';
import { intersectPlanes } from './intersectPlanes';
import rotation from './rotation';
import flipSurfaces from './flipSurfaces';
/*
Find transform from one set of planes to another.

pairs is a list of three pairs of plane equations:
[
[[a,b,c,d], [a,b,c,d]],
[[a,b,c,d], [a,b,c,d]],
[[a,b,c,d], [a,b,c,d]],
]
*/
export default function transformPlanes(pairs, flip) {
  const ca = intersectPlanes(pairs.map(p => p[0]));
  const cb = intersectPlanes(pairs.map(p => p[1]));
  if (!ca || !cb) {
    return null;
  }

  let flipped = null;

  try {
    flipped = flipSurfaces(pairs);
  } catch (e) {
    console.log(e); // eslint-disable-line no-console
    return null;
  }

  if (flip) {
    flipped[1] = [flipped[1][0].map(c => -c), flipped[1][1]];
    flipped[2] = [flipped[2][0].map(c => -c), flipped[2][1]];
  }
  const R = rotation(flipped);

  const t = XYZ.map(
    i => XYZ.reduce((aa, j) => aa - R[j][i] * ca[j], 0) + cb[i],
  );

  return [
    R[0][0],
    R[1][0],
    R[2][0],
    t[0],
    R[0][1],
    R[1][1],
    R[2][1],
    t[1],
    R[0][2],
    R[1][2],
    R[2][2],
    t[2],
    0,
    0,
    0,
    1,
  ];
}
