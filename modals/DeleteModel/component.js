/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Form, Message } from 'semantic-ui-react';
import styled from 'react-emotion/macro';

/* App */
import Modal from 'modals/Modal';
import { ListDiffs } from 'modals/DeleteScan/component';

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

const VL = styled.ul`
  max-height: 20em;
`;

const ListScans = ({ title, diffs }) => (
  <React.Fragment>
    <p>{title}:</p>
    <VL>
      {diffs.map(d => (
        <div key={d.id}>
          <li>{d.name}</li>
          <VL>
            {d.scans.filter(s => !s.deleted).map(s => (
              <li key={s.id}>{s.name}</li>
            ))}
          </VL>
        </div>
      ))}
    </VL>
  </React.Fragment>
);

ListScans.propTypes = {
  title: PropTypes.string.isRequired,
  diffs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      scan: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        deleted: PropTypes.bool.isRequired,
      }),
    }).isRequired,
  ),
};

ListScans.defaultProps = {
  diffs: null,
};

export default class DeleteModel extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    diffs: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
  };

  static defaultProps = {
    error: [],
    diffs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        diffViews: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
          }).isRequired,
        ),
      }).isRequired,
    ),
  };

  render() {
    const { error, onCancel, onDelete, model, diffs } = this.props;
    const isError = error.length > 0;
    return (
      <Modal title="Delete Model" onClose={onCancel} closeLabel="Cancel">
        <Content>
          <Form error={isError}>
            <span>Are you sure you wish to delete {model.name}?</span>
            {diffs.some(d => !d.scan.deleted) ? (
              <ListScans
                title="The following Point Clouds will need to be associated to another model in order to diff"
                diffs={diffs}
              />
            ) : null}
            {diffs.length ? (
              <ListDiffs
                title="The following Diffs and their Diff Views will also be deleted"
                diffs={diffs}
              />
            ) : null}
            <Message
              error
              header="Model deletion failed"
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
