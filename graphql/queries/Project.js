import { gql } from 'graphql.macro';

export default gql`
  query project($id: ID!) {
    project(id: $id) {
      id
      name
      description
      users {
        user {
          id
          firstName
          lastName
          email
        }
        inviter
        contentCreator
      }
      effectivePermissions {
        inviter
        contentCreator
      }
      diffs {
        id
        modelId
        scanId
        name
        description
        status
      }
      models {
        id
        name
        description
        status
      }
      scans {
        id
        name
        description
        status
      }
    }
  }
`;
