/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import ScanCard from 'components/ScanCard';
import SourceArtifactList from 'components/SourceArtifactList';

export default class extends React.PureComponent {
  static propTypes = {
    activeScanId: PropTypes.string,
    adminMode: PropTypes.bool.isRequired,
    perms: PropTypes.object.isRequired,
    associatedScanIds: PropTypes.arrayOf(PropTypes.string.isRequired)
      .isRequired,
    className: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    scans: PropTypes.arrayOf(PropTypes.object.isRequired),
    onLaunchAA: PropTypes.func.isRequired,
    onSelectScan: PropTypes.func.isRequired,
    onShowAssociate: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    onItemInfo: PropTypes.func.isRequired,
  };
  static defaultProps = {
    activeScanId: null,
    className: null,
    scans: null,
  };
  render() {
    const {
      activeScanId,
      adminMode,
      associatedScanIds,
      className,
      loading,
      scans,
      onLaunchAA,
      onSelectScan,
      onShowAssociate,
      onDeleteItem,
      onEditItem,
      onItemInfo,
      perms,
    } = this.props;
    return (
      <SourceArtifactList
        activeArtifactId={activeScanId}
        adminMode={adminMode}
        artifacts={scans}
        artifactsLabel="point clouds"
        artifactsLoading={loading}
        perms={perms}
        associatedArtifactIds={associatedScanIds}
        cardComponent={ScanCard}
        className={className}
        onDeleteItem={onDeleteItem}
        onEditItem={onEditItem}
        onItemInfo={onItemInfo}
        onSelect={onSelectScan}
        onLaunchAA={onLaunchAA}
        onShowAssociate={onShowAssociate}
      />
    );
  }
}
