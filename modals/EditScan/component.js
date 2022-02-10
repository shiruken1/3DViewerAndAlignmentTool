/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Message } from 'semantic-ui-react';
import styled from 'react-emotion/macro';

/* App */
import Modal from 'modals/Modal';

const Content = styled.div`
  align-items: left;
  padding: 20.5px;
`;

const AcceptButton = styled(Button)`
  margin: 15px 15px !important;
  width: 100px;
  float: right;
`;

export default class UpdateScan extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    scan: PropTypes.object.isRequired,
  };

  static defaultProps = {
    error: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      name: props.scan.name || '',
      description: props.scan.description || '',
    };
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  render() {
    const { error, onCancel, onUpdate } = this.props;
    const { name, description } = this.state;
    const isError = error.length > 0;

    return (
      <Modal
        title="Edit Point Cloud"
        onClose={onCancel}
        closeLabel="Cancel"
        onMount={this.setStateFromProps}>
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
              header="Scan editing failed"
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
        <AcceptButton primary onClick={() => onUpdate(this.state)}>
          Accept
        </AcceptButton>
      </Modal>
    );
  }
}
