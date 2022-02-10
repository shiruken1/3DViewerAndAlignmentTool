/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Form, Message } from 'semantic-ui-react';
import styled from 'react-emotion/macro';

/* App */
import Modal from 'modals/Modal';
import Button from 'components/Button';

const Content = styled.div`
  align-items: left;
  padding: 10px;
`;

const CreateButton = styled(Button)`
  margin: 15px 0px;
  width: 100px;
  float: right;
`;

export default class CreateProject extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    error: [],
  };

  state = {
    name: '',
    description: '',
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  render() {
    const { error, onCancel, onCreate } = this.props;
    const { name, description } = this.state;
    const isError = error.length > 0;

    return (
      <Modal title="Create Project" onClose={onCancel} closeLabel="Cancel">
        <Content>
          <Form error={isError}>
            <Form.Input
              label="Name"
              placeholder="Name"
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            <Form.Input
              label="Description"
              placeholder="Description"
              name="description"
              value={description}
              onChange={this.handleChange}
            />
            <Message
              error
              header="Project creation failed"
              content={
                <ul>
                  {error.map(e => (
                    <li key={e.field}>{e.message}</li>
                  ))}
                </ul>
              }
            />
          </Form>
          <CreateButton primary onClick={() => onCreate(this.state)}>
            Create
          </CreateButton>
        </Content>
      </Modal>
    );
  }
}
