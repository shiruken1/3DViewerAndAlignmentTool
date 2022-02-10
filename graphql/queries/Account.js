import { gql } from 'graphql.macro';

export default gql`
  query account($id: ID!) {
    account(id: $id) {
      id
      name
      description
      owner {
        id
        firstName
        lastName
      }
      diffsRemaining
      users {
        user {
          id
          firstName
          lastName
          email
          emailVerified
        }
        inviter
        contentCreator
        projectCreator
      }
      effectivePermissions {
        owner
        inviter
        projectCreator
        contentCreator
      }
      projects {
        id
        name
        description
      }
    }
  }
`;
