/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import CollapsingCard from 'components/CollapsingCard';
import InfoTable from 'components/InfoTable';
import ObjId from 'components/ObjId';
import SettingsMenu from 'components/SettingsMenu';
import Button from 'components/Button';

import format from 'lib/format';

import launchDownload from 'util/launchDownload';

import Status from './Status';
import css from './ScanCard.module.scss';

export default class extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    artifact: PropTypes.shape({
      diffs: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string,
          description: PropTypes.string,
          createdBy: PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
          }).isRequired,
          createdOn: PropTypes.string.isRequired,
          status: PropTypes.string.isRequired,
        }),
      ),
      scan: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        createdBy: PropTypes.shape({
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
        }).isRequired,
        createdOn: PropTypes.string.isRequired,
        sourceFile: PropTypes.string,
        status: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    associated: PropTypes.bool.isRequired,
    isDragging: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    onItemInfo: PropTypes.func.isRequired,
    onLaunchAA: PropTypes.func.isRequired,
    onShowAssociate: PropTypes.func.isRequired,
    perms: PropTypes.shape({
      contentCreator: PropTypes.bool.isRequired,
    }).isRequired,
  };
  render() {
    const {
      active,
      perms,
      artifact: { scan, diffs },
      associated,
      isDragging,
      onClick,
      onDeleteItem,
      onEditItem,
      onItemInfo,
      onLaunchAA,
      onShowAssociate,
    } = this.props;
    const diff = !!diffs.length && diffs[0];
    const purchased = diff ? diff.purchased : false;
    const isAssociated = !!diff && !!diff.modelId;
    const canAlign =
      isAssociated &&
      // no method selected yet
      (!diff.alignment ||
        !diff.alignment.method ||
        // chose AA and ready for AA
        (diff.alignment.method === 'Assisted' &&
          diff.status === 'Created' &&
          (diff.scan.status === 'Done' && diff.model.status === 'Done')) ||
        // chosen method has failed
        diff.status === 'Failed');
    const rows = [
      { label: 'Date Added', value: format.date(scan.createdOn) },
      { label: 'Status', value: <Status diff={diffs[0]} scan={scan} /> },
    ];
    const extraRows = [
      {
        label: 'File Type',
        value: scan.sourceFile.split('.').pop(),
      },
      {
        label: 'Added By',
        value: `${scan.createdBy.firstName[0]}. ${scan.createdBy.lastName}`,
      },
      {
        label: 'Cost',
        value: Math.ceil(scan.stats.numPoints / 100000000),
      },
    ].filter(r => !!r);

    const menu = [
      { content: 'View More Info', key: 3, onClick: () => onItemInfo(scan.id) },
    ];

    if (scan.status !== 'Uploading') {
      menu.push({
        content: 'Download Pt. Cloud',
        key: 5,
        onClick: () => launchDownload(scan.files.sourceFile, scan.sourceFile),
      });
    }

    if (perms.contentCreator) {
      menu.push(
        {
          content: 'Edit',
          key: 1,
          onClick: () => onEditItem(scan.id),
        },
        {
          content: 'Delete',
          key: 2,
          onClick: () => onDeleteItem(scan.id),
        },
      );
    }
    if (diff.purchased !== true) {
      menu.push({
        content: 'Change Alignment',
        key: 4,
        onClick: () => onShowAssociate(scan.id),
      });
    }

    return (
      <CollapsingCard
        active={active}
        associated={associated}
        content={
          <React.Fragment>
            <ObjId id={scan.id} label="scan" />
            <ObjId id={diff ? diff.modelId : null} label="model" />
            <ObjId id={diff ? diff.id : null} label="diff" />
            {(!isAssociated || canAlign) &&
              !purchased &&
              perms.contentCreator && (
                <div className={css.actionButton}>
                  <Button
                    primary
                    onClick={e => {
                      if (
                        diff.alignment &&
                        diff.alignment.method === 'Assisted' &&
                        scan.stats.numPlanes >= 3
                      )
                        onLaunchAA(diff.id);
                      else onShowAssociate(scan.id);
                      e.stopPropagation(); // lest the onClick above get fired...
                    }}>
                    {isAssociated ? 'Align' : 'Associate'}
                  </Button>
                </div>
              )}
            <InfoTable rows={rows} />
          </React.Fragment>
        }
        extra={
          <React.Fragment>
            <InfoTable rows={extraRows} />
            <div className={css.description}>{scan.description}</div>
          </React.Fragment>
        }
        dragging={isDragging}
        menu={<SettingsMenu items={menu} />}
        name={scan.name}
        onClick={() => {
          onClick(scan.id);
        }}
        purchased={purchased}
        perms={perms}
      />
    );
  }
}
