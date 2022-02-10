import { gql } from 'graphql.macro';

export default gql`
  mutation sendRequestDiffs($input: SendRequestDiffsInput!) {
    sendRequestDiffs(input: $input) {
      account {
        id
      }
    }
  }
`;
