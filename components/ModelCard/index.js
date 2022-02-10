/* NPM */
import React from 'react';
import PropTypes from 'prop-types';

/* App */
import CollapsingCard from 'components/CollapsingCard';
import InfoTable from 'components/InfoTable';
import ObjId from 'components/ObjId';
import SettingsMenu from 'components/SettingsMenu';

import format from 'lib/format';

import launchDownload from 'util/launchDownload';

import Status from './Status';
import css from './ModelCard.module.scss';

export default class extends React.PureComponent {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    artifact: PropTypes.shape({
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
      files: PropTypes.shape({
        sourceFile: PropTypes.string.isRequired,
        sourceFile2: PropTypes.string,
      }).isRequired,
    }).isRequired,
    associated: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onDeleteItem: PropTypes.func.isRequired,
    onEditItem: PropTypes.func.isRequired,
    onItemInfo: PropTypes.func.isRequired,
    perms: PropTypes.object.isRequired,
  };
  render() {
    const {
      active,
      artifact,
      associated,
      onClick,
      onDeleteItem,
      onEditItem,
      onItemInfo,
      perms,
    } = this.props;
    const rows = [
      { label: 'Date Added', value: format.date(artifact.createdOn) },
      { label: 'Status', value: <Status model={artifact} /> },
    ].filter(r => !!r);
    const extraRows = [
      artifact.sourceFile && {
        label: 'File Type',
        value: artifact.sourceFile.split('.').pop(),
      },
      {
        label: 'Added By',
        value: `${artifact.createdBy.firstName[0]}. ${
          artifact.createdBy.lastName
        }`,
      },
    ].filter(r => !!r);

    const menu = [
      {
        content: 'View More Info',
        key: 3,
        onClick: () => onItemInfo(artifact.id),
      },
    ];

    if (artifact.status !== 'Uploading') {
      menu.push({
        content: 'Download Model',
        key: 5,
        onClick: () => {
          launchDownload(artifact.files.sourceFile, artifact.sourceFile);
          if (artifact.files.sourceFile2) {
            launchDownload(artifact.files.sourceFile2, artifact.sourceFile2);
          }
        },
      });
    }
    if (perms.contentCreator) {
      menu.push(
        {
          content: 'Edit',
          key: 1,
          onClick: () => onEditItem(artifact.id),
        },
        {
          content: 'Delete',
          key: 2,
          onClick: () => onDeleteItem(artifact.id),
        },
      );
    }

    return (
      <CollapsingCard
        active={active}
        associated={associated}
        content={
          <React.Fragment>
            <ObjId id={artifact.id} label="model" />
            <InfoTable rows={rows} />
          </React.Fragment>
        }
        extra={
          <React.Fragment>
            <InfoTable rows={extraRows} />
            <div className={css.description}>{artifact.description}</div>
          </React.Fragment>
        }
        menu={<SettingsMenu items={menu} />}
        name={artifact.name}
        onClick={() => {
          onClick(artifact.id);
        }}
        perms={perms}
      />
    );
  }
}
