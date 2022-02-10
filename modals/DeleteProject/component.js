/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Message } from 'semantic-ui-react';
import styled from 'react-emotion/macro';

/* App */
import Modal from 'modals/Modal';

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 20.5px;
`;

const DeleteButton = styled(Button)`
  margin: 15px 15px !important;
  width: 100px;
  float: right;
`;

export default class DeleteProject extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    project: PropTypes.object.isRequired,
  };

  static defaultProps = {
    error: [],
  };

  render() {
    const {
      error,
      onCancel,
      onDelete,
      project: { name },
    } = this.props;
    const isError = error.length > 0;

    return (
      <Modal title="Delete Project" onClose={onCancel} closeLabel="Cancel">
        <Content>
          <Form error={isError}>
            <span>Are you sure you wish to delete {name}?</span>
            <Message
              error
              header="Project deletion failed"
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
        <DeleteButton primary negative onClick={onDelete}>
          Delete
        </DeleteButton>
      </Modal>
    );
  }
}
