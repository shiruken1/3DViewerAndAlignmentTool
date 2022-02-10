/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

/* App */
import RadioButton from 'components/RadioButton';

const Group = styled.div`
  display: flex;
`;

const DiffViewType = ({ objectMode, setObjectMode }) => (
  <Group>
    <RadioButton
      label="Isolate"
      checked={objectMode === 'Isolate'}
      onCheck={() => setObjectMode('Isolate')}
    />
    <RadioButton
      label="View Context"
      checked={objectMode === 'Context'}
      onCheck={() => setObjectMode('Context')}
    />
    <RadioButton
      label="Expand Context"
      checked={objectMode === 'Expand'}
      onCheck={() => setObjectMode('Expand')}
    />
  </Group>
);
DiffViewType.propTypes = {
  setObjectMode: PropTypes.func.isRequired,
  objectMode: PropTypes.string.isRequired,
};

export default DiffViewType;
