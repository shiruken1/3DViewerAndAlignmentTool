import { gql } from 'graphql.macro';

export default gql`
  mutation projectDelete($input: ProjectDeleteInput!) {
    projectDelete(input: $input) {
      project {
        id
        deleted
      }
    }
  }
`;
