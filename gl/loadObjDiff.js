/* App */
import testFiles from './testFiles';
import THREE from './three';

const webpackGLSLLoader = require.context(
  '!webpack-glsl-loader!.',
  false,
  /\.glsl$/,
);
const planeVS = webpackGLSLLoader('./plane.vs.glsl');
const planeFS = webpackGLSLLoader('./plane.fs.glsl');

const uniforms = THREE.UniformsUtils.merge([
  // THREE.UniformsLib.ambient,
  // THREE.UniformsLib.lights,
  {
    displayEnabled: { type: 'i', value: 1 },
    symbolDisplay: { type: 'i', value: 1 },
  },
]);

const markerMaterial = new THREE.ShaderMaterial({
  name: 'sphere',
  vertexShader: planeVS,
  fragmentShader: planeFS,
  uniforms,
  transparent: true,
});

const leaderMaterial = new THREE.ShaderMaterial({
  name: 'leader',
  vertexShader: planeVS,
  fragmentShader: planeFS,
  uniforms,
  transparent: false,
  linewidth: 5,
});

const sphereGeometry = new THREE.SphereGeometry(1.0, 16, 16);

export default cache => ({ url, onUpdate }) => {
  if (onUpdate) {
    const postUpdate = update => {
      cache.put(update);
      onUpdate(update);
    };

    cache.getOrLoad(
      url,
      data => onUpdate(data),
      () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', testFiles.objdiff || url);
        xhr.onerror = () => {
          postUpdate({ url, error: `Error receiving URL: ${url}` });
        };
        xhr.onload = () => {
          let objIndex = 0;
          const diffs = {};
          const objects = {};
          const markers = new THREE.Object3D();
          const data = { diffs, objects, markers };
          const objDiff = JSON.parse(xhr.responseText);
          const { version, clusterDensityUnits } = objDiff;
          const variances = objDiff.objectList;

          // eslint-disable-next-line no-console
          console.log(`objDiff version: ${version}, ${clusterDensityUnits}`);

          // sort them all first, so they get pushed in descending dm order afterwards
          variances.sort((a, b) => b.dm - a.dm);
          variances.forEach(v => {
            if (diffs[v.id] === undefined) {
              v.objIndex = objIndex; // eslint-disable-line no-param-reassign
              objIndex += 1;
              objects[v.id] = v.objIndex;
              diffs[v.id] = [v];
            } else {
              v.objIndex = objects[v.id]; // eslint-disable-line no-param-reassign
              diffs[v.id].push(v);
            }
            v.index = diffs[v.id].length; // eslint-disable-line no-param-reassign

            if (v && v.seenPoints) {
              const c = v.centroid;
              const m = v.modelSister;
              if (c[0] || c[1] || c[2]) {
                const marker = new THREE.Object3D();
                marker.name = 'v-marker';
                marker.userData = {
                  id: v.id,
                  dm: v.dm,
                };

                const sphere = new THREE.Mesh(sphereGeometry, markerMaterial);
                sphere.name = 'head';

                const s = new THREE.Vector3(c[0], c[1], c[2]);
                sphere.position.set(s.x, s.y, s.z);
                marker.add(sphere);

                const leaderGeometry = new THREE.Geometry();
                leaderGeometry.vertices.push(
                  new THREE.Vector3(s.x, s.y, s.z),
                  new THREE.Vector3(m[0], m[1], m[2]),
                );
                const leader = new THREE.Line(leaderGeometry, leaderMaterial);
                leader.name = 'leader';
                marker.add(leader);
                marker.visible = false;

                markers.add(marker);
              }
            }
          });

          // eslint-disable-next-line no-console
          console.log(`Diff loaded - variances: ${variances.length}`);

          postUpdate({ url, data, progress: 100 });
        };
        xhr.onprogress = evt => {
          if (evt.lengthComputable) {
            postUpdate({
              url,
              progress: (evt.loaded / evt.total) * 100,
              cancel: () => xhr.currentTarget && xhr.currentTarget.abort(),
            });
          }
        };
        xhr.send();
      },
    );
  }
  return cache.get(url);
};
