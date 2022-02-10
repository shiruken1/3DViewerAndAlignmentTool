/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Message } from 'semantic-ui-react';
import styled from 'react-emotion/macro';

/* App */
import Modal from 'modals/Modal';

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 20.5px;
  overflow-y: auto;
`;

const DeleteButton = styled(Button)`
  margin: 15px 15px !important;
  width: 100px;
  float: right;
`;

const VL = styled.ul`
  max-height: 20em;
`;

export default class DeleteDiff extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    diff: PropTypes.object.isRequired,
  };

  static defaultProps = {
    error: [],
  };

  render() {
    const { diff, error, onCancel, onDelete } = this.props;
    const isError = error.length > 0;

    return (
      <Modal title="Delete Diff" onClose={onCancel} closeLabel="Cancel">
        <Content>
          <Form error={isError}>
            <span>Are you sure you wish to delete {diff.name}?</span>
            {diff.diffViews.length ? (
              <React.Fragment>
                <p>The following Diff Views will also be deleted:</p>
                <VL>
                  {diff.diffViews.map(v => (
                    <li key={v.id}>{v.name}</li>
                  ))}
                </VL>
              </React.Fragment>
            ) : null}
            <Message
              error
              header="Diff deletion failed"
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
