/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

/* App */
import Modal from 'modals/Modal';
import InfoTable from '../../components/InfoTable';

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 20.5px;
`;

export default class ModelInfo extends React.PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
  };

  render() {
    const { onCancel, model } = this.props;
    const rows = [
      { label: 'Name', value: model.name },
      { label: 'Description', value: model.description },
      { label: 'File', value: model.sourceFile },
      { label: '# of Objects', value: model.stats.numObjects },
      { label: 'Units', value: model.units },
    ];
    return (
      <Modal onClose={onCancel} title="Model Info">
        <Content>
          <InfoTable rows={rows} />
        </Content>
      </Modal>
    );
  }
}
