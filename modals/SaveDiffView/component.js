/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Header, Icon, Message, Modal } from 'semantic-ui-react';

/* App */

export default class CreateDiffView extends React.PureComponent {
  static propTypes = {
    diffSettings: PropTypes.object.isRequired,
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
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
    const {
      diffSettings: { limits, units },
      error,
      onCancel,
      onSave,
    } = this.props;
    const { name, description } = this.state;
    const isError = error.length > 0;
    const tolerances = `R=${parseFloat(limits.crop).toFixed(3)}, Y=${parseFloat(
      limits.red,
    ).toFixed(3)}, G=${parseFloat(limits.yellow).toFixed(3)}`;
    return (
      <Modal open>
        <Header content="Save Diff View" />
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
              header="Details"
              content={
                <ul>
                  <li>
                    <span>Tolerances: </span>
                    <span>{tolerances}</span>
                  </li>
                  <li>
                    <span>Units: </span>
                    <span>{units}</span>
                  </li>
                </ul>
              }
            />
            <Message
              error
              header="Diff View save failed"
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
          <Button primary onClick={() => onSave(this.state)}>
            <Icon name="checkmark" /> Save
          </Button>
          <Button onClick={onCancel}>
            <Icon name="cancel" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
