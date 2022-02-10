/* NPM */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

import unitDefs from 'util/units';

import Header from 'components/DiffControls/Header';

const Outer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 15px 15px 15px;
`;

const Top = styled.div`
  margin-bottom: 5px;
`;

const Bottom = styled.div`
  overflow-y: auto;
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-rows: 28px;
  grid-auto-rows: 21px;
  grid-gap: 2px;
  margin-top: -5px;
`;

const RowGrid = styled.div`
  align-items: end;
  display: grid;
  grid-template-columns: minmax(190px, 1fr) 38px;
  grid-gap: 2px;
  padding-right: 8px;

  background: ${props => props.background};
  color: ${props => props.color};
`;

const arrows = {
  ascending: '\uf077',
  descending: '\uf078',
};

const HeaderArrow = styled.div`
  font-family: Icons;
  font-size: 12px;
  line-height: 28x;
  padding-left: 5px;
`;
const HeaderText = styled.div`
  font-size: 12px;
  font-weight: 400;
  letter-spacing: -0.1px;
  line-height: 1;
`;
const HeaderCell = styled.div`
  align-items: flex-end;
  color: #777777;
  display: flex;
`;

const ItemRow = styled(RowGrid)`
  border-color: ${props => (props.selected ? '#1d76bc' : 'transparent')};
  border-style: solid;
  border-width: 3px;
  &:hover {
    border-color: #7a9fbc;
  }
`;

const Item = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-top: -1px;
  text-align: ${props => (props.right ? 'right' : 'left')};
  &:first-child {
    margin-left: 1px;
  }
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 700;
`;

const Input = styled.input`
  vertical-align: text-top;
  margin-right: 2px;
`;

const SliderInput = styled.input`
  vertical-align: text-top;
  margin-left: 4px;
  font-size: 11px;
  &:-webkit-slider-thumb {
    background: goldenrod;
  }
`;

const Displacement = styled.label`
  font-size: 11px;
  font-weight: 400;
`;

const sortByColumn = column => (a, b) => {
  if (a[column] < b[column]) return -1;
  if (a[column] > b[column]) return 1;
  return 0;
};

const sortFunc = ({ column, direction }) => {
  const f = sortByColumn(column);
  if (direction === 'ascending') {
    return f;
  }
  return (a, b) => f(b, a);
};

export default class extends PureComponent {
  static propTypes = {
    diffData: PropTypes.object,
    diffSettings: PropTypes.object.isRequired,
    modelUnits: PropTypes.string.isRequired,
    onClickRow: PropTypes.func.isRequired,
  };
  static defaultProps = {
    diffData: null,
  };
  state = {
    row: null,
    column: this.props.diffSettings.sortby.column,
    direction: this.props.diffSettings.sortby.direction,
    displaced: false,
    dispScore: 0,
  };

  componentDidUpdate() {
    if (
      this.props.diffSettings &&
      this.props.diffSettings.focus &&
      this.props.diffSettings.focus.objectId
    ) {
      const focus = this.props.diffSettings.focus.objectId;
      if (focus !== this.state.focus) {
        const row = document.querySelector(`[id='${focus}']`);
        if (row && !this.isScrolledIntoView(row))
          row.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ focus });
      }
    }
    const { sortby } = this.props.diffSettings;
    if (
      sortby.column !== this.state.column ||
      sortby.direction !== this.state.direction
    ) {
      sortby.column = this.state.column;
      sortby.direction = this.state.direction;
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ sortby });
    }
  }

  isScrolledIntoView = row => {
    const rect = row.getBoundingClientRect();
    const { top, bottom } = rect;
    const isVisible = top >= 0 && bottom <= window.innerHeight;
    return isVisible;
  };

  handleSort = clickedColumn => () => {
    if (clickedColumn === this.state.column) {
      this.setState(prevState => ({
        direction:
          prevState.direction === 'ascending' ? 'descending' : 'ascending',
      }));
    } else {
      this.setState({
        column: clickedColumn,
      });
    }
  };

  toggleChange = () => {
    this.setState(prevState => ({
      displaced: !prevState.displaced,
    }));
  };

  toggleScoreChange = e => {
    const { value } = e.target;
    this.setState({
      dispScore: value,
    });
  };

  items = () => {
    const { diffData, diffSettings, modelUnits, onClickRow } = this.props;
    if (!diffData) {
      return null;
    }
    const {
      focus: { objectId: focusObjectId },
      limits: hL,
      overview: { modelFilters: mF },
    } = diffSettings;
    function mapColor({ dm, seen }) {
      if (!seen) {
        return { background: '#FFF2D9', color: 'black' };
      }
      if (dm >= hL.red) {
        return { background: '#FFB3B3', color: 'black' };
      }
      if (dm >= hL.yellow) {
        return { background: '#FFFFBF', color: 'black' };
      }
      return { background: '#B3FFB3', color: 'black' };
    }
    const { precision } = unitDefs[diffSettings.units || modelUnits];
    const scale = unitDefs[modelUnits].to[diffSettings.units || modelUnits];
    return Object.values(diffData.diffs)
      .map(vList => vList[0])
      .map(v => ({ ...v, dm: scale * v.dm }))
      .filter(v => {
        if (!v.seen) {
          return mF.insufficient;
        }
        if (v.dm < hL.yellow) {
          if (!mF.green) return false;
        } else if (v.dm < hL.red) {
          if (!mF.yellow) return false;
        } else if (v.dm < hL.crop) {
          if (!mF.red) return false;
        } else {
          return false;
        }
        return true;
      })
      .map(v => ({
        id: v.id,
        name: `${v.id}_${v.index}`,
        discrepancy: v.dm.toFixed(precision),
        displacement: 100 * (v.dispClose / v.seenPoints),
        colors: mapColor(v),
      }))
      .sort(sortFunc(this.state))
      .map(v => {
        const { colors, discrepancy, name, displacement } = v;
        return (
          <ItemRow
            id={v.id}
            key={v.id}
            onClick={() => onClickRow(v.id)}
            color={colors.color}
            displacement={displacement}
            background={colors.background}
            selected={v.id === focusObjectId}>
            <Item selected={v.id === focusObjectId}>{name}</Item>
            <Item right selected={v.id === focusObjectId}>
              {discrepancy}
            </Item>
          </ItemRow>
        );
      });
  };
  render() {
    const { column, direction, dispScore } = this.state;
    const displaced = this.items().filter(
      v => v.props.displacement >= dispScore,
    );
    return (
      <Outer>
        <Top>
          <Header>Variance List</Header>
          <Label htmlFor="showDisplacement">
            <Input
              type="checkbox"
              id="showDisplacement"
              defaultChecked={this.state.displaced}
              onChange={this.toggleChange}
            />
            Show Displacements Only
          </Label>
          <span>
            <SliderInput
              type="range"
              min="0"
              max="100"
              step="1"
              id="dispScoreInput"
              value={dispScore}
              onChange={this.toggleScoreChange}
              disabled={!this.state.displaced}
            />{' '}
            <Displacement>{dispScore}%</Displacement>
          </span>
          <RowGrid>
            <HeaderCell onClick={this.handleSort('name')}>
              <HeaderText>Object Name</HeaderText>
              <HeaderArrow>
                {column === 'name' ? arrows[direction] : null}
              </HeaderArrow>
            </HeaderCell>
            <HeaderCell onClick={this.handleSort('discrepancy')}>
              <HeaderText>Max Var.</HeaderText>
              <HeaderArrow>
                {column === 'discrepancy' ? arrows[direction] : null}
              </HeaderArrow>
            </HeaderCell>
          </RowGrid>
        </Top>
        <Bottom>
          {this.state.displaced ? (
            <ListGrid>{displaced}</ListGrid>
          ) : (
            <ListGrid>{this.items()}</ListGrid>
          )}
        </Bottom>
      </Outer>
    );
  }
}
