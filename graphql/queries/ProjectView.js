import { gql } from 'graphql.macro';

import DiffInfo from '../fragments/DiffInfo';

export default gql`
  query projectView($projectId: ID!) {
    project(id: $projectId) {
      id
      name
      description
      users {
        user {
          id
        }
        inviter
        contentCreator
      }
      activities {
        ...ActivityInfo
      }
      diffs {
        ...DiffInfo
      }
      models {
        ...ModelInfo
      }
      scans {
        ...ScanInfo
      }
      effectivePermissions {
        inviter
        contentCreator
      }
    }
  }
  ${DiffInfo}
`;
