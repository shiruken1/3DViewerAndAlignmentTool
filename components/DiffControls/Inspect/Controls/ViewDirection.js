/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

/* App */
import RadioButton from 'components/RadioButton';

const Group = styled.div`
  display: flex;
`;

const DiffViewDirection = ({ viewDirection, setViewDirection }) => (
  <Group>
    <RadioButton
      label="Top"
      checked={viewDirection === 'top'}
      onCheck={() => setViewDirection('top')}
    />
    <RadioButton
      label="Side"
      checked={viewDirection === 'side'}
      onCheck={() => setViewDirection('side')}
    />
    <RadioButton
      label="Front"
      checked={viewDirection === 'front'}
      onCheck={() => setViewDirection('front')}
    />
    <RadioButton
      label="3/4"
      checked={viewDirection === 'threeQuarter'}
      onCheck={() => setViewDirection('threeQuarter')}
    />
  </Group>
);
DiffViewDirection.propTypes = {
  setViewDirection: PropTypes.func.isRequired,
  viewDirection: PropTypes.string,
};

DiffViewDirection.defaultProps = {
  viewDirection: null,
};

export default DiffViewDirection;
