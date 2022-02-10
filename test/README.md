To use a test config, you need to create a file src/test/config.js which exports state and/or files objects.

The state object will be used to override localState defaults.

The files object will be used to override s3 data file URLs.

The files referenced in your overrides must be located in the /public folder.  To be sure they never end up in production, they should be placed in /public/test.  You must omit the /public prefix in your config file.

A sample config.js:

```javascript
/* eslint-disable no-unused-vars */
const simpleshape = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: true,
      activeAccountId: '5acffbe83b7194002455c943',
      activeProjectId: '5b11785a1299960024934af8',
      activeModelId: '5b1189ab1299960024934b00',
      activeScanId: '5b203e38036cae0024731c8b',
      activeDiffId: '5b22f0bee9af660024cbd44a',
      view: 'diff',
      modal: null,
      fullScreen: false,
    },
  },
  files: {
    glb: '/test/simple_shape.glb',
    objdiff: '/test/simple_shape.objdiff.json',
    planes: '/test/simple_shape.planes.json',
    heatmap: '/test/simple_shape.otdiff.ds.bin',
    features: '/test/simple_shape.pointsWithFeatures.bin',
  },
};

const diffs = {
  state: {
    nav: {
      __typename: 'Nav',
      adminMode: false,
      activeAccountId: '5acffbe83b7194002455c943',
      activeProjectId: '5b11785a1299960024934af8',
      activeModelId: null,
      activeScanId: null,
      activeDiffId: null,
      view: 'project',
      modal: null,
      fullScreen: false,
    },
  },
};

// module.exports = diffs;
module.exports = simpleshape;
```

IDs can be obtained in the app by enabling admin mode, and should be updated in the case of a database reset.