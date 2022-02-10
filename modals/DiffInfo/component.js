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

export default class DiffInfo extends React.PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    diff: PropTypes.object.isRequired,
  };

  render() {
    const { onCancel, diff } = this.props;
    const rows = [
      { label: 'Name', value: diff.name },
      { label: 'Description', value: diff.description },
      { label: 'Object Diff', value: <a href={diff.files.objdiff}>objdiff</a> },
    ];
    return (
      <Modal title="Diff Info" onClose={onCancel}>
        <Content>
          <InfoTable rows={rows} />
        </Content>
      </Modal>
    );
  }
}
