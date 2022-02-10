/* App */
import LoadFileChunked from 'util/LoadFileChunked';

import testFiles from './testFiles';
import THREE from './three';

/*
It would be nice to be able to just do this:
import planeVS from './plane.vs.glsl';
import planeFS from './plane.fs.glsl';

But that's not currently possible with Create React App.

So instead, we do this ugly business:
*/

const webpackGLSLLoader = require.context(
  '!webpack-glsl-loader!.',
  false,
  /\.glsl$/,
);
const pointVS = webpackGLSLLoader('./point.vs.glsl');
const pointFS = webpackGLSLLoader('./point.fs.glsl');
const aaScanVS = webpackGLSLLoader('./aa.scan.vs.glsl');
const aaScanFS = webpackGLSLLoader('./aa.scan.fs.glsl');

const DISPLAY_GREEN = 1;
const DISPLAY_YELLOW = 2;
const DISPLAY_RED = 4;

const viewerMat = {
  transparent: true,
  // transparent: false,
  vertexShader: pointVS,
  fragmentShader: pointFS,
  // set some default limits, which should be overridden by view
  uniforms: {
    displayEnabled: {
      type: 'i',
      value: DISPLAY_GREEN + DISPLAY_YELLOW + DISPLAY_RED,
    },
    greenLimit: { value: 0.001 },
    yellowLimit: { value: 0.4 },
    redLimit: { value: 0.8 },
    cropLimit: { value: 20.0 },
    objectMode: { type: 'i', value: 0 },
    focusIndex: { type: 'i', value: -1 },
    focusCenter: { value: new THREE.Vector3() },
    focusRadius: { value: 0.0 },
  },
};
const aaMat = {
  transparent: true,
  // transparent: false,
  vertexShader: aaScanVS,
  fragmentShader: aaScanFS,
  // set some default limits, which should be overridden by view
  uniforms: {},
};

export default cache => ({ url, onUpdate, noHeatmap }) => {
  if (onUpdate) {
    const postUpdate = update => {
      cache.put(update);
      onUpdate(update);
    };

    cache.getOrLoad(
      url,
      data => onUpdate(data),
      () => {
        // point cloud will arrive in chunks; just create a new THREE.Points
        // for each chunk received so we get instant results
        let pointsReceived = 0;
        let pointsTotal;
        const data = new THREE.Scene();
        data.name = 'scan';

        // one material shared by all point cloud chunks
        const matScan = new THREE.ShaderMaterial(noHeatmap ? aaMat : viewerMat);

        const startCallback = ({ cancel }) => {
          postUpdate({
            url,
            progress: 0,
            data,
            cancel,
          });
        };

        const headerCallback = header => {
          const headerArray = new Uint32Array(header.slice(0, 8));
          const version = headerArray[0];
          const numPoints = headerArray[1];
          const bbArray = new Float32Array(header.slice(8));
          const boundingBox = new THREE.Box3(
            new THREE.Vector3(bbArray[0], bbArray[1], bbArray[2]),
            new THREE.Vector3(bbArray[3], bbArray[4], bbArray[5]),
          );
          pointsTotal = numPoints;
          data.userData = {
            version,
            numPoints,
            boundingBox,
            pointsTotal,
          };
          postUpdate({
            url,
            progress: 0,
            data,
          });
        };

        const chunkCallback = chunk => {
          const vertices = new Float32Array(chunk);
          pointsReceived += vertices.length / 4;
          // make BufferGeometry from chunk of point cloud
          const geomScan = new THREE.BufferGeometry();
          const interleavedBuffer32 = new THREE.InterleavedBuffer(vertices, 4);
          geomScan.addAttribute(
            'position',
            new THREE.InterleavedBufferAttribute(
              interleavedBuffer32,
              3,
              0,
              false,
            ),
          );
          geomScan.addAttribute(
            'dist',
            new THREE.InterleavedBufferAttribute(
              interleavedBuffer32,
              1,
              3,
              false,
            ),
          );

          // add this chunk to the cache object
          const chunkPoints = new THREE.Points(geomScan, matScan);
          data.add(chunkPoints);
          postUpdate({
            url,
            progress: (100 * pointsReceived) / pointsTotal,
            data,
          });
          if (pointsReceived >= pointsTotal) {
            // eslint-disable-next-line no-console
            console.log(`Scan loaded - points: ${pointsTotal}`);
          }
        };

        LoadFileChunked({
          // point clouds are stored in binary
          binary: true,
          // a reasonable size for chunks, small enough to get steady progress
          // feedback, yet large enough to not incur excess request overhead
          // note that chunkSize must be a multiple of 16, the size of one point
          chunkSize: 0x100000,
          // headerSize is dictated by the file format
          headerSize: 0x20,
          onChunk: chunkCallback,
          onDone: () => {},
          onHeader: headerCallback,
          onStart: startCallback,
          uri: testFiles.heatmap || url,
        });
      },
    );
  }
  return cache.get(url);
};
