/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import ActivityList from 'components/ActivityList';
import DiffBar from 'components/DiffBar';
import DiffList from 'components/DiffList';
import ModelList from 'components/ModelList';
import ScanList from 'components/ScanList';
import SortableList from 'components/SortableList';

import css from './Project.module.scss';

const scanSortOptions = [
  {
    text: 'Name',
    sortFunc: (a, b) => {
      const nameA = a.scan.name.toUpperCase();
      const nameB = b.scan.name.toUpperCase();
      if (nameA === nameB) return 0;
      return nameA < nameB ? -1 : 1;
    },
  },
  {
    text: 'Status',
    sortFunc: (a, b) => (a.scan.status < b.scan.status ? -1 : 1),
  },
  {
    text: 'Date',
    sortFunc: (a, b) => (a.scan.createdOn < b.scan.createdOn ? -1 : 1),
  },
];

export default class extends React.PureComponent {
  static propTypes = {
    activeDiffId: PropTypes.string,
    activeModelId: PropTypes.string,
    activeScanId: PropTypes.string,
    activities: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
    adminMode: PropTypes.bool.isRequired,
    associatedDiffIds: PropTypes.arrayOf(PropTypes.string.isRequired)
      .isRequired,
    associatedModelIds: PropTypes.arrayOf(PropTypes.string.isRequired)
      .isRequired,
    associatedScanIds: PropTypes.arrayOf(PropTypes.string.isRequired)
      .isRequired,
    diffInCart: PropTypes.object,
    diffs: PropTypes.arrayOf(PropTypes.object.isRequired),
    loading: PropTypes.bool.isRequired,
    models: PropTypes.arrayOf(PropTypes.object.isRequired),
    onAddToCart: PropTypes.func.isRequired,
    onPurchaseDiff: PropTypes.func.isRequired,
    onEditDiff: PropTypes.func.isRequired,
    onEditScan: PropTypes.func.isRequired,
    onEditModel: PropTypes.func.isRequired,
    onSelectDiff: PropTypes.func.isRequired,
    onSelectModel: PropTypes.func.isRequired,
    onLaunchAA: PropTypes.func.isRequired,
    onSelectScan: PropTypes.func.isRequired,
    onDeleteDiff: PropTypes.func.isRequired,
    onDeleteModel: PropTypes.func.isRequired,
    onModelInfo: PropTypes.func.isRequired,
    onScanInfo: PropTypes.func.isRequired,
    onDiffInfo: PropTypes.func.isRequired,
    onDeleteScan: PropTypes.func.isRequired,
    onSetDiffThumb: PropTypes.func.isRequired,
    onShowAssociate: PropTypes.func.isRequired,
    onViewDiff: PropTypes.func.isRequired,
    purchaseErrors: PropTypes.array,
    scans: PropTypes.arrayOf(PropTypes.object.isRequired),
    projectPermissions: PropTypes.shape({
      contentCreator: PropTypes.bool.isRequired,
    }).isRequired,
  };
  static defaultProps = {
    activeDiffId: null,
    activeModelId: null,
    activeScanId: null,
    diffInCart: null,
    diffs: null,
    models: null,
    purchaseErrors: [],
    scans: null,
  };

  render() {
    const {
      activeDiffId,
      activeModelId,
      activeScanId,
      activities,
      adminMode,
      associatedDiffIds,
      associatedModelIds,
      associatedScanIds,
      diffInCart,
      diffs,
      loading,
      models,
      onAddToCart,
      onPurchaseDiff,
      onSelectDiff,
      onDeleteDiff,
      onSelectModel,
      onEditDiff,
      onEditScan,
      onEditModel,
      onDeleteModel,
      onScanInfo,
      onModelInfo,
      onDiffInfo,
      onLaunchAA,
      onDeleteScan,
      onSelectScan,
      onSetDiffThumb,
      onShowAssociate,
      onViewDiff,
      purchaseErrors,
      scans,
      projectPermissions,
    } = this.props;
    const canDiff = scans.some(
      s =>
        s.scan.status === 'Done' &&
        s.diffs.length &&
        s.diffs[0].status === 'Done' &&
        !s.diffs[0].purchased,
    );
    return (
      <div className={css.content}>
        <DiffBar
          canDiff={canDiff && projectPermissions.contentCreator}
          className={css.bar}
          diffInCart={diffInCart}
          onAddToCart={onAddToCart}
          onPurchaseDiff={onPurchaseDiff}
          purchaseErrors={purchaseErrors}
          diffs={diffs}
        />
        <SortableList
          className={css.diff}
          title="Diffs"
          component={DiffList}
          items={diffs.filter(d => !d.deleted)}
          itemsProp="diffs"
          activeDiffId={activeDiffId}
          associatedDiffIds={associatedDiffIds}
          loading={loading}
          onSelectDiff={onSelectDiff}
          onSetThumb={onSetDiffThumb}
          onViewDiff={onViewDiff}
          onEditItem={onEditDiff}
          onDeleteItem={onDeleteDiff}
          perms={projectPermissions}
          onItemInfo={onDiffInfo}
        />
        <SortableList
          className={css.scan}
          title="Point Clouds"
          component={ScanList}
          items={scans}
          itemsProp="scans"
          options={scanSortOptions}
          activeScanId={activeScanId || activeDiffId}
          adminMode={adminMode}
          associatedScanIds={[...associatedScanIds, ...associatedDiffIds]}
          loading={loading}
          onAddToCart={onAddToCart}
          onSelectScan={onSelectScan}
          onLaunchAA={onLaunchAA}
          onShowAssociate={onShowAssociate}
          onEditItem={onEditScan}
          onDeleteItem={onDeleteScan}
          onItemInfo={onScanInfo}
          perms={projectPermissions}
          uploadType="uploadScan"
        />
        <SortableList
          className={css.model}
          title="Models"
          component={ModelList}
          items={models}
          itemsProp="models"
          activeModelId={activeModelId}
          adminMode={adminMode}
          associatedModelIds={associatedModelIds}
          models={models}
          loading={loading}
          onSelectModel={onSelectModel}
          onEditItem={onEditModel}
          onDeleteItem={onDeleteModel}
          onItemInfo={onModelInfo}
          perms={projectPermissions}
          uploadType="uploadModel"
        />
        <div className={css.activity}>
          <div className={css.header}>Project Activity</div>
          <div className={css.list}>
            <div className={css.inner}>
              <ActivityList activities={activities} stacked />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
