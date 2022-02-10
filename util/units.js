export default {
  feet: {
    precision: 3,
    toleranceStep: 0.005,
    display: 'ft',
    oneMM: 0.00328084,
    to: {
      feet: 1,
      inches: 12.0,
      meters: 0.3048,
      millimeters: 304.8,
      centimeters: 30.48,
    },
  },
  inches: {
    precision: 1,
    toleranceStep: 0.1,
    display: 'in',
    oneMM: 0.0393701,
    to: {
      inches: 1,
      feet: 0.0833333,
      meters: 0.0254,
      millimeters: 25.4,
      centimeters: 2.54,
    },
  },
  meters: {
    precision: 3,
    toleranceStep: 0.001,
    display: 'm',
    oneMM: 0.001,
    to: {
      meters: 1,
      feet: 3.28084,
      inches: 39.3701,
      millimeters: 1000,
      centimeters: 100,
    },
  },
  millimeters: {
    precision: 1,
    toleranceStep: 1.0,
    display: 'mm',
    oneMM: 1.0,
    to: {
      millimeters: 1,
      feet: 0.00328084,
      inches: 0.0393701,
      meters: 0.001,
      centimeters: 0.1,
    },
  },
  centimeters: {
    precision: 2,
    toleranceStep: 0.1,
    display: 'cm',
    oneMM: 0.1,
    to: {
      centimeters: 1,
      feet: 0.0328084,
      inches: 0.393701,
      meters: 0.01,
      millimeters: 10.0,
    },
  },
};
// scale = units[from].to[to]
