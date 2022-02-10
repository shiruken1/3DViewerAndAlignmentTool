/* NPM */
import React from 'react';
import accept from 'attr-accept';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import styled from 'react-emotion/macro';
import { Card, Popup, Icon } from 'semantic-ui-react';

/* App */
import LinkButton from 'components/LinkButton';
import css from './UploadFileCard.module.scss';

const BrowseButton = styled(LinkButton)`
  text-decoration: underline;
`;

export default class extends React.PureComponent {
  static propTypes = {
    fileTypeName: PropTypes.string.isRequired,
    fileTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
    onUploadFile: PropTypes.func.isRequired,
    projectId: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.state = { rejected: false };
  }

  onDrop = (accepted, rejected) => {
    const { onUploadFile, fileTypes, projectId } = this.props;
    // for dropped files, all will be considered rejected because dropzone
    // tries to test mime types against accept prop, but no mime types are
    // provided with dragged files.  So, retest them.
    const files = [...accepted, ...rejected.filter(f => accept(f, fileTypes))];
    files.forEach(f => onUploadFile(f, projectId));
  };

  onDropRejected = () => {
    this.setState({ rejected: true });
  };

  onDropAccepted = () => {
    this.setState({ rejected: false });
  };

  render() {
    const { fileTypeName, fileTypes } = this.props;
    const msg = `Unsupported file type.  Accepted types include: ${fileTypes.join(
      ', ',
    )}`;
    const fileType = fileTypeName === 'scan' ? 'point cloud' : fileTypeName;
    return (
      <Card className={css.UploadCard}>
        <Popup
          trigger={
            <Card.Content
              as={Dropzone}
              accept={fileTypes.join(',')}
              onDrop={this.onDrop}
              onDropRejected={this.onDropRejected}
              onDropAccepted={this.onDropAccepted}
              activeClassName={css.dzActive}
              textAlign="center">
              <Icon size="huge" name="cloud upload" className={css.Icon} />
              <br />
              <span>DRAG & DROP</span>
              <br />
              <span>
                your {fileType} file to assets, or
                <BrowseButton>browse</BrowseButton>
              </span>
            </Card.Content>
          }
          open={this.state.rejected}
          content={msg}
          inverse
        />
      </Card>
    );
  }
}
