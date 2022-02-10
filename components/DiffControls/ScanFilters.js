import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion/macro';

import Checkbox from 'components/Checkbox';

const FilterRow = styled.div`
  display: flex;
`;

const RED = '#c60000';
const YELLOW = '#f4e31e';
const GREEN = '#00d100';
const GRAY = '#777777';

const ScanFilters = ({ filters, onChangeFilter }) => (
  <FilterRow>
    <Checkbox
      checked={filters.red}
      color={RED}
      onChange={checked => onChangeFilter('red', checked)}
    />
    <Checkbox
      checked={filters.yellow}
      color={YELLOW}
      onChange={checked => onChangeFilter('yellow', checked)}
    />
    <Checkbox
      checked={filters.green}
      color={GREEN}
      onChange={checked => onChangeFilter('green', checked)}
    />
    <Checkbox
      checked={filters.cropped}
      color={GRAY}
      label="Cropped"
      onChange={checked => onChangeFilter('cropped', checked)}
    />
    <Checkbox
      checked={!filters.all}
      color={GRAY}
      label="Hide All"
      onChange={checked => onChangeFilter('all', !checked)}
    />
  </FilterRow>
);

ScanFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
};

export default ScanFilters;
