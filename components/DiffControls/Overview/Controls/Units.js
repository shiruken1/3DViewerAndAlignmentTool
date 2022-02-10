import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

import styled from 'react-emotion/macro';
import UNITS from 'util/units';

const Select = styled(Dropdown)`
  min-width: 8em !important;
`;

const Units = ({ units, onChange }) => (
  <Select
    onChange={(e, d) => {
      onChange(d.value);
    }}
    options={Object.keys(UNITS).map(u => ({ text: u, value: u }))}
    selection
    text={units}
  />
);

Units.propTypes = {
  units: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Units;
