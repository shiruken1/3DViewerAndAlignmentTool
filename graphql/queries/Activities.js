import { gql } from 'graphql.macro';

export default gql`
  query activities($projectId: ID!) {
    project(id: $projectId) {
      activities {
        id
        createdOn
        createdBy {
          firstName
          lastName
        }
        action
      }
    }
  }
`;
