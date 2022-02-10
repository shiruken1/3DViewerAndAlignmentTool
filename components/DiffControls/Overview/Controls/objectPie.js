/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import unitDefs from 'util/units';

import Pie from './Pie';

const ObjectPie = ({
  diffData: { diffs },
  limits,
  modelUnits,
  size,
  units,
}) => {
  const pie = {
    redObjects: 0,
    yellowObjects: 0,
    greenObjects: 0,
  };
  const scale = unitDefs[modelUnits].to[units || modelUnits];
  Object.keys(diffs)
    .map(id => diffs[id][0])
    .filter(v => v.seen)
    .forEach(v => {
      const dm = scale * v.dm;
      if (dm > limits.red) {
        pie.redObjects += 1;
      } else if (dm > limits.yellow) {
        pie.yellowObjects += 1;
      } else {
        pie.greenObjects += 1;
      }
    });
  return (
    <Pie
      size={size}
      data={[
        { color: '#f00', value: pie.redObjects },
        { color: '#ff0', value: pie.yellowObjects },
        { color: '#0f0', value: pie.greenObjects },
      ]}
    />
  );
};

ObjectPie.propTypes = {
  diffData: PropTypes.object.isRequired,
  limits: PropTypes.object.isRequired,
  modelUnits: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  units: PropTypes.string,
};

ObjectPie.defaultProps = {
  units: null,
};

export default ObjectPie;
