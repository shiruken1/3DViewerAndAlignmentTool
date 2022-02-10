function findHorizontalSurface(surfaces) {
  let index = 0;
  surfaces.forEach((p, i) => {
    if (Math.abs(p[2]) > Math.abs(surfaces[index][2])) {
      index = i;
    }
  });
  return index;
}

function dot(u, v) {
  return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
}

function cross(u, v) {
  return [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ];
}

export default function flipSurfaces(pairs) {
  if (pairs.length !== 3) {
    throw new Error('Must select exactly three pairs of surfaces');
  }
  const scan = pairs.map(p => p[0]);
  const model = pairs.map(p => p[1]);
  const scanUpIndex = findHorizontalSurface(scan);
  const modelUpIndex = findHorizontalSurface(model);
  const ORTHOGONAL_LIMIT = Math.cos((50 * Math.PI) / 180);
  const VERTICAL_LIMIT = 1.0 - ORTHOGONAL_LIMIT;
  if (Math.abs(scan[scanUpIndex][2]) < VERTICAL_LIMIT) {
    throw new Error('Missing horizontal surface for scan.');
  }
  if (Math.abs(model[modelUpIndex][2]) < VERTICAL_LIMIT) {
    throw new Error('Missing horizontal surface for model.');
  }
  // if they point in opposite directsions, flip the scan surface
  if (scan[scanUpIndex][2] * model[modelUpIndex][2] < 0) {
    scan[scanUpIndex] = scan[scanUpIndex].map(c => -c);
  }
  const result = [[scan[scanUpIndex], model[modelUpIndex]]];
  scan.splice(scanUpIndex, 1);
  model.splice(modelUpIndex, 1);
  // require at least 70 degrees between surfaces
  // now have 2 surfaces left for scan and model, which should all be vertical
  if (scan.some(p => Math.abs(p[2]) > ORTHOGONAL_LIMIT)) {
    throw new Error('Missing vertical surface(s) for scan.');
  }
  if (model.some(p => Math.abs(p[2]) > ORTHOGONAL_LIMIT)) {
    throw new Error('Missing vertical surface(s) for model.');
  }
  // and should be roughly orthogonal to each other, for scan and model
  if (Math.abs(dot(scan[0], scan[1])) > ORTHOGONAL_LIMIT) {
    throw new Error('Vertical surfaces not orthogonal for scan.');
  }
  if (Math.abs(dot(model[0], model[1])) > ORTHOGONAL_LIMIT) {
    throw new Error('Vertical surfaces not orthogonal for model.');
  }
  // detect if one of the scan surfaces needs to be flipped
  if (cross(scan[0], scan[1])[2] * cross(model[0], model[1])[2] < 0) {
    // pick one to flip, this will either make them both right or both wrong
    scan[1] = scan[1].map(c => -c);
  }
  // at this point we have two possible solutions:
  // either the vertical surfaces are correctly oriented,
  // or both of the vertical surfaces are flipped
  result.push([scan[0], model[0]]);
  result.push([scan[1], model[1]]);
  return result;
}
