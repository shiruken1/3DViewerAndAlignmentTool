/* NPM */
import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'semantic-ui-react';

/* App */
import AccountName from 'components/AccountName';
import ObjId from 'components/ObjId';

import css from './Breadcrumb.module.scss';

const Divider = () => <Breadcrumb.Divider icon="right angle" />;

const Section = ({ content, visible, onClick }) =>
  visible && (
    <Breadcrumb.Section
      className={css.section}
      content={content}
      link={!!onClick}
      onClick={onClick}
    />
  );

Section.propTypes = {
  content: PropTypes.node,
  onClick: PropTypes.func,
  visible: PropTypes.bool.isRequired,
};

Section.defaultProps = {
  content: null,
  onClick: null,
};
export default class extends React.PureComponent {
  static propTypes = {
    account: PropTypes.object,
    diff: PropTypes.object,
    project: PropTypes.object,
    view: PropTypes.string.isRequired,
    onSetView: PropTypes.func.isRequired,
    adminMode: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    account: null,
    diff: null,
    project: null,
  };

  render() {
    const { account, diff, project, view, onSetView, adminMode } = this.props;
    return (
      <div className={css.main}>
        <Breadcrumb>
          <Section
            content="Home " // please leave this space
            onClick={view === 'home' ? null : () => onSetView('home')}
            visible
          />
          {view !== 'home' && <Divider />}
          <Section
            content={
              <React.Fragment>
                {account && <AccountName account={account} />}
                {' : '}
                {project && project.name}
              </React.Fragment>
            }
            onClick={
              view === 'diff' || view === 'align'
                ? () => onSetView('project')
                : null
            }
            visible={view !== 'home'}
          />
          {adminMode && (
            <React.Fragment>
              <br />
              <ObjId id={account ? account.id : null} label="account" />
              <ObjId id={project ? project.id : null} label="project" />
            </React.Fragment>
          )}
          {view === 'diff' && <Divider />}
          <Section
            content={diff && ` ${diff.name}`}
            visible={view === 'diff'}
          />
        </Breadcrumb>
      </div>
    );
  }
}
