import { gql } from 'graphql.macro';

export default gql`
  mutation modelDelete($input: ModelDeleteInput!) {
    modelDelete(input: $input) {
      model {
        id
        deleted
      }
    }
  }
`;
