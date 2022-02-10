import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

import ObjectPie from './objectPie';
import Units from './Units';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  grid-template-rows: auto;
  grid-auto-flow: row dense;
  justify-items: center;
`;

const Divider = styled.div`
  border: solid 1px #cccccc;
  grid-row: 1 / 2;
  grid-column: 2 / 3;
  margin: 10px 0 10px 0;
  width: 0;
`;

const LimitLabel = styled.span`
  color: #777777;
  font-size: 14px;
  flex: 1 0 auto;
`;

const Input = styled.input`
  background-color: ${props => (props.invalid ? 'orange' : '#eaeaea')};
  border: none;
  color: #464646;
  font-size: 12px;
  height: 20px;
  margin: 10px 4px;
  padding-left: 5px;
  width: 65px;
  :invalid {
    box-shadow: none;
    outline: 0;
  }
`;
const LabeledInput = styled.div`
  align-items: baseline;
  display: flex;
`;

const PieDiv = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const LimitInput = ({
  customValidity,
  label,
  value,
  onChange,
  step,
  invalidInput,
}) => (
  <LabeledInput>
    <LimitLabel>{label}</LimitLabel>
    <Input
      min={0}
      step={step}
      type="number"
      value={value}
      invalid={invalidInput}
      title={customValidity}
      onChange={e => onChange(e.target.value)}
    />
  </LabeledInput>
);

LimitInput.propTypes = {
  label: PropTypes.string.isRequired,
  step: PropTypes.number.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  invalidInput: PropTypes.bool,
  customValidity: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

LimitInput.defaultProps = {
  invalidInput: false,
  customValidity: null,
};

const LimitInputGroup = styled.div``;

export default class Tolerances extends React.PureComponent {
  static propTypes = {
    diffData: PropTypes.object.isRequired,
    limits: PropTypes.object.isRequired,
    modelUnits: PropTypes.string.isRequired,
    onLimitChange: PropTypes.func.isRequired,
    onUnitsChange: PropTypes.func.isRequired,
    step: PropTypes.number.isRequired,
    units: PropTypes.string,
  };

  static defaultProps = {
    units: null,
  };

  state = {
    Rinvalid: false,
    Yinvalid: false,
    Ginvalid: false,
  };

  render() {
    const {
      diffData,
      limits,
      modelUnits,
      onLimitChange,
      onUnitsChange,
      step,
      units,
    } = this.props;

    const { Rinvalid, Yinvalid, Ginvalid } = this.state;
    return (
      <Grid>
        <Divider />
        <LimitInputGroup>
          <LimitInput
            label="Ignore"
            value={limits.crop}
            invalidInput={Rinvalid}
            onChange={value => {
              const v = parseFloat(value);

              this.setState({
                Yinvalid: v < limits.red,
                Ginvalid: v < limits.yellow,
              });

              onLimitChange({ limit: 'crop', value });
            }}
            step={step}
            customValidity="Variances lower than this number will be red, higher will be grey"
          />
          <LimitInput
            label="Tolerance"
            value={limits.red}
            invalidInput={Yinvalid}
            onChange={value => {
              const v = parseFloat(value);

              this.setState({
                Yinvalid: v > limits.crop,
                Ginvalid: v < limits.yellow,
              });

              onLimitChange({ limit: 'red', value });
            }}
            step={step}
            customValidity="Variances lower than this number will be yellow, higher will be red"
          />
          <LimitInput
            label="Warn"
            value={limits.yellow}
            invalidInput={Ginvalid}
            onChange={value => {
              const v = parseFloat(value);

              this.setState({
                Ginvalid: v > limits.crop || v > limits.red,
              });

              onLimitChange({ limit: 'yellow', value });
            }}
            step={step}
            customValidity="Variances lower than this number will be green, higher will be yellow"
          />
        </LimitInputGroup>
        <PieDiv>
          <ObjectPie
            diffData={diffData}
            limits={limits}
            modelUnits={modelUnits}
            size={80}
            units={units}
          />
          <div style={{ height: '10px' }} />
          <Units onChange={onUnitsChange} units={units} />
        </PieDiv>
      </Grid>
    );
  }
}
