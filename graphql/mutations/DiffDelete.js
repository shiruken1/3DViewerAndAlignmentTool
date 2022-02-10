import { gql } from 'graphql.macro';

export default gql`
  mutation diffDelete($input: DiffDeleteInput!) {
    diffDelete(input: $input) {
      diff {
        id
        deleted
      }
    }
  }
`;
