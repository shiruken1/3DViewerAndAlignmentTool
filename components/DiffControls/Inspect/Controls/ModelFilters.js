import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion/macro';

import Checkbox from 'components/Checkbox';

const FilterRow = styled.div`
  display: flex;
`;

const GRAY = '#777777';

const ModelFilters = ({ filters, onChangeFilter }) => (
  <FilterRow>
    <Checkbox
      checked={!filters.all}
      color={GRAY}
      label="Hide Model"
      onChange={checked => onChangeFilter('all', !checked)}
    />
  </FilterRow>
);

ModelFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
};

export default ModelFilters;
