import { gql } from 'graphql.macro';

export default gql`
  mutation AccountUpdate($input: AccountUpdateInput!) {
    accountUpdate(input: $input) {
      account {
        name
        description
        diffsRemaining
        owner {
          id
        }
      }
    }
  }
`;
