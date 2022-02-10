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
const ORANGE = '#FFC37D';
const BUFF = '#FFF2D9';

const ModelFilters = ({ filters, onChangeFilter }) => (
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
      checked={filters.missing}
      color={ORANGE}
      label="Missing"
      onChange={checked => onChangeFilter('missing', checked)}
    />
    <Checkbox
      checked={filters.insufficient}
      color={BUFF}
      label="Insuff."
      onChange={checked => onChangeFilter('insufficient', checked)}
    />
    <Checkbox
      checked={!filters.all}
      color={GRAY}
      label="Hide All"
      onChange={checked => onChangeFilter('all', !checked)}
    />
  </FilterRow>
);

ModelFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onChangeFilter: PropTypes.func.isRequired,
};

export default ModelFilters;
