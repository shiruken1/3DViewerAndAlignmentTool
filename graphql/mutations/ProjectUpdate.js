import { gql } from 'graphql.macro';

export default gql`
  mutation projectUpdate($input: ProjectUpdateInput!) {
    projectUpdate(input: $input) {
      project {
        id
        name
        description
      }
    }
  }
`;
