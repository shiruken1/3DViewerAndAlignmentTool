/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import ModelCard from 'components/ModelCard';
import SourceArtifactList from 'components/SourceArtifactList';

export default class extends React.PureComponent {
  static propTypes = {
    activeModelId: PropTypes.string,
    adminMode: PropTypes.bool.isRequired,
    perms: PropTypes.object.isRequired,
    associatedModelIds: PropTypes.arrayOf(PropTypes.string.isRequired)
      .isRequired,
    className: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    models: PropTypes.arrayOf(PropTypes.object.isRequired),
    onSelectModel: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    onItemInfo: PropTypes.func.isRequired,
  };
  static defaultProps = {
    activeModelId: null,
    className: null,
    models: null,
  };
  render() {
    const {
      activeModelId,
      adminMode,
      associatedModelIds,
      className,
      loading,
      models,
      onSelectModel,
      onDeleteItem,
      onEditItem,
      onItemInfo,
      perms,
    } = this.props;
    return (
      <SourceArtifactList
        activeArtifactId={activeModelId}
        adminMode={adminMode}
        artifacts={models}
        artifactsLabel="models"
        artifactsLoading={loading}
        perms={perms}
        associatedArtifactIds={associatedModelIds}
        cardComponent={ModelCard}
        className={className}
        onSelect={onSelectModel}
        onDeleteItem={onDeleteItem}
        onEditItem={onEditItem}
        onItemInfo={onItemInfo}
      />
    );
  }
}
