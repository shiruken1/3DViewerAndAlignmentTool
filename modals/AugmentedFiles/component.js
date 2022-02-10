/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion/macro';

/* App */
import Button from 'components/Button';
import Modal from 'modals/Modal';

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 74.5px;
`;

const SubHeader = styled.div`
  color: ${props => props.theme.subHeaderColor};
  font-size: 24px;
  font-weight: normal;
  margin-top: 5px;
  width: 100%;
`;

const ActionButton = styled(Button)`
  margin: 5px 0;
  width: 234px;
`;

const DownloadButton = styled.a`
  border: 1px solid;
  border-radius: 3px;
  font-size: 14px;
  font-weight: 400; // normal
  height: 28px;
  margin: 5px 0;
  padding: 6px 9px 6px 9px;
  width: 234px;
  ::before {
    font-family: Icons;
    color: ${props => props.theme.secondaryColor};
    font-size: 14px;
    content: '\f019';
    margin-right: 5px;
  }
`;

const AugmentButton = ({ fileType: { path, status }, label, onClick }) => {
  if (status === null) {
    return (
      <ActionButton primary onClick={onClick}>
        {`Prepare ${label}`}
      </ActionButton>
    );
  }
  if (status === 'ready') {
    return <DownloadButton href={path}>{`Download ${label}`}</DownloadButton>;
  }
  if (status === 'failed') {
    return <ActionButton disabled>{`${label} prepare failed`}</ActionButton>;
  }
  return <ActionButton disabled>{`${label} prepare in Progress`}</ActionButton>;
};

AugmentButton.propTypes = {
  fileType: PropTypes.shape({
    path: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default class AugmentedFiles extends React.PureComponent {
  static propTypes = {
    augmentedFiles: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    onCancel: PropTypes.func.isRequired,
    onRequestAugment: PropTypes.func.isRequired,
  };

  render() {
    const { augmentedFiles, onCancel, onRequestAugment } = this.props;
    const dwg = augmentedFiles.find(af => af.fileType === 'dwg') || {
      status: null,
      path: null,
    };
    const e57 = augmentedFiles.find(af => af.fileType === 'e57') || {
      status: null,
      path: null,
    };
    const rcp = augmentedFiles.find(af => af.fileType === 'rcp') || {
      status: null,
      path: null,
    };
    return (
      <Modal onClose={onCancel} title="Prepare and Download">
        <Content>
          <SubHeader>Model</SubHeader>
          <AugmentButton
            fileType={dwg}
            label=".dwg"
            onClick={() => onRequestAugment('dwg')}
          />
          <SubHeader>Point Cloud</SubHeader>
          <AugmentButton
            fileType={e57}
            label=".e57"
            onClick={() => onRequestAugment('e57')}
          />
          <AugmentButton
            fileType={rcp}
            label=".rcp (.zip)"
            onClick={() => onRequestAugment('rcp')}
          />
        </Content>
      </Modal>
    );
  }
}
