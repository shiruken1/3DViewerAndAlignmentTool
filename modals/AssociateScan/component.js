/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Message } from 'semantic-ui-react';
import styled from 'react-emotion/macro';

import _ from 'lodash';

/* App */
import Modal from 'modals/Modal';
import css from './AssociateScan.module.scss';

const Content = styled.div`
  align-items: left;
  padding: 20.5px;
`;

const SaveButton = styled(Button)`
  margin: 15px 15px !important;
  width: 75px;
  float: right;
`;

class Align extends React.PureComponent {
  static propTypes = {
    beginAlignment: PropTypes.bool.isRequired,
    method: PropTypes.string,
    scanTranslation: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    ).isRequired,
    scanRotation: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    onChange: PropTypes.func.isRequired,
    noAA: PropTypes.bool.isRequired,
    noPreAlign: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    method: null,
  };

  onChangeCheckbox = (e, d) =>
    this.props.onChange(e, { name: d.name, value: d.checked });

  render() {
    const {
      beginAlignment,
      method,
      scanTranslation,
      scanRotation,
      onChange,
      noAA,
      noPreAlign,
    } = this.props;
    const options = [
      {
        key: 2,
        text: 'Enter Transform',
        value: 'DirectEntry',
      },
    ];

    if (!noAA) {
      options.push({
        key: 1,
        text: 'Align with SKUR',
        value: 'Assisted',
      });
    }

    if (!noPreAlign) {
      options.push({
        key: 0,
        text: 'Already Aligned',
        value: 'Prealigned',
      });
    }

    return (
      <React.Fragment>
        <Form.Select
          required
          label="Alignment"
          placeholder="Select Alignment"
          options={options}
          name="alignment.method"
          value={method}
          selection
          onChange={onChange}
        />
        {method === 'DirectEntry' && (
          <React.Fragment>
            <Form.Group widths="equal">
              <Form.Input
                required
                size="mini"
                type="number"
                label="X"
                name="alignment.scanTranslation[0]"
                value={scanTranslation[0]}
                placeholder="X offset"
                onChange={onChange}
              />
              <Form.Input
                required
                size="mini"
                type="number"
                label="Y"
                name="alignment.scanTranslation[1]"
                value={scanTranslation[1]}
                placeholder="Y offset"
                onChange={onChange}
              />
              <Form.Input
                required
                size="mini"
                type="number"
                label="Z"
                name="alignment.scanTranslation[2]"
                value={scanTranslation[2]}
                placeholder="Z offset"
                onChange={onChange}
              />
            </Form.Group>
            <Form.Input
              required
              size="mini"
              type="number"
              label="Rotation"
              name="alignment.scanRotation"
              value={scanRotation}
              placeholder="Rotational degrees"
              onChange={onChange}
            />
          </React.Fragment>
        )}
        {!noAA ? (
          method === 'Assisted' && (
            <Form.Checkbox
              label="Begin alignment after saving"
              name="beginAlignment"
              checked={beginAlignment}
              onChange={this.onChangeCheckbox}
            />
          )
        ) : (
          <span>*Align with SKUR not available for this scan.</span>
        )}
      </React.Fragment>
    );
  }
}

export default class extends React.Component {
  static propTypes = {
    defaultAlignment: PropTypes.shape({
      method: PropTypes.string.isRequired,
      scanTransform: PropTypes.array,
      scanTranslation: PropTypes.array,
      scanRotation: PropTypes.number,
    }),
    defaultModelId: PropTypes.string,
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onAssociate: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
    scan: PropTypes.object.isRequired,
    diff: PropTypes.object,
  };

  static defaultProps = {
    defaultAlignment: null,
    defaultModelId: null,
    diff: null,
    error: [],
  };

  constructor(props) {
    super(props);
    const { defaultAlignment, defaultModelId } = props;
    this.state = {
      modelId: defaultModelId,
      alignment: {
        method: null,
        scanTranslation: [0, 0, 0],
        scanRotation: 0,
        scanTransform: null,
      },
      beginAlignment: false,
    };
    if (defaultAlignment) {
      const {
        method,
        scanRotation,
        scanTranslation,
        scanTransform,
      } = defaultAlignment;
      const { alignment } = this.state;
      alignment.method = method;
      if (scanRotation !== null) {
        alignment.scanRotation = scanRotation;
      }
      if (scanTranslation !== null) {
        alignment.scanTranslation = scanTranslation;
      }
      alignment.scanTransform = scanTransform;
    }
  }

  handleChange = (e, { name, value }) => {
    this.setState(prevState => _.set(_.cloneDeep(prevState), name, value));
  };

  render() {
    const { error, onCancel, onAssociate, project, scan, diff } = this.props;
    const { alignment, beginAlignment, modelId } = this.state;
    const isError = error.length > 0;

    const modelOptions = project.models.filter(m => !m.deleted).map(m => ({
      key: m.id,
      value: m.id,
      text: m.name,
    }));
    modelOptions.unshift({
      key: 0,
      value: null,
      text: 'No Model Selected',
      className: css.noneChoice,
    });

    const canSave = alignment.method || modelId;
    const noAA = scan.stats.numPlanes < 3;
    const noPreAlign =
      diff !== null &&
      diff.modelId === modelId &&
      diff.status === 'Failed' &&
      diff.alignment &&
      diff.alignment.method === 'Prealigned';

    return (
      <Modal
        title="Associate Scan with Model"
        onClose={onCancel}
        closeLabel="Cancel"
        width="700px">
        <Content>
          <Form error={isError}>
            <Form.Input label="Scan" name="scan" readOnly value={scan.name} />
            <Form.Select
              required
              label="Model"
              placeholder="Select Model"
              options={modelOptions}
              name="modelId"
              value={modelId}
              selection
              onChange={this.handleChange}
            />
            <Align
              noAA={noAA}
              noPreAlign={noPreAlign}
              beginAlignment={beginAlignment}
              {...alignment}
              onChange={this.handleChange}
            />
            <Message
              error
              header="Scan association failed"
              content={
                <ul>
                  {error.map(e => (
                    <li key={e.field}>{e.message}</li>
                  ))}
                </ul>
              }
            />
          </Form>
        </Content>
        <SaveButton
          disabled={!canSave}
          primary
          onClick={() => onAssociate(this.state)}>
          Save
        </SaveButton>
      </Modal>
    );
  }
}
