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

export default class ScanInfo extends React.PureComponent {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    scan: PropTypes.object.isRequired,
  };

  render() {
    const { onCancel, scan } = this.props;
    const { averageDiffResolution, bestDiffResolution } = scan.stats;
    const best = bestDiffResolution ? bestDiffResolution.toFixed(4) : 'N/A';
    const average = averageDiffResolution
      ? averageDiffResolution.toFixed(4)
      : 'N/A';
    const rows = [
      { label: 'Name', value: scan.name },
      { label: 'Description', value: scan.description },
      { label: 'File', value: scan.sourceFile },
      { label: 'Units', value: scan.units },
      { label: '# Points', value: scan.stats.numPoints },
      { label: 'Best Res.', value: best },
      { label: 'Avg Res.', value: average },
    ];
    return (
      <Modal title="Point Cloud Info" onClose={onCancel}>
        <Content>
          <InfoTable rows={rows} />
        </Content>
      </Modal>
    );
  }
}
