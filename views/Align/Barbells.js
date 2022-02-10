/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import colors from 'lib/colors';

import css from './Align.module.scss';

function parseInt10(x) {
  return parseInt(x, 10);
}

const Barbells = ({ scans, models }) => {
  const scanDots = Object.keys(colors.barbellColors).map(i =>
    scans.some(s => s.index === parseInt10(i)),
  );
  const modelDots = Object.keys(colors.barbellColors).map(i =>
    models.some(m => m.index === parseInt10(i)),
  );

  const scansSelected = scanDots
    .map((v, i) => v && i)
    .filter(i => i !== false)
    .sort((a, b) => parseInt10(a) > parseInt10(b));
  const modelsSelected = modelDots
    .map((v, i) => v && i)
    .filter(i => i !== false)
    .sort((a, b) => parseInt10(a) > parseInt10(b));

  let scanIndex = 0;
  if (scansSelected.length) {
    scanIndex = scanDots.findIndex(v => v === false);
  }

  let modelIndex = 0;
  if (modelsSelected.length) {
    modelIndex = modelDots.findIndex(v => v === false);
  }

  return (
    <React.Fragment>
      {colors.barbellColors.map((color, i) => (
        <div className={css.barbell} key={color.slice(-6)}>
          <div
            className={modelIndex === i ? css.pending : null}
            style={{ backgroundColor: modelDots[i] && color, color }}>
            {'·'}
          </div>
          <div style={{ backgroundColor: color }} />
          <div
            className={scanIndex === i ? css.pending : null}
            style={{ backgroundColor: scanDots[i] && color, color }}>
            {'·'}
          </div>
        </div>
      ))}
    </React.Fragment>
  );
};

Barbells.propTypes = {
  scans: PropTypes.array.isRequired,
  models: PropTypes.array.isRequired,
};

export default Barbells;
