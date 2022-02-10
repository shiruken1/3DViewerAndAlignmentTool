/* NPM */
import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'graphql.macro';

/* App */
import WithNav from 'graphql/withNav';
import Loading from 'components/Loading';

import Breadcrumb from './component';

const query = gql`
  query breadcrumbQuery(
    $withAccount: Boolean!
    $accountId: ID!
    $withProject: Boolean!
    $projectId: ID!
    $withDiff: Boolean!
    $diffId: ID!
  ) {
    account(id: $accountId) @include(if: $withAccount) {
      id
      name
      owner {
        id
        firstName
        lastName
      }
    }
    project(id: $projectId) @include(if: $withProject) {
      id
      name
    }
    diff(id: $diffId) @include(if: $withDiff) {
      id
      name
    }
  }
`;

export default () => (
  <WithNav>
    {({
      activeAccountId,
      activeDiffId,
      activeProjectId,
      adminMode,
      view,
      writeNav,
    }) => {
      if (!activeAccountId) {
        return (
          <Breadcrumb
            view={view}
            adminMode={adminMode}
            onSetView={newView => writeNav({ view: newView })}
          />
        );
      }
      return (
        <Query
          query={query}
          variables={{
            withAccount: !!activeAccountId,
            accountId: activeAccountId || '',
            withProject: !!activeProjectId,
            projectId: activeProjectId || '',
            withDiff: !!activeDiffId,
            diffId: activeDiffId || '',
          }}
          pollInterval={30000}>
          {({ loading, data, error }) => (
            <Loading loading={loading && !data}>
              {() => {
                if (
                  error &&
                  !/GraphQL error: Unauthorized/.test(error.message)
                ) {
                  throw error;
                }
                const { account, project, diff } = data;
                return (
                  <Breadcrumb
                    view={view}
                    diff={diff}
                    account={account}
                    project={project}
                    adminMode={adminMode}
                    onSetView={newView => writeNav({ view: newView })}
                  />
                );
              }}
            </Loading>
          )}
        </Query>
      );
    }}
  </WithNav>
);
