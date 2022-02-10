import { gql } from 'graphql.macro';

export default gql`
  mutation projectCreate($input: ProjectCreateInput!) {
    projectCreate(input: $input) {
      project {
        id
        name
        description
      }
    }
  }
`;
