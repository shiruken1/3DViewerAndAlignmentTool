/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion/macro';

/* App */
import InfoTable from 'components/InfoTable';
import format from 'lib/format';
import unitDefs from 'util/units';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 12px;
`;

const Header = styled.header`
  border-top: solid 1px #cccccc;
  color: #464646;
  font-size: 12px;
  font-weight: 700;
  margin: 1px 0;
`;

export default class extends React.PureComponent {
  static propTypes = {
    diff: PropTypes.object.isRequired,
    diffSettings: PropTypes.object.isRequired,
  };
  render() {
    // eslint-disable-next-line no-unused-vars
    const { diff, diffSettings } = this.props;
    const viewUnits = diffSettings.units
      ? diffSettings.units
      : diff.model.units;
    const adjustedUnits = unitDefs[diff.scan.units].to[viewUnits];
    const avgResolution = (
      adjustedUnits * diff.scan.stats.averageDiffResolution
    ).toPrecision(unitDefs[viewUnits].precision);
    const maxResolution = (
      adjustedUnits * diff.scan.stats.bestDiffResolution
    ).toPrecision(unitDefs[viewUnits].precision);
    const modelName = `${diff.model.name} (${format.date(
      diff.model.createdOn,
    )} ${format.name(diff.model.createdBy)})`;
    const scanName = `${diff.scan.name} (${format.date(
      diff.scan.createdOn,
    )} ${format.name(diff.scan.createdBy)})`;
    const diffName = `${diff.name} (${format.date(
      diff.createdOn,
    )} ${format.name(diff.createdBy)})`;

    const modelRows = [
      { label: 'Name', value: modelName },
      { label: 'Description', value: diff.model.description },
      { label: 'File', value: diff.model.sourceFile },
      { label: '# Objects', value: diff.model.stats.numObjects },
    ];
    const scanRows = [
      { label: 'Name', value: scanName },
      { label: 'Description', value: diff.scan.description },
      { label: 'File', value: diff.scan.sourceFile },
      { label: 'Units', value: diff.scan.units },
      {
        label: 'Best Res.',
        value: `${maxResolution} ${unitDefs[viewUnits].display}`,
      },
      {
        label: 'Avg Res.',
        value: `${avgResolution} ${unitDefs[viewUnits].display}`,
      },
      { label: '# Points', value: diff.scan.stats.numPoints },
    ];
    const diffRows = [{ label: 'Name', value: diffName }];
    return (
      <Container>
        <Header>Model</Header>
        <InfoTable rows={modelRows} />
        <Header>Point Cloud</Header>
        <InfoTable rows={scanRows} />
        <Header>Diff</Header>
        <InfoTable rows={diffRows} />
      </Container>
    );
  }
}
