import { gql } from 'graphql.macro';

export default gql`
  mutation sendResetPassword($input: SendResetPasswordInput!) {
    sendResetPassword(input: $input) {
      user {
        email
      }
    }
  }
`;
