import { gql } from 'graphql.macro';

export default gql`
  mutation resetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      user {
        id
      }
    }
  }
`;
