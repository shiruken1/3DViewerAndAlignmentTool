/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import { Button, Header, List, Modal, Progress } from 'semantic-ui-react';

/* App */

const Upload = ({ upload, onDelete }) => (
  <List.Item>
    <List.Content floated="right">
      {upload.done ? (
        <Button icon="close" size="mini" onClick={() => onDelete(upload.id)} />
      ) : null}
    </List.Content>
    <List.Content>
      <List.Header>
        {upload.kind === 'model' ? 'Model: ' : 'Scan: '}
        {upload.name}
      </List.Header>
      <List.List>
        {upload.files.map(f => (
          <List.Item key={f.fileName}>
            <List.Content>
              <List.Description>
                {f.fileName} {f.progress}/{f.fileSize}
              </List.Description>
              <Progress
                autoSuccess
                percent={(100 * f.progress) / f.fileSize}
                size="small"
              />
            </List.Content>
          </List.Item>
        ))}
      </List.List>
    </List.Content>
  </List.Item>
);
Upload.propTypes = {
  upload: PropTypes.shape({
    id: PropTypes.string.isRequired,
    kind: PropTypes.string.isRequired,
    files: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string.isRequired,
        fileSize: PropTypes.number.isRequired,
        progress: PropTypes.number.isRequired,
        done: PropTypes.bool.isRequired,
      }),
    ),
    name: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default class UploadsStatus extends React.PureComponent {
  static propTypes = {
    uploads: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        kind: PropTypes.string.isRequired,
        files: PropTypes.arrayOf(
          PropTypes.shape({
            fileName: PropTypes.string.isRequired,
            fileSize: PropTypes.number.isRequired,
            progress: PropTypes.number.isRequired,
            done: PropTypes.bool.isRequired,
          }),
        ),
        // TODO: should get artifact id and query for name
        name: PropTypes.string.isRequired,
      }),
    ).isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  render() {
    const { uploads, onClose, onDelete } = this.props;
    return (
      <Modal open closeIcon onClose={onClose}>
        <Header content="Upload Status" />
        <Modal.Content>
          <List divided>
            {uploads.map(u => (
              <Upload key={u.id} upload={u} onDelete={onDelete} />
            ))}
          </List>
        </Modal.Content>
      </Modal>
    );
  }
}
