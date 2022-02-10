import { XYZ, crossProduct, dotProduct } from './vector';

/*
Find intersction of a list of planes.

If no intersection return null.

Each plane is in the form:
[a,b,c,d]
*/
export function intersect3Planes(p1, p2, p3) {
  // intersection at a point requires denominator != 0
  // just to be safe, require it to be much larger than 0
  const c23 = crossProduct(p2, p3);
  const denom = dotProduct(p1, c23);
  if (Math.abs(denom) < 0.1) {
    // eslint-disable-next-line no-console
    console.log('no intersection point');
    return null;
  }
  const c31 = crossProduct(p3, p1);
  const c12 = crossProduct(p1, p2);
  const t1 = c23.map(i => -p1[3] * i);
  const t2 = c31.map(i => -p2[3] * i);
  const t3 = c12.map(i => -p3[3] * i);
  return XYZ.map(i => (t1[i] + t2[i] + t3[i]) / denom);
}

/*
Find intersction of a list of planes.

If no intersection return null.

If more than three planes, and more than one intersection point found, return
the centroid of the found points.

planes is a list of plane equations:
[
[a,b,c,d],
[a,b,c,d],
]
*/
export function intersectPlanes(planes) {
  const n = planes.length;
  let f = 0;
  const c = [0, 0, 0];
  for (let i = 0; i < n - 2; ++i) {
    for (let j = i + 1; j < n - 1; ++j) {
      for (let k = j + 1; k < n; ++k) {
        const p = intersect3Planes(planes[i], planes[j], planes[k]);
        if (p !== null) {
          ++f; // eslint-disable-line no-plusplus
          c[0] += p[0];
          c[1] += p[1];
          c[2] += p[2];
        }
      }
    }
  }
  if (!f) {
    return null;
  }
  return c.map(i => i / f);
}
