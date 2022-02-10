import { gql } from 'graphql.macro';

export default gql`
  mutation resendVerifyEmail($input: ResendVerifyEmailInput!) {
    resendVerifyEmail(input: $input) {
      dummy
    }
  }
`;
