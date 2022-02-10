/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Header,
  Icon,
  Image,
  Modal,
  Popup,
} from 'semantic-ui-react';
import Dropzone from 'react-dropzone';

/* App */

import css from './UploadThumb.module.scss';

const fileTypes = ['.ico', '.jpeg', '.jpg', '.png'];

export default class extends React.PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onSetThumb: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      rejected: false,
    };
    this.imgRef = React.createRef();
  }

  onDrop = accepted => {
    accepted.forEach(this.addFile);
  };

  onDropRejected = () => {
    this.setState({ rejected: true });
  };

  onDropAccepted = () => {
    this.setState({ rejected: false });
  };

  // read file as Data URL and set into state
  addFile = file => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.setState({ url: reader.result });
      },
      false,
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // read resized image from img tag and return as Data URL
  resizeImage = () => {
    const img = this.imgRef.current.childNodes[0];
    const { height, width } = img;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/png');
  };

  render() {
    const { onCancel, onSetThumb } = this.props;
    const { url } = this.state;
    const msg = `Unsupported file type.  Accepted types include: ${fileTypes.join(
      ', ',
    )}`;
    return (
      <Modal open>
        <Header content="Set Image" />
        <Modal.Content>
          <div className={css.content}>
            <Card className={css.UploadCard}>
              <Popup
                trigger={
                  <Card.Content
                    as={Dropzone}
                    accept={fileTypes.join(',')}
                    multiple={false}
                    onDrop={this.onDrop}
                    onDropRejected={this.onDropRejected}
                    onDropAccepted={this.onDropAccepted}
                    activeClassName={css.dzActive}
                    textAlign="center">
                    Drag image file here
                    <br />
                    -or-
                    <br />
                    <Button size="medium" color="black">
                      Browse
                    </Button>
                  </Card.Content>
                }
                open={this.state.rejected}
                content={msg}
              />
            </Card>
            <div className={css.preview}>
              <div ref={this.imgRef}>
                <Image className={css.image} src={url} />
              </div>
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={() => {
              onSetThumb(this.resizeImage());
            }}
            primary>
            <Icon name="checkmark" />
            OK
          </Button>
          <Button onClick={onCancel}>
            <Icon name="cancel" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
