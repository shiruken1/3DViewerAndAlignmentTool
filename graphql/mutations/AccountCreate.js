import { gql } from 'graphql.macro';

export default gql`
  mutation accountCreate($input: AccountCreateInput!) {
    accountCreate(input: $input) {
      account {
        id
        name
        description
        owner {
          id
          firstName
          lastName
        }
      }
    }
  }
`;
