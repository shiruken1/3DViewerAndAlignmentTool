/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

/* App */
import unitDefs from 'util/units';
import Header from '../../Header';
import ScanFilters from '../../ScanFilters';
import ModelFilters from './ModelFilters';
import Tolerances from './Tolerances';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const FilterControls = ({
  diffData,
  diffSettings,
  modelUnits,
  setFilter,
  setLimit,
  setUnits,
}) => {
  const { limits } = diffSettings;
  const units = diffSettings.units || modelUnits;
  const step = unitDefs[units].toleranceStep;
  return (
    <Container>
      <Header>Tolerances</Header>
      <Tolerances
        diffData={diffData}
        limits={limits}
        modelUnits={modelUnits}
        onLimitChange={change => setLimit(change)}
        onUnitsChange={newUnits => setUnits(newUnits)}
        step={step}
        units={units}
      />
      <Header>Filter Point Cloud</Header>
      <ScanFilters
        filters={diffSettings.overview.scanFilters}
        onChangeFilter={(name, value) => setFilter('scanFilters', name, value)}
      />
      <Header>Filter Model Objects</Header>
      <ModelFilters
        filters={diffSettings.overview.modelFilters}
        onChangeFilter={(name, value) => setFilter('modelFilters', name, value)}
      />
    </Container>
  );
};

FilterControls.propTypes = {
  diffData: PropTypes.object,
  diffSettings: PropTypes.object.isRequired,
  modelUnits: PropTypes.string.isRequired,
  setLimit: PropTypes.func.isRequired,
  setUnits: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
};
FilterControls.defaultProps = {
  diffData: null,
};

export default FilterControls;
