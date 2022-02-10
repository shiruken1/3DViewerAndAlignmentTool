/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Item, Message, Grid } from 'semantic-ui-react';

import styled from 'react-emotion/macro';

/* App */
import Modal from 'modals/Modal';
import fileTypes from 'util/fileTypes';
import UploadFileCard from 'components/UploadFileCard';

import css from './UploadModel.module.scss';

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 20.5px;
`;

const UploadButton = styled(Button)`
  margin: 0px 0px 15px 275px !important;
  width: 125px;
`;

export default class extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    projectId: PropTypes.string,
  };

  static defaultProps = {
    error: [],
    projectId: null,
  };

  state = {
    name: '',
    description: '',
    file: undefined,
    fileMdb2: undefined,
  };

  addFile = file => {
    this.setState({ file });
    // autofill the name if a file was dragged while textbox empty
    if (!this.state.name) {
      this.setState({ name: file.name.split('.').shift() });
    }
  };

  addFileMdb2 = file => this.setState({ fileMdb2: file });

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  render() {
    const { projectId, error, onCancel, onCreate } = this.props;
    const { name, description, file, fileMdb2 } = this.state;

    if (!projectId) {
      return null;
    }

    const isError = error.length > 0;
    const isVue = file && file.name.endsWith('.vue');
    const filter = fileTypes.model;
    const isEnabled = name.trim().length && file && (!isVue || fileMdb2);

    return (
      <Modal
        title="Upload Model"
        onClose={onCancel}
        closeLabel="Cancel"
        width="900px">
        <Content className={css.Card}>
          <Grid stretched>
            <Grid.Column width="8">
              <Form error={isError} className={css.leftColumn}>
                <UploadFileCard
                  fileTypeName="model"
                  fileTypes={filter}
                  onUploadFile={this.addFile}
                  projectId={projectId}
                />
                <Form.Input
                  inline
                  required
                  // label="Name"
                  placeholder="Model Name*"
                  name="name"
                  value={name}
                  onChange={this.handleChange}
                />
                <Form.Input
                  inline
                  // label="Description"
                  placeholder="Description"
                  name="description"
                  value={description}
                  onChange={this.handleChange}
                />
                {file && (
                  <Item.Group className={css.sizeInfo}>
                    <Item
                      // header={file.name}
                      description={
                        <div>
                          <span>Size: </span>
                          <span>{`${(file.size / 1048576).toFixed(0)}mb`}</span>
                        </div>
                      }
                    />
                  </Item.Group>
                )}
                <Message
                  error
                  header="Model creation failed"
                  content={
                    <ul>
                      {error.map(e => (
                        <li key={e.field}>
                          {e.message.includes('Duplicate') &&
                            `Model '${name}' already exists. `}
                          {e.message}
                        </li>
                      ))}
                    </ul>
                  }
                />
              </Form>
            </Grid.Column>
            <Grid.Column width="8" className={css.rightColumn}>
              {isVue ? (
                <div className={css.additionalFile}>
                  <UploadFileCard
                    fileTypeName="mdb2"
                    fileTypes={['.mdb2']}
                    onUploadFile={this.addFileMdb2}
                    projectId={projectId}
                  />
                  <span>Additional .mdb file upload required</span>
                </div>
              ) : (
                <div className={css.additionalInfo}>
                  <span>ADDITIONAL UPLOAD</span>
                  <br />
                  <span>
                    Certain filetypes require additional information or files.
                    This area will become active only if necessary.
                  </span>
                </div>
              )}
              {fileMdb2 && (
                <Item.Group className={css.sizeInfo}>
                  <Item
                    header={fileMdb2.name}
                    description={
                      <div>
                        <span>Size: </span>
                        <span>{`${(file.size / 1048576).toFixed(0)}mb`}</span>
                      </div>
                    }
                  />
                </Item.Group>
              )}
            </Grid.Column>
          </Grid>
        </Content>
        <UploadButton
          disabled={!isEnabled}
          primary
          onClick={() => onCreate(this.state)}>
          Add Model
        </UploadButton>
      </Modal>
    );
  }
}
