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

const VL = styled.ul`
  max-height: 20em;
`;

const ListDiffs = ({ title, diffs }) => (
  <React.Fragment>
    <p>{title}:</p>
    <VL>
      {diffs.map(d => (
        <div key={d.id}>
          <li>{d.name}</li>
          <VL>
            {d.diffViews.filter(v => !v.deleted).map(v => (
              <li key={v.id}>{v.name}</li>
            ))}
          </VL>
        </div>
      ))}
    </VL>
  </React.Fragment>
);

ListDiffs.propTypes = {
  title: PropTypes.string.isRequired,
  diffs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      diffViews: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          deleted: PropTypes.bool.isRequired,
        }).isRequired,
      ),
    }).isRequired,
  ),
};

ListDiffs.defaultProps = {
  diffs: null,
};

export { ListDiffs };

export default class DeleteScan extends React.PureComponent {
  static propTypes = {
    error: PropTypes.array,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    scan: PropTypes.object.isRequired,
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

  static defaultProps = {
    error: [],
    diffs: null,
  };

  render() {
    const { scan, diffs, error, onCancel, onDelete } = this.props;
    const isError = error.length > 0;

    const udiffs = diffs.filter(d => !d.deleted);

    return (
      <Modal title="Delete Scan" onClose={onCancel} closeLabel="Cancel">
        <Content>
          <Form error={isError}>
            <span>Are you sure you wish to delete {scan.name}?</span>
            {udiffs.length ? (
              <ListDiffs
                title="The following Diffs and their Diff Views will also be deleted"
                diffs={udiffs}
              />
            ) : null}
            <Message
              error
              header="Scan deletion failed"
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
