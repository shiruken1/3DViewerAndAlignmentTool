/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Header, Icon, Message, Modal } from 'semantic-ui-react';

/* App */

export default class CreateAccount extends React.PureComponent {
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
    const msg1 =
      'Workspace, aka Company Name is a place where your Available Diff Credits are stored.';
    const msg2 =
      'All projects in this workspace will be able to utilize the Available Diffs Credits.';
    return (
      <Modal open>
        <Header content="Create Workspace" />
        <Message
          content={
            <ul>
              <li> {msg1} </li>
              <li> {msg2} </li>
            </ul>
          }
        />
        <Modal.Content>
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
              header="Workspace creation failed"
              content={
                <ul>
                  {error.map(e => (
                    <li key={e.field}>{e.message}</li>
                  ))}
                </ul>
              }
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={() => onCreate(this.state)}>
            <Icon name="checkmark" /> Create
          </Button>
          <Button onClick={onCancel}>
            <Icon name="cancel" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
