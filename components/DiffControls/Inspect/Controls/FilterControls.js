/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

/* App */
import Header from '../../Header';
import ScanFilters from '../../ScanFilters';

import ModelFilters from './ModelFilters';
import ObjectMode from './ObjectMode';
import ViewDirection from './ViewDirection';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const LimitsGroup = ({
  diffSettings,
  setFilter,
  setViewDirection,
  setObjectMode,
}) => (
  <Container>
    <ModelFilters
      filters={diffSettings.focus.modelFilters}
      onChangeFilter={(name, value) => setFilter('modelFilters', name, value)}
    />
    <Header>Filter Point Cloud</Header>
    <ScanFilters
      filters={diffSettings.focus.scanFilters}
      onChangeFilter={(name, value) => setFilter('scanFilters', name, value)}
    />
    <Header>Object View</Header>
    <ObjectMode
      setObjectMode={setObjectMode}
      objectMode={diffSettings.focus.objectMode}
    />
    <Header>View Rotation</Header>
    <ViewDirection
      setViewDirection={setViewDirection}
      viewDirection={diffSettings.focus.viewDirection}
    />
  </Container>
);

LimitsGroup.propTypes = {
  diffSettings: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  setViewDirection: PropTypes.func.isRequired,
  setObjectMode: PropTypes.func.isRequired,
};

export default LimitsGroup;
