import { gql } from 'graphql.macro';

import ActivityInfo from '../fragments/ActivityInfo';

export default gql`
  #import '../fragments/activityInfo.graphql'

  query accounts($forUser: ID, $activitiesLimit: Int) {
    accounts(forUser: $forUser) {
      id
      name
      description
      owner {
        id
        firstName
        lastName
      }
      diffsRemaining
      projects {
        id
        name
        deleted
        description
        users {
          user {
            id
          }
        }
        activities(limit: $activitiesLimit) {
          ...ActivityInfo
        }
        effectivePermissions {
          inviter
          contentCreator
        }
        createdBy {
          firstName
          lastName
        }
      }
      activities(limit: $activitiesLimit) {
        ...ActivityInfo
      }
      effectivePermissions {
        owner
        inviter
        projectCreator
        contentCreator
      }
    }
  }

  ${ActivityInfo}
`;
