import { gql } from 'graphql.macro';

export default gql`
  query models($projectId: ID!) {
    models(projectId: $projectId) {
      id
      name
      description
      status
      deleted
      createdBy {
        id
        firstName
        lastName
      }
      createdOn
      sourceFile
      units
    }
  }
`;
