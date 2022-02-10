/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion/macro';

import { Label, Form, Item, Message, Table, Popup } from 'semantic-ui-react';

/* App */
import Button from 'components/Button';
import Modal from 'modals/Modal';
import fileTypes from 'util/fileTypes';
import UploadFileCard from 'components/UploadFileCard';
import unitDefs from 'util/units';
import css from './UploadScan.module.scss';

const Content = styled.div`
  align-items: center;
  display-flex;
  flex-direction: column;
  padding: 74.5px;
`;

const UploadButton = styled(Button)`
  margin-left: 38%;
  margin-bottom: 20px;
  width: 200px;
`;

const unitsOptions = Object.keys(unitDefs).map(u => ({
  key: u,
  text: u,
  value: u,
}));

const alignOptions = [
  {
    key: 0,
    text: 'Not Aligned',
    value: null,
  },
  {
    key: 1,
    text: 'Already Aligned',
    value: 'Prealigned',
  },
  {
    key: 2,
    text: 'Align with SKUR',
    value: 'Assisted',
  },
  {
    key: 3,
    text: 'Enter Transform',
    value: 'DirectEntry',
  },
];

export default class UploadFile extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    projectId: PropTypes.string,
    modelId: PropTypes.string,
    models: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
    modelsLoading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    error: [],
    projectId: null,
    modelId: null,
    models: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      file: undefined,
      units: unitsOptions[2].key, // default to meters for scans
      associatedModelId: props.modelId,
      alignment: null,
      x: '',
      y: '',
      z: '',
      rotation: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.models && !prevProps.models) {
      const models = this.props.models.filter(m => !m.deleted);

      if (models.length === 1 && !this.state.associatedModelId) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ associatedModelId: models[0].id });
      }
    }
  }
  addFile = file => {
    this.setState({ file });
    // autofill the name if a file was dragged while textbox empty
    if (!this.state.name) {
      this.setState({ name: file.name.split('.').shift() });
    }
  };

  handleChange = (e, r) => {
    const { name } = r;
    let { value } = r;
    if (Object.prototype.hasOwnProperty.call(r, 'checked')) {
      value = r.checked; // for JIT checkbox
    }
    this.setState({ [name]: value });
  };

  render() {
    const {
      error,
      models,
      modelsLoading,
      projectId,
      onCancel,
      onCreate,
    } = this.props;

    const {
      name,
      description,
      units,
      file,
      associatedModelId,
      alignment,
      // jit,
      x,
      y,
      z,
      rotation,
    } = this.state;

    if (!projectId) {
      return null;
    }

    const isError = error.length > 0;
    const isEnabled = name.trim().length && file;

    const assocOptions = [
      {
        key: 0,
        value: null,
        text: 'No Model Selected',
        className: css.noneChoice,
      },
    ];

    if (models) {
      assocOptions.push(
        ...models.filter(m => !m.deleted).map(m => ({
          key: m.id,
          value: m.id,
          text: m.name,
        })),
      );
    }

    const filter = fileTypes.scan;
    return (
      <Modal
        title="Add Point Cloud"
        closeLabel="Cancel"
        onClose={onCancel}
        width="900px">
        <Content className={css.Content}>
          <Form error={isError}>
            <Form.Group className={css.Header}>
              <UploadFileCard
                fileTypeName="scan"
                fileTypes={filter}
                onUploadFile={this.addFile}
                projectId={projectId}
              />
              <div className={css.file}>
                {file && (
                  <Item.Group>
                    <Item
                      header={file.name}
                      description={`${(file.size / 1024 / 1024).toFixed(0)} MB`}
                    />
                  </Item.Group>
                )}
              </div>
            </Form.Group>

            <Table basic columns="2">
              <Table.Body>
                <Table.Row>
                  <Table.Cell>
                    <Form.Input
                      required
                      placeholder="Scan Name*"
                      name="name"
                      value={name}
                      onChange={this.handleChange}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Form.Select
                      // disable if coming from ModelView or no models in project
                      // required={!hideDropdown}
                      // disabled={hideDropdown}
                      inline
                      label="Link To Model"
                      loading={modelsLoading}
                      placeholder=""
                      options={assocOptions}
                      name="associatedModelId"
                      value={associatedModelId}
                      selection
                      onChange={this.handleChange}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Form.Input
                      placeholder="Description"
                      name="description"
                      value={description}
                      onChange={this.handleChange}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Popup
                      trigger={
                        <Form.Select
                          inline
                          required
                          label="Units"
                          placeholder="Units"
                          options={unitsOptions}
                          name="units"
                          value={units}
                          selection
                          onChange={this.handleChange}
                        />
                      }
                      size="small"
                      position="right center"
                      open={units !== unitsOptions[2].value}
                      content="Caution! Unless your point cloud was intentionally scaled the units should be Meters."
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    {/* This space intentionally left blank */}
                  </Table.Cell>
                  <Table.Cell>
                    <Table basic columns="1">
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell textAlign="right">
                            <Form.Select
                              inline
                              label="Alignment"
                              options={alignOptions}
                              name="alignment"
                              value={alignment}
                              selection
                              onChange={this.handleChange}
                            />
                          </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell>
                            <div
                              className={css.Xformrow}
                              style={{
                                visibility:
                                  alignment === 'DirectEntry'
                                    ? 'visible'
                                    : 'hidden',
                              }}>
                              <Label basic content="Enter Coordinates" />
                              <br />
                              <Form.Group inline required>
                                <Form.Input
                                  type="number"
                                  label="X"
                                  name="x"
                                  value={x}
                                  onChange={this.handleChange}
                                />
                                <Form.Input
                                  type="number"
                                  label="Y"
                                  name="y"
                                  value={y}
                                  onChange={this.handleChange}
                                />
                                <Form.Input
                                  type="number"
                                  label="Z"
                                  name="z"
                                  value={z}
                                  onChange={this.handleChange}
                                />
                                <Form.Input
                                  type="number"
                                  label="Rotation"
                                  name="rotation"
                                  value={rotation}
                                  onChange={this.handleChange}
                                />
                              </Form.Group>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                        {/* <Table.Row>
                          <Table.Cell textAlign="center">
                            <Form.Checkbox
                              label="JIT DIFF (beta)"
                              name="jit"
                              checked={jit}
                              onChange={this.handleChange}
                            />
                          </Table.Cell>
                        </Table.Row> */}
                      </Table.Body>
                    </Table>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>
                    <Message
                      error
                      header="Point cloud creation failed"
                      content={
                        <ul>
                          {error.map(e => (
                            <li key={e.field}>
                              {e.message.includes('Duplicate') &&
                                `Point cloud '${name}' already exists. `}
                              {e.message}
                            </li>
                          ))}
                        </ul>
                      }
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Form>
        </Content>
        <UploadButton
          disabled={!isEnabled}
          onClick={() => onCreate(this.state)}
          primary>
          Upload Point Cloud
        </UploadButton>
      </Modal>
    );
  }
}
