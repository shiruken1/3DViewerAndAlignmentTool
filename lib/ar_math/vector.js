export const XYZ = [...Array(3).keys()];

export function crossProduct(a, b) {
  const ax = a[0];
  const ay = a[1];
  const az = a[2];
  const bx = b[0];
  const by = b[1];
  const bz = b[2];
  return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
}

export function dotProduct(a, b) {
  return XYZ.reduce((aa, i) => aa + a[i] * b[i], 0);
}
