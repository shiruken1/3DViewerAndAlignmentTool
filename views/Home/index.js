/* NPM */
import React from 'react';

/* App */
import WithNav from 'graphql/withNav';
import WithAccounts from 'graphql/withAccounts';

import Loading from 'components/Loading';
import AccountCard from 'components/AccountCard';

import CurrentUserContext from 'context/currentUser';

import Log from 'util/Log';

import css from './Home.module.scss';

export default () => (
  <WithNav>
    {({ adminMode, writeNav }) => (
      <CurrentUserContext.Consumer>
        {currentUser => (
          <WithAccounts adminMode={adminMode} currentUser={currentUser}>
            {({ accountsLoading, accounts }) => (
              <Loading loading={accountsLoading && !accounts}>
                {() => (
                  <div className={css.main}>
                    <div className={css.header}>
                      {`Workspaces ${currentUser.firstName} is Assigned To`}
                    </div>
                    <div className={css.content}>
                      {accounts.map(a => (
                        <AccountCard
                          key={a.id}
                          account={a}
                          adminMode={adminMode}
                          currentUser={currentUser}
                          hasProjects={
                            a.projects.filter(p => !p.deleted).length > 0
                          }
                          onProjectNew={() =>
                            writeNav({
                              modal: 'projectCreate',
                              activeAccountId: a.id,
                            })
                          }
                          onProjectView={pId =>
                            writeNav({
                              activeAccountId: a.id,
                              activeProjectId: pId,
                              view: 'project',
                            })
                          }
                          onProjectSelect={pId => Log(pId)}
                          onProjectEdit={pId =>
                            writeNav({
                              activeAccountId: a.id,
                              activeProjectId: pId,
                              modal: 'projectEdit',
                            })
                          }
                          onProjectDelete={pId =>
                            writeNav({
                              activeAccountId: a.id,
                              activeProjectId: pId,
                              modal: 'projectDelete',
                            })
                          }
                          onProjectPermissions={pId =>
                            writeNav({
                              activeAccountId: a.id,
                              activeProjectId: pId,
                              modal: 'projectShare',
                            })
                          }
                          onAccountSetThumbnail={() => Log(a.id)}
                          onAccountPermissions={() =>
                            writeNav({
                              activeAccountId: a.id,
                              modal: 'accountShare',
                            })
                          }
                          onAccountEdit={() =>
                            writeNav({
                              activeAccountId: a.id,
                              modal: 'accountEdit',
                            })
                          }
                          onAccountBuyDiffs={() =>
                            writeNav({
                              activeAccountId: a.id,
                              modal: 'buyDiffs',
                            })
                          }
                          onAccountAddDiffs={() =>
                            writeNav({
                              activeAccountId: a.id,
                              modal: 'addDiffs',
                            })
                          }
                          onAccountChangeOwner={() =>
                            writeNav({
                              activeAccountId: a.id,
                              modal: 'changeOwner',
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Loading>
            )}
          </WithAccounts>
        )}
      </CurrentUserContext.Consumer>
    )}
  </WithNav>
);
