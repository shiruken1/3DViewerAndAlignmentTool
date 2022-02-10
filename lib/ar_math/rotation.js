import { XYZ } from './vector';
import svd from './svd';

/*
Find rotation from one set of planes to another.

Based on method described here: http://nghiaho.com/?page_id=671

pairs is a list of three pairs of plane equations:
[
[[a,b,c,d], [a,b,c,d]],
[[a,b,c,d], [a,b,c,d]],
[[a,b,c,d], [a,b,c,d]],
]
*/
export default function rotation(pairs) {
  // const n = pairs.length;
  const h = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  pairs.forEach(p => {
    const a = p[0];
    const b = p[1];
    XYZ.forEach(i => {
      XYZ.forEach(j => {
        h[i][j] += a[i] * b[j];
      });
    });
  });
  const { U, V } = svd(h);

  // r = V * transpose(U)
  const R = XYZ.map(i => {
    const a = U[i];
    return XYZ.map(j => {
      const b = V[j];
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    });
  });
  return R;
}
